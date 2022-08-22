
const mongoose= require("mongoose");
const {ObjectId} = mongoose.Schema.Types;


const productSchema= new mongoose.Schema({

name:{
    type:String,
    required:true,
    min:2,
    max:100

},
likes:[
    {type:ObjectId,
    ref:"User"
    },
],
dislike:[
    {
        type:ObjectId,
        ref:"User"
    }
],
comments:[{
   user:{type:ObjectId,
         ref:"User" },
    comment:{
        type:String,
        required:true
    }

}],
description:{
    type:String,
    required:true,
    min:20,
    max:200}

,
owner:{
    type:ObjectId,
    ref:"User"
},
createdat:{
    type:Date,
    default:Date.now(),
}
})

const product= new mongoose.model("product", productSchema);
module.exports = product;
