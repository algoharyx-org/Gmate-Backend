import { Router } from "express";
import {
  changeUserPassword,
  createAccessToken,
  forgotPassword,
  getCurrentUser,
  login,
  logout,
  register,
  resetPassword,
  updateProfile,
  verifyResetPasswordCode,
} from "./auth.controller.js";
import { authentication } from "../../middlewares/authentication.js";
import { authLimiter } from "../../middlewares/rateLimit.js";
import Validate from "../../middlewares/validate.js";
import {
  changePasswordValidation,
  forgotPasswordValidation,
  loginValidation,
  registerValidation,
  resetPasswordValidation,
  updateProfileValidation,
  verifyResetPasswordCodeValidation,
} from "./auth.validator.js";

const authRouter = Router();

authRouter.post(
  "/register",
  authLimiter,
  Validate(registerValidation),
  register,
);
authRouter.post("/login", authLimiter, Validate(loginValidation), login);
authRouter.post("/refresh", authentication, createAccessToken);
authRouter.post("/logout", authentication, logout);
authRouter.get("/me", authentication, getCurrentUser);
authRouter.put(
  "/updateProfile",
  authentication,
  Validate(updateProfileValidation),
  updateProfile,
);
authRouter.put(
  "/changePassword",
  authentication,
  Validate(changePasswordValidation),
  changeUserPassword,
);
authRouter.post(
  "/forgotPassword",
  authLimiter,
  Validate(forgotPasswordValidation),
  forgotPassword,
);
authRouter.post(
  "/verifyResetPasswordCode",
  authentication,
  Validate(verifyResetPasswordCodeValidation),
  verifyResetPasswordCode,
);
authRouter.put(
  "/resetPassword",
  authentication,
  Validate(resetPasswordValidation),
  resetPassword,
);

export default authRouter;
