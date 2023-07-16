import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';

import { configs } from '../../../../utils/configs/env.configs';
import { HandleApiError } from '../../../../utils/shared/errors/handleApiError';
import { jwtHelpers } from '../../../../utils/shared/helpers/jwtHelpers';
import { User } from '../shared/auth.models';
import { TEmailLogin, TLoginUserResponse, TUser } from '../shared/auth.types';

//% create email user service
const createEmailUser = async (user: TUser): Promise<TUser | null> => {
  const createdUser = (await User.create(user)).toObject();
  if (!createdUser) {
    throw new HandleApiError(400, 'Failed to create user');
  }
  return createdUser;
};

//% login email user service
const loginEmailUser = async (payload: TEmailLogin): Promise<TLoginUserResponse> => {
  const { email, password } = payload;

  const isUserExist = await User.isUserExist(email);
  console.log(
    '🌼 🔥🔥 file: email.services.ts:24 🔥🔥 loginEmailUser 🔥🔥 isUserExist🌼',
    isUserExist
  );

  if (!isUserExist) {
    throw new HandleApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  if (
    isUserExist.password &&
    !(await User.isPasswordMatched(password as string, isUserExist.password))
  ) {
    throw new HandleApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }

  // create access token & refresh token

  const { _id: id, role, firstName, lastName, profileImage } = isUserExist;
  const accessToken = jwtHelpers.createToken(
    { id, role, email },
    configs.jwtSecretAccess as Secret,
    configs.jwtSecretAccessExpired as string
  );

  const refreshToken = jwtHelpers.createToken(
    { id, role, email },
    configs.jwtSecretRefresh as Secret,
    configs.jwtSecretRefreshExpired as string
  );

  return {
    accessToken,
    refreshToken,
    firstName,
    lastName,
    profileImage,
    email,
    role,
  };
};

export const EmailServices = {
  createEmailUser,
  loginEmailUser,
};
