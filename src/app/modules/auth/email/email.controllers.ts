import { Request, Response } from 'express';
import httpStatus from 'http-status';

import catchAsync from '../../../../utils/shared/helpers/catchAsync';
import { cookieOptions } from '../../../../utils/shared/helpers/cookieOptions';
import sendResponse from '../../../../utils/shared/helpers/sendResponse';
import { TEmailLogin, TLoginUserResponse, TRefreshToken, TUser } from '../shared/auth.types';

import { EmailServices } from './email.services';

//% create user controller
const createUser = catchAsync(async (req: Request, res: Response) => {
  const userData = req.body as TUser;
  userData.signUpMethod = 'not-verified';
  userData.role = 'owner';
  const result = await EmailServices.createEmailUser(userData);
  const { password, ...rest } = result as TUser;

  sendResponse<object>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'user created successfully!',
    data: {},
  });
});

//% login user controller

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body as TEmailLogin;
  const result = await EmailServices.loginEmailUser(loginData);
  const { refreshToken, ...rest } = result;

  // set refresh token into cookie

  res.cookie('refreshToken', refreshToken, cookieOptions);
  res.cookie('accessToken', rest.accessToken, cookieOptions);

  sendResponse<TLoginUserResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'User logged in successfully !',
    data: rest,
  });
});

export const EmailControllers = { createUser, loginUser };
