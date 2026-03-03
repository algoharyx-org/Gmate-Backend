import { Router } from "express";
import { changeUserPassword, createAccessToken, getCurrentUser, login, logout, register, updateProfile } from "./auth.controller.js";
import { authentication } from "../../middlewares/authentication.js";
import { authLimiter } from "../../middlewares/rateLimit.js";
import { changePasswordValidator, loginValidator, registerValidator, updateProfileValidator } from "./auth.validator.js";

const authRouter = Router();

authRouter.post("/register", authLimiter, registerValidator, register);
authRouter.post("/login", authLimiter, loginValidator, login);
authRouter.post('/refresh', authentication, createAccessToken);
authRouter.post('/logout', authentication, logout);
authRouter.get('/me', authentication, getCurrentUser);
authRouter.put('/updateProfile', authentication, updateProfileValidator, updateProfile);
authRouter.put('/changePassword', authentication, changePasswordValidator, changeUserPassword);

export default authRouter;