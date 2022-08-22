const mongoose= require("mongoose");






mongoose.connect(process.env.CONNECTION);
try {
console.log("server connection successful")   
} catch (error) {
    console.log(error);  
}

