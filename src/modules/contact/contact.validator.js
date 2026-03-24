import Joi from "joi";

export const contactValidation = Joi.object({
  body: Joi.object({
    name: Joi.string().min(3).max(100).trim().required(),
    email: Joi.string().email().lowercase().trim().required(),
    message: Joi.string().min(5).required(),
  }).required(),
});