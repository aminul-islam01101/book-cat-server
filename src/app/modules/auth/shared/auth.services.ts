import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';

import { configs } from '../../../../utils/configs/env.configs';
import { HandleApiError } from '../../../../utils/shared/errors/handleApiError';
import { jwtHelpers } from '../../../../utils/shared/helpers/jwtHelpers';

import { User } from './auth.models';
import { TLoginUserResponse, TRefreshTokenResponse } from './auth.types';

const loggedInUser = async (
  payload: TLoginUserResponse,
  token: string
): Promise<TLoginUserResponse> => {
  const { email } = payload;

  const isUserExist = await User.isUserExist(email);

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

const refreshAccessToken = async (token: string): Promise<TLoginUserResponse> => {
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(token, configs.jwtSecretRefresh as Secret);
  } catch (err) {
    throw new HandleApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
  }

  const { id } = verifiedToken;

  const isUserExist = await User.findById(id);
  if (!isUserExist) {
    throw new HandleApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }
  // generate new token

  const { role, email, firstName, lastName, profileImage } = isUserExist;

  const newAccessToken = jwtHelpers.createToken(
    {
      id: isUserExist._id,
      role,
      email,
    },
    configs.jwtSecretAccess as Secret,
    configs.jwtSecretAccessExpired as string
  );

  return {
    accessToken: newAccessToken,
    firstName,
    lastName,
    profileImage,
    role,
    email,
  };
};

export const AuthServices = {
  loggedInUser,
  refreshAccessToken,
};
