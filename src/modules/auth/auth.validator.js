import Joi from "joi";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

export const registerValidation = Joi.object({
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

export const loginValidation = Joi.object({
  body: Joi.object({
    email: Joi.string().email().lowercase().trim().required(),
    password: Joi.string().min(8).pattern(passwordRegex).required(),
  }).required(),
});

export const updateProfileValidation = Joi.object({
  body: Joi.object({
    name: Joi.string().min(3).max(100).trim().optional(),
    bio: Joi.string().min(10).optional(),
    avatar: Joi.string().uri().optional(),
  }).required(),
});

export const changePasswordValidation = Joi.object({
  body: Joi.object({
    oldPassword: Joi.string().min(8).pattern(passwordRegex).required(),
    newPassword: Joi.string().min(8).pattern(passwordRegex).required(),
    confirmNewPassword: Joi.string()
      .min(8)
      .pattern(passwordRegex)
      .required()
      .valid(Joi.ref("newPassword")),
  }).required(),
});

export const forgotPasswordValidation = Joi.object({
  body: Joi.object({
    email: Joi.string().email().lowercase().trim().required(),
  }).required(),
});

export const verifyResetPasswordCodeValidation = Joi.object({
  body: Joi.object({
    resetCode: Joi.string().required(),
  }).required(),
});

export const resetPasswordValidation = Joi.object({
  body: Joi.object({
    password: Joi.string().min(8).pattern(passwordRegex).required(),
    confirmPassword: Joi.string()
      .min(8)
      .pattern(passwordRegex)
      .required()
      .valid(Joi.ref("password")),
  }).required(),
});
