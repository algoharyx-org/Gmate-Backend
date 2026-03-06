import Joi from "joi";

export const createUserValidator = Joi.object({
  name: Joi.string()
    .min(1)
    .required()
    .messages({
      "string.empty": "Name is required",
      "any.required": "Name is required"
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.email": "Invalid email format",
      "any.required": "Email is required"
    }),

  password: Joi.string()
    .min(6)
    .required()
    .messages({
      "string.min": "Password must be at least 6 characters",
      "any.required": "Password is required"
    })
});