import User from "../../DB/models/user.model.js";
import {
  createBadRequestError,
  createConflictError,
  createNotFoundError,
  createUnauthorizedError,
} from "../../utils/APIErrors.js";
import sendMail from "../../utils/sendEmail.js";
import {
  generateAccessToken,
  generateRefreshToken,
  generateResetToken,
  verifyToken,
} from "../../utils/tokens.js";
import crypto from "crypto";
import { deleteFromCloudinary, uploadToCloudinary } from "../../utils/uploadFiles.js";

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
  const user = await User.findOne({ email: userData.email }).select(
    "+password",
  );
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
};

export const verifyRefreshToken = async (refreshToken) => {
  if (!refreshToken) {
    throw createUnauthorizedError("Refresh token required");
  }

  const decoded = verifyToken(refreshToken);
  const accessToken = generateAccessToken({
    _id: decoded._id,
    role: decoded.role,
  });

  return accessToken;
};

export const getCurrentUserService = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw createNotFoundError("User not found");
  }
  return user;
};

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
};

export const uploadAvatarService = async (userId, file) => {
  const user = await User.findById(userId).select("-password")

  if (!user) {
    throw createNotFoundError("user not found")
  }

  if (user.avatar && user.avatar.publicId) {
    await deleteFromCloudinary(user.avatar.publicId)
  }

  const result = await uploadToCloudinary(file, "GMATE/avatars")

  user.avatar = {
    url: result.url,
    publicId: result.publicId

  }

  await user.save()

  return user
}

export const changeUserPasswordService = async (userId, data) => {
  const user = await User.findById(userId).select("+password");
  if (!user) {
    throw createNotFoundError("User not found");
  }

  const isMatch = await user.comparePassword(data.oldPassword);
  if (!isMatch) {
    throw createUnauthorizedError("Invalid old password");
  }

  user.password = data.newPassword;
  await user.save();

  user.password = undefined;
  return user;
};

export const forgotPasswordService = async (email) => {
  const user = await User.findOne({ email }).select(
    "+resetCode +resetCodeExpireTime +resetCodeVerify",
  );
  if (!user) {
    throw createNotFoundError("User not found");
  }

  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  user.resetCode = crypto.createHash("sha256").update(resetCode).digest("hex");
  user.resetCodeExpireTime = Date.now() + 10 * 60 * 1000;
  user.resetCodeVerify = false;
  const message = `your reset password code is ${resetCode}`;
  try {
    await sendMail({ email: user.email, subject: "Reset Password", message });
    await user.save({ validateModifiedOnly: true });
  } catch (err) {
    console.log(err);
    throw createBadRequestError("Failed to send reset password email");
  }

  const resetToken = generateResetToken({ _id: user._id });

  return resetToken;
};

export const verifyResetPasswordCodeService = async (resetToken, resetCode) => {
  if (!resetToken) {
    throw createUnauthorizedError("Reset token required");
  }

  const decoded = verifyToken(resetToken);

  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  const user = await User.findById({
    _id: decoded._id,
    resetCode: hashedResetCode,
    resetCodeExpireTime: { $gt: Date.now() },
  }).select("+resetCode +resetCodeExpireTime +resetCodeVerify");
  if (!user) {
    throw createUnauthorizedError("Invalid or expired reset code");
  }

  user.resetCodeVerify = true;
  await user.save({ validateModifiedOnly: true });

  return true;
};

export const resetPasswordService = async (resetToken, password) => {
  if (!resetToken) {
    throw createUnauthorizedError("Reset token required");
  }
  const decoded = verifyToken(resetToken);
  const user = await User.findOne({
    _id: decoded._id,
    resetCodeVerify: true,
  }).select("+password");
  if (!user) {
    throw createUnauthorizedError(
      "Invalid or expired reset token or reset code not verified",
    );
  }

  user.password = password;
  user.resetCode = undefined;
  user.resetCodeExpireTime = undefined;
  user.resetCodeVerify = undefined;
  await user.save({ validateModifiedOnly: true });

  return true;
};
