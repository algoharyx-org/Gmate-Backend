import { Router } from "express";
import { createAccessToken, login, logout, register } from "./auth.controller.js";
import { authentication } from "../../middlewares/authentication.js";
import { authLimiter } from "../../middlewares/rateLimit.js";

const authRouter = Router();

authRouter.post("/register", authLimiter, register);
authRouter.post("/login", authLimiter, login);
authRouter.post('/refresh', authentication, createAccessToken);
authRouter.post('/logout', authentication, logout);

export default authRouter;