import expressAsyncHandler from "express-async-handler";
import { changeUserPasswordService, getCurrentUserService, loginService, registerService, updateProfileService, verifyRefreshToken } from "./auth.service.js";
import { createResponse, successResponse } from "../../utils/APIResponse.js";

// @desc     Register
// @route    POST /auth/register
// @access   public
export const register = expressAsyncHandler(async (req, res) => {
  const {user, accessToken, refreshToken} = await registerService(req.body);

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 1000,
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json(createResponse({user, token: {accessToken, refreshToken}}, "Register successfully"));
});

// @desc     Login
// @route    POST /auth/login
// @access   public
export const login = expressAsyncHandler(async (req, res) => {
  const {user, accessToken, refreshToken} = await loginService(req.body);

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 1000,
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json(successResponse({user, token: {accessToken, refreshToken}}, "Login successfully"));
});

// @desc     Create access token
// @route    POST /auth/refresh
// @access   Private
export const createAccessToken = expressAsyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken || req.headers.authorization?.replace('Bearer ', '');
  const accessToken = await verifyRefreshToken(refreshToken);

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 1000,
  });
  res.status(200).json(successResponse(accessToken, "Access token created successfully"));
});

// @desc     Logout
// @route    POST /auth/logout
// @access   Private
export const logout = expressAsyncHandler(async (req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.status(200).json(successResponse({}, "Logout successfully"));
});

// @desc     Get current user
// @route    POST /auth/me
// @access   Private
export const getCurrentUser = expressAsyncHandler(async (req, res) => {
  const user = await getCurrentUserService(req.userId);
  res.status(200).json(successResponse(user, "User retrieved successfully"));
});

// @desc     Update current user
// @route    POST /auth/updateProfile
// @access   Private
export const updateProfile = expressAsyncHandler(async (req, res) => {
  const user = await updateProfileService(req.userId, req.body);
  res.status(200).json(successResponse(user, "User updated successfully"));
});

// @desc     Change current user password
// @route    POST /auth/changePassword
// @access   Private
export const changeUserPassword = expressAsyncHandler(async (req, res) => {
  const user = await changeUserPasswordService(req.userId, req.body);
  res.status(200).json(successResponse(user, "Password changed successfully"));
})
