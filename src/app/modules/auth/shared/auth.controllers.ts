import { Request, Response } from 'express';

import catchAsync from '../../../../utils/shared/helpers/catchAsync';
import sendResponse from '../../../../utils/shared/helpers/sendResponse';

import { AuthServices } from './auth.services';
import { TLoginUserResponse } from './auth.types';

//% login user controller

const loggedInUser = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization;
  console.log('🌼 🔥🔥 file: auth.controllers.ts:15 🔥🔥 loggedInUser 🔥🔥 req.user🌼', req.user);
  const result = await AuthServices.loggedInUser(req.user as TLoginUserResponse, token as string);

  // set refresh token into cookie

  sendResponse<TLoginUserResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'User logged in successfully !',
    data: result,
  });
});
// eslint-disable-next-line @typescript-eslint/require-await
const logOut = catchAsync(async (req: Request, res: Response) => {
  res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'none', secure: true });
  res.clearCookie('accessToken', { httpOnly: true, sameSite: 'none', secure: true });

  // set refresh token into cookie

  sendResponse<object>(res, {
    statusCode: 200,
    success: true,
    message: 'User logged out successfully !',
    data: {},
  });
});
export const AuthControllers = { loggedInUser, logOut };
