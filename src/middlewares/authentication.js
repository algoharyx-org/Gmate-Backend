import expressAsyncHandler from "express-async-handler";
import { verifyToken } from "../utils/tokens.js";
import User from "../DB/models/user.model.js";
import {
  createNotFoundError,
  createUnauthorizedError,
} from "../utils/APIErrors.js";

export const authentication = expressAsyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    throw createUnauthorizedError("Login first");
  }

  const decoded = verifyToken(token);
  const user = await User.findById(decoded._id).select("-password");

  if (!user) {
    throw createNotFoundError("User not found");
  }

  req.userId = decoded._id;
  req.user = user;
  next();
});
