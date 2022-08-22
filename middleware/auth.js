const jwt= require("jsonwebtoken");
const User= require("../schema/user");


const auth = async(req,res,next)=>{

    try {const token= req.cookies.jwt;
        if(!token){
            res.status(404).json({success:false, message:err.message});
        }
        const verifyUser=  jwt.verify(token,process.env.KEY);
        // console.log(verifyUser);

       
        const User= require("../schema/user");
       const user= await User.findOne({_id:verifyUser._id});
       //console.log(user._id);
       req.user= user;
        // console.log(user);
       
        next();
       
    } catch (error) {
        res.send(error);   
    }
    
}

module.exports=auth;

