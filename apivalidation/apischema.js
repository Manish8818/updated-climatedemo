const Joi= require("joi");

const registrationSchema= Joi.object({

    name:Joi.string().lowercase().min(2).max(50).required(),
    lastname:Joi.string().lowercase().min(2).max(50),
    email:Joi.string().lowercase().min(5).max(100).email().uppercase(),
    password:Joi.string().uppercase().lowercase().min(5).max(20),
    cpassword:Joi.string().uppercase().lowercase().min(5).max(20),
    phone:Joi.string().lowercase().max(12).min(2)

}
)

const loginSchema= Joi.object({
    email:Joi.string().lowercase().uppercase().min(2).max(50).required(),
    password:Joi.string().lowercase().uppercase().min(5).max(20)
})


const productSchema= Joi.object({
    name:Joi.string().lowercase().uppercase().max(100).min(2),
    like: Joi.number().min(1),
    description:Joi.string().lowercase().uppercase().min(2).max(200)
})


module.exports= {registrationSchema,loginSchema,productSchema}
