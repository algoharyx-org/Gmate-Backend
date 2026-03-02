import { Router } from "express";
import { createAccessToken, login, logout, register } from "./auth.controller.js";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post('/refresh', createAccessToken);
authRouter.post('/logout', logout);
export default authRouter;