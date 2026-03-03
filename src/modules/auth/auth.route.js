import { Router } from "express";
import { changeUserPassword, createAccessToken, getCurrentUser, login, logout, register, updateProfile } from "./auth.controller.js";
import { authentication } from "../../middlewares/authentication.js";
import { authLimiter } from "../../middlewares/rateLimit.js";

const authRouter = Router();

authRouter.post("/register", authLimiter, register);
authRouter.post("/login", authLimiter, login);
authRouter.post('/refresh', authentication, createAccessToken);
authRouter.post('/logout', authentication, logout);
authRouter.get('/me', authentication, getCurrentUser);
authRouter.put('/updateProfile', authentication, updateProfile);
authRouter.put('/changePassword', authentication, changeUserPassword);

export default authRouter;