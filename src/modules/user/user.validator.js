import Joi from "joi";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

export const createUserValidator = Joi.object({ 

  body: Joi.object({
      name: Joi.string().min(3).max(100).trim().required(),
      email: Joi.string().email().lowercase().trim().required(),
      password: Joi.string()
        .min(8)
        .pattern(passwordRegex)
        .required("Password is required"),
      confirmPassword: Joi.string()
        .min(8)
        .pattern(passwordRegex)
        .required("Confirm password is required")
        .valid(Joi.ref("password")),
      bio: Joi.string().min(10).optional(),
    }).required(),

});



export const updateUserValidator = Joi.object({
  
   body: Joi.object({
      name: Joi.string().min(3).max(100).trim().optional(),
      email:Joi.string().required(),
      bio: Joi.string().min(10).optional(),
      avatar: Joi.string().uri().optional(),
    }).required(),
  

})



