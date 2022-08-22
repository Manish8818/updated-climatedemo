const mongoose= require("mongoose");
const bcrypt= require("bcrypt");
const jwt= require("jsonwebtoken");
const{ObjectId}= mongoose.Schema.Types


const userSchema=  new mongoose.Schema({

name:{
    type:String,
    required:[true,"please enter the email"],
    trim:true
    
},
lastname:{
    type:String,
    required:true
},
email:{
    type:String,
    required:true,
    trim:true
},
password:{
    type:String,
    required:[true,"please enter the password"],
    min:[5,"minimum 5 character are required"]
},
phone:{
    type:String,
    required:true,
},
post:[{
    type:ObjectId,
    ref:"product"

}],
followers:[{
    type:ObjectId,
    ref:"User"
}],
following:[
 {
type:ObjectId,
ref:"User"
}
]


 
})
//jsonweb token//
userSchema.methods.generateAuthtoken= async function(){
try{
    const token = jwt.sign({_id:this._id},process.env.KEY);
    return token;
}catch(error){
 console.log(error);
}

}




//password hashing//
userSchema.pre("save", async function(next){
    if (this.isModified("password"))
    {console.log(`the current password is the ${this.password}`);
    this.password=  await bcrypt.hash(this.password,10);
    console.log(`the currnt passwird is the ${this.password}`);

    }
    next();

})




const User=  new mongoose.model("User",userSchema);
module.exports= User;

