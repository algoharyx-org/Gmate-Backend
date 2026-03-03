import { Router } from "express";
import { changeUserPassword, createAccessToken, getCurrentUser, login, logout, register, updateProfile } from "./auth.controller.js";
import { authentication } from "../../middlewares/authentication.js";
import { authLimiter } from "../../middlewares/rateLimit.js";
import Validate from "../../middlewares/validate.js";
import { changePasswordValidation, loginValidation, registerValidation, updateProfileValidation } from "./auth.validator.js";

const authRouter = Router();

authRouter.post("/register", authLimiter, Validate(registerValidation), register);
authRouter.post("/login", authLimiter, Validate(loginValidation), login);
authRouter.post('/refresh', authentication, createAccessToken);
authRouter.post('/logout', authentication, logout);
authRouter.get('/me', authentication, getCurrentUser);
authRouter.put('/updateProfile', authentication, Validate(updateProfileValidation), updateProfile);
authRouter.put('/changePassword', authentication, Validate(changePasswordValidation), changeUserPassword);

export default authRouter;