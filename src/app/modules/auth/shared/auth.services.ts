import httpStatus from 'http-status';

import { HandleApiError } from '../../../../utils/shared/errors/handleApiError';

import { User } from './auth.models';
import { TLoginUserResponse } from './auth.types';

const loggedInUser = async (
  payload: TLoginUserResponse,
  token: string
): Promise<TLoginUserResponse> => {
  const { email } = payload;
  console.log('🌼 🔥🔥 file: auth.services.ts:10 🔥🔥 loggedInUser 🔥🔥 email🌼', email);

  const isUserExist = await User.isUserExist(email);
  console.log(
    '🌼 🔥🔥 file: email.services.ts:24 🔥🔥 loginEmailUser 🔥🔥 isUserExist🌼',
    isUserExist
  );

  if (!isUserExist) {
    throw new HandleApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }
  const {
    firstName,
    lastName,
    profileImage,

    role,
  } = isUserExist;
  // create access token & refresh token

  return {
    email,
    firstName,
    lastName,
    profileImage,
    accessToken: token,
    role,
  };
};

export const AuthServices = {
  loggedInUser,
};
