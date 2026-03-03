import User from "../../DB/models/user.model.js";
import { createConflictError, createNotFoundError, createUnauthorizedError } from "../../utils/APIErrors.js";
import { generateAccessToken, generateRefreshToken, verifyToken } from "../../utils/tokens.js";

export const registerService = async (userData) => {
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw createConflictError("User already exists");
  }

  const user = await User.create(userData);

  const accessToken = generateAccessToken({ _id: user._id, role: user.role });
  const refreshToken = generateRefreshToken({ _id: user._id, role: user.role });

  user.password = undefined;
  return { user, accessToken, refreshToken };
};

export const loginService = async (userData) => {
  const user = await User.findOne({ email: userData.email }).select('+password');
  if (!user) {
    throw createUnauthorizedError("Invalid email or password");
  }
  
  const isMatch = await user.comparePassword(userData.password);
  if (!isMatch) {
    throw createUnauthorizedError("Invalid email or password");
  }
  
  const accessToken = generateAccessToken({ _id: user._id, role: user.role });
  const refreshToken = generateRefreshToken({ _id: user._id, role: user.role });
  
  user.password = undefined;
  return { user, accessToken, refreshToken };
}

export const verifyRefreshToken = async (refreshToken) => {
  if (!refreshToken) {
    throw createUnauthorizedError("Refresh token required");
  }

  const decoded = verifyToken(refreshToken);
  const accessToken = generateAccessToken({_id: decoded._id, role: decoded.role});
  
  return accessToken;
}

export const getCurrentUserService = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw createNotFoundError("User not found");
  }
  return user;
}

export const updateProfileService = async (userId, data) => {
  delete data.password;
  delete data.confirmPassword;
  delete data.role;
  delete data.active;

  const user = await User.findByIdAndUpdate(userId, data, { new: true });

  if (!user) {
    throw createNotFoundError("User not found");
  }

  user.password = undefined;
  return user;
}