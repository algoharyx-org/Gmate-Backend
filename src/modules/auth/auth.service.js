import User from "../../DB/models/user.model.js";
import { createConflictError } from "../../utils/APIErrors.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/tokens.js";

export const registerService = async (userData) => {
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    return createConflictError("User already exists");
  }

  const user = await User.create(userData);

  const accessToken = generateAccessToken({ _id: user._id, role: user.role });
  const refreshToken = generateRefreshToken({ _id: user._id, role: user.role });

  return { user, accessToken, refreshToken };
};