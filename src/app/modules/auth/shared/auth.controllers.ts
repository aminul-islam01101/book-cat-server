import { Request, Response } from 'express';

import catchAsync from '../../../../utils/shared/helpers/catchAsync';
import { cookieOptions } from '../../../../utils/shared/helpers/cookieOptions';
import sendResponse from '../../../../utils/shared/helpers/sendResponse';

import { AuthServices } from './auth.services';
import { TLoginUserResponse, TRefreshToken, TTokens } from './auth.types';

//% login user controller

const loggedInUser = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken, accessToken } = req.cookies as TTokens;
  const token = req.headers.authorization || accessToken;
  const result = await AuthServices.loggedInUser(req.user as TLoginUserResponse, token);

  // set refresh token into cookie

  sendResponse<TLoginUserResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'User logged in successfully !',
    data: result,
  });
});

const refreshAccessToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies as TRefreshToken;
  const result = await AuthServices.refreshAccessToken(refreshToken);
  const { accessToken, ...rest } = result;

  // set refresh token into cookie

  res.cookie('accessToken', accessToken, cookieOptions);

  sendResponse<TLoginUserResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'User logged in successfully !',
    data: result,
  });
});
// eslint-disable-next-line @typescript-eslint/require-await
const logOut = catchAsync(async (req: Request, res: Response) => {
  res.clearCookie('refreshToken', cookieOptions);
  res.clearCookie('accessToken', cookieOptions);

  // set refresh token into cookie

  sendResponse<object>(res, {
    statusCode: 200,
    success: true,
    message: 'User logged out successfully !',
    data: {},
  });
});

export const AuthControllers = { loggedInUser, logOut, refreshAccessToken };
