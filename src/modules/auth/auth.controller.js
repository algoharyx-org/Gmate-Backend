import expressAsyncHandler from "express-async-handler";
import {
  changeUserPasswordService,
  forgotPasswordService,
  getCurrentUserService,
  loginService,
  registerService,
  resetPasswordService,
  updateProfileService,
  uploadAvatarService,
  verifyRefreshToken,
  verifyResetPasswordCodeService,
} from "./auth.service.js";
import { createResponse, successResponse } from "../../utils/APIResponse.js";
import { config } from "../../config/env.js";

// @desc     Register
// @route    POST /auth/register
// @access   public
export const register = expressAsyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await registerService(req.body);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: config.nodeEnv === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: config.nodeEnv === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res
    .status(201)
    .json(
      createResponse(
        { user, token: { accessToken, refreshToken } },
        "Register successfully",
      ),
    );
});

// @desc     Login
// @route    POST /auth/login
// @access   public
export const login = expressAsyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await loginService(req.body);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: config.nodeEnv === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: config.nodeEnv === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res
    .status(200)
    .json(
      successResponse(
        { user, token: { accessToken, refreshToken } },
        "Login successfully",
      ),
    );
});

// @desc     Create access token
// @route    POST /auth/refresh
// @access   Private
export const createAccessToken = expressAsyncHandler(async (req, res) => {
  const refreshToken =
    req.cookies?.refreshToken ||
    req.body.refreshToken;
  const accessToken = await verifyRefreshToken(refreshToken);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: config.nodeEnv === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 1000,
  });
  res
    .status(200)
    .json(successResponse(accessToken, "Access token created successfully"));
});

// @desc     Logout
// @route    POST /auth/logout
// @access   Private
export const logout = expressAsyncHandler(async (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.status(200).json(successResponse({}, "Logout successfully"));
});

// @desc     Get current user
// @route    GET /auth/me
// @access   Private
export const getCurrentUser = expressAsyncHandler(async (req, res) => {
  const user = await getCurrentUserService(req.userId);
  res.status(200).json(successResponse(user, "User retrieved successfully"));
});

// @desc     Update current user
// @route    PUT /auth/updateProfile
// @access   Private
export const updateProfile = expressAsyncHandler(async (req, res) => {
  const user = await updateProfileService(req.userId, req.body);
  res.status(200).json(successResponse(user, "User updated successfully"));
});

// @desc     Upload avatar
// @route    PUT /auth/uploadAvatar
// @access   Private
export const uploadAvatar = expressAsyncHandler(async (req, res) => {
  const user = await uploadAvatarService(req.userId, req.file);
  res.status(200).json(successResponse(user, "Avatar uploaded successfully"));
});

// @desc     Change current user password
// @route    PUT /auth/changePassword
// @access   Private
export const changeUserPassword = expressAsyncHandler(async (req, res) => {
  const user = await changeUserPasswordService(req.userId, req.body);
  res.status(200).json(successResponse(user, "Password changed successfully"));
});

// @desc     Forgot password
// @route    POST /auth/forgotPassword
// @access   Public
export const forgotPassword = expressAsyncHandler(async (req, res) => {
  const resetToken = await forgotPasswordService(req.body.email);
  res.cookie("resetToken", resetToken, {
    httpOnly: true,
    secure: config.nodeEnv === "production",
    sameSite: "strict",
    maxAge: 10 * 60 * 1000,
  });
  res
    .status(200)
    .json(
      successResponse(resetToken, "Reset password code sent to your email"),
    );
});

// @desc     Verify reset password code
// @route    POST /auth/verifyResetPasswordCode
// @access   Private
export const verifyResetPasswordCode = expressAsyncHandler(async (req, res) => {
  const resetToken =
    req.cookies?.resetToken ||
    req.headers.authorization?.replace("Bearer ", "");
  const resetCode = req.body.resetCode;
  await verifyResetPasswordCodeService(resetToken, resetCode);
  res
    .status(200)
    .json(successResponse({}, "Reset password code verified successfully"));
});

// @desc     Reset password
// @route    PUT /auth/resetPassword
// @access   Private
export const resetPassword = expressAsyncHandler(async (req, res) => {
  const resetToken =
    req.cookies?.resetToken ||
    req.headers.authorization?.replace("Bearer ", "");
  const password = req.body.password;
  await resetPasswordService(resetToken, password);
  res.status(200).json(successResponse({}, "Password reset successfully"));
});
