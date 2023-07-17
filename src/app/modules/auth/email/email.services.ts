import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import { startSession } from 'mongoose';

import { configs } from '../../../../utils/configs/env.configs';
import { HandleApiError } from '../../../../utils/shared/errors/handleApiError';
import { jwtHelpers } from '../../../../utils/shared/helpers/jwtHelpers';
import { Owner } from '../../owners/owner.models';
import { TOwner } from '../../owners/owner.types';
import { Reader } from '../../readers/reader.models';
import { TReader } from '../../readers/reader.types';
import { User } from '../shared/auth.models';
import { TEmailLogin, TLoginUserResponse, TUser } from '../shared/auth.types';

//% create email user service
const createEmailUser = async (user: TUser): Promise<TUser | null> => {
  let session;
  try {
    session = await startSession();
    session.startTransaction();

    // Create Owner
    const owner: TOwner = { email: user.email };
    const createdOwner = await Owner.create([owner], { session });
    if (!createdOwner.length) {
      throw new HandleApiError(httpStatus.BAD_REQUEST, 'Failed to create Owner');
    }

    // Create Reader
    const reader: TReader = { email: user.email };
    const createdReader = await Reader.create([reader], { session });

    if (!createdReader.length) {
      throw new HandleApiError(httpStatus.BAD_REQUEST, 'Failed to create Reader');
    }

    // Create User
    const createdUser = await User.create(
      [{ ...user, owner: createdOwner[0]._id, reader: createdReader[0]._id }],
      { session }
    );
    if (!createdUser.length) {
      throw new HandleApiError(httpStatus.BAD_REQUEST, 'Failed to create User');
    }

    await session.commitTransaction();
    await session.endSession();

    return createdUser[0] as TUser;
  } catch (error) {
    if (session) {
      await session.abortTransaction();
      await session.endSession();
    }
    throw error;
  }
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
