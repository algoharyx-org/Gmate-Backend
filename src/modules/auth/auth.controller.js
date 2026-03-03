import expressAsyncHandler from "express-async-handler";
import { loginService, registerService, verifyRefreshToken } from "./auth.service.js";
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
  const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;
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
