import { Router } from "express";
import { createAccessToken, login, logout, register } from "./auth.controller.js";
import { authentication } from "../../middlewares/authentication.js";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post('/refresh', authentication, createAccessToken);
authRouter.post('/logout', authentication, logout);
export default authRouter;