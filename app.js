require('dotenv').config();
const express = require("express");
const app= express();
const port= process.env.PORT||2000;
const cookieParser= require("cookie-parser");
const User= require("./schema/user");
const jwt = require("jsonwebtoken")
const bcrypt= require("bcrypt");
const auth= require('./middleware/auth.js')
const product= require("./posts/product.js")
const {registrationSchema,loginSchema,productSchema}= require("./apivalidation/apischema");



require("./db/conn");
app.use(cookieParser());
app.use(express.json());

app.get("/",(req  ,res)=>{
    res.send("hello from the home side");
})

app.get("/new",auth,(req,res)=>{
  res.send("welcome to the new page");
  console.log(req.user._id);
  
})


app.post("/register", async(req,res)=>{
  const{name,lastname,email,password,cpassword,phone}=req.body;
  if(!name||!lastname||!email||!password||!cpassword||!phone){
    res.send("please enter the all fileds");
  }
  const rightUser= await registrationSchema.validateAsync(req.body);
  if(!rightUser){
    res.send("user is not valid");
  }
try{
    const userExist=await User.findOne({email:email})
    if(userExist){
        res.send("user is already exist")
    }
    if(password===cpassword){
       const user= await new User(req.body);
       const saveUser= await user.save()
       console.log(saveUser);
       const token= user.generateAuthtoken();
       console.log(token)
       res.cookie("jwt",token,
       {expires: new Date(Date.now()+90*24*60*60*1000),
        httpOnly:true
    })
      
      res.send("user registration successfully");
    }

}catch(error){
res.send(error);
  }  
})




app.post("/login",async(req,res)=>{
const{email,password}=req.body;
const userValid= await loginSchema.validateAsync(req.body);
if(!userValid){
  res.send("please fill all the details carefully");
}
try{
const findUser= await User.findOne({email:email});
const isMatch= bcrypt.compare(password,findUser.password);

const token= await findUser.generateAuthtoken();

 res.cookie("jwt",token,{

  expires:new Date(Date.now()+24*60*60*1000),
  httpOnly:true
 })

if(isMatch){
    res.send("login completed");
}else{
  res.send("invalid password details");
}

}catch(error){
res.send(error)
}
})

app.get("/logout", auth, async(req,res)=>{
  
  try { 
      res.clearCookie("jwt");
    res.send("logout succesfully..")
 
    

  } catch (error) { console.log(error);
    res.status(404).send(error);
  }

})
//products routes//


app.post("/product", auth , async (req,res)=>{
  const validDetails= await productSchema.validateAsync(req.body);
  if(!validDetails){
    res.send("the given product details are not valid please enter it again")
  }
  
  

 try{
   const details=  await new product(req.body);
   const owner= await req.user._id;
   
 
  const user= await User.findById(req.user._id)
    await saveProduct.owner.push(owner);
  const saveProduct= await details.save();
  user.post.push(saveProduct._id);
  await user.save();
 
  res.send("nice man!...")
  
}catch(err){
  res.status(201).json({message:err.message,success:true});
}

})
app.get("/product", auth, async(req,res)=>{
  try{
  const findProduct= await product.find({})
  console.log(findProduct)
  res.send(findProduct)
  }catch(err){
    res.json({message:"error"})
  }
})

app.patch("/update/:id",auth,  async (req,res)=>{
  try{
    const _id= req.params.id;
    const productSave= await product.findOne({_id:_id})
    if(!productSave){
      res.send("product is not found")
    }else{
 const findProduct= await product.findByIdAndUpdate(req.params.id,req.body)
  console.log(findProduct)
  res.json ({message:"updated successful"})}

  
  }catch(err){
    res.send(err);
  }

})
app.delete("/product/delete/:id",auth,async(req,res)=>{
try{
const id= req.params.id;
const postDelete=  await product.findOne({_id:id});
// console.log(postDelete)
if(!postDelete){
  res.json({message:"post is not found"})};
  console.log(postDelete.owner._id);
  if(postDelete.owner.tostring()!=req.user._id.tostring()){
  res.json({mesage:"you cannot delete this is post"})
}
else{
  await postDelete.remove();
  const user= await User.findOne({_id:req.user._id});
  const index= user.post.indexOf(req.params._id);
  user.post.splice(index,1);
  await user.save();
 res.send("user post is deleted")
}
}catch(err){
  res.status(401).json({message:err.message, success:false});
  console.log(err);
}

})


app.put("/product/like/:id", auth, async(req,res)=>{
  try{
 const id= req.params.id;
 const post= await product.findById(id);
 if(!post){
  res.status(401).json({message:"post not found"})
 }
 if(post.likes.includes(req.user._id)){
  const index= post.likes.indexOf(req.user._id)
  post.likes.splice(index,1);
  await post.save();
  res.status(201).json({message:"post is disliked"})}
  else{
    post.likes.push(req.user._id);
    await post.save()
    res.status(201).json({message:"post is liked"});
  }
  }catch(err){
    res.status(401).json("post is not found to be liked")
  }
 })


app.put("/product/comment/:id", auth, async(req,res)=>{
const id= req.params._id;
 const findProduct= await product.findOne({id})
//  console.log(findProduct);
 const comment= {
  comment:req.body,
  postedBy:req.user._id
 }
 const findAndUpdate= await product.findByIdAndUpdate(id,{$push:{comments:comment}})

console.log(findAndUpdate)

})

app.post("/updatepassword",auth, async(req,res)=>{
try{

const user= await User.findOne({_id:req.user._id})
if(!user){
  res.json({message:"user is not authenticated"})
}
else{
const{oldpassword, newpassword}=req.body;

const verifypassword= await bcrypt.compare(user.password,oldpassword );
if(!verifypassword){
  res.json({message:"old password  is wrong"})
}
  password= newpassword;
  await User.save();
  res.json({message:"password is updated successfully"})

}
}catch(err){
  res.json({message:err.message})
}
})
app.post("/updateprofile",auth, async(req,res)=>{
  const{email,lastname,name}= req.body;
// if(!email||!lastname||!name){
//   res.json({message:"please enter atleast one filed to update"})
// }
  try{
const user= await User.findOne({_id:req.user._id})
if(!user){
  res.json({message:"user is not verified"})
}

if(email){
  user.email= email
} 

if(lastname){
  user.lastname= lastname;
}
if(name){
  user.name= name;
}
 await user.save()
res.json({message:"all the filels are successfullt updated"})


}catch(err){
  res.json({message:err.message})
}})

app.get("/profiledelete",auth, async(req,res)=>{

  try{
const user=  await  User.findOne({_id:req.user._id})
console.log(user)
if(!user){
  res.json({ message:"only user can delete this account"})
}
const postid= await user.post;
console.log(postid)
await user.remove();

for(let i=0; i<=postid.length; i++){
  const deletepost= await postid.findById(post[i]);
  await deletepost.remove();
 
}
res.json({message:"user and the post are delete successfully"})



}catch(err){
  res.status(401).json({message:err.message})
}

})


app.listen(port,()=>{
    console.log(`server listen to the port number ${port}`);
})

