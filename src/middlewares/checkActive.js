import { createForbiddenError } from "../utils/APIErrors.js";
import expressAsyncHandler from "express-async-handler";

export const checkActive = expressAsyncHandler((req, res, next) => {
  if (!req.user.active) {
    throw createForbiddenError("Your account is not active");
  }
  next();
});