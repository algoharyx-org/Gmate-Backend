import expressAsyncHandler from "express-async-handler";
import { registerService } from "./auth.service.js";
import { createResponse } from "../../utils/APIResponse.js";

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
