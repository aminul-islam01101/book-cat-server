import crypto from 'crypto';

import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { CallbackWithoutResultAndOptionalError, Schema, UpdateQuery, model } from 'mongoose';

import { HandleApiError } from '../../../../utils/shared/errors/handleApiError';

import { TUser, TUserMethods, UserModel } from './auth.types';

export const userSchema = new Schema<TUser, Record<string, unknown>, TUserMethods>(
  {
    password: {
      type: String,
      select: 0,
    },
    role: {
      type: String,
      enum: ['owner', 'reader', 'admin'],
      required: true,
    },

    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },

    email: {
      type: String,
      required: true,
    },

    phoneNumber: {
      type: String,
    },
    signUpMethod: {
      type: String,
      required: true,
    },
    confirmationToken: { type: String },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'Owner',
      required: true,
    },
    reader: {
      type: Schema.Types.ObjectId,
      ref: 'Reader',
      required: true,
    },
  },

  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

userSchema.statics.isUserExist = async function (
  email: string
): Promise<Pick<
  TUser,
  '_id' | 'password' | 'role' | 'firstName' | 'lastName' | 'profileImage'
> | null> {
  const User = this as unknown as UserModel;

  const foundUser = await User.findOne(
    { email },
    { password: 1, role: 1, firstName: 1, lastName: 1, profileImage: 1 }
  ).lean();
  return foundUser;
};

userSchema.statics.isPasswordMatched = async function isPasswordMatched(
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  const isMatched = await bcrypt.compare(givenPassword, savedPassword);
  return isMatched;
};
userSchema.methods.generateConfirmationToken = function generateConfirmationToken(): string {
  const token = crypto.randomBytes(32).toString('hex');

  // this.confirmationToken = token;
  // this.confirmationTokenExpires = date;
  return token;
};
userSchema.pre('save', async function preSaveHook(next: CallbackWithoutResultAndOptionalError) {
  const user = this as TUser;
  const User = this.constructor as UserModel;
  const isExist = await User.findOne({
    email: this.email,
  });
  if (isExist) {
    throw new HandleApiError(httpStatus.CONFLICT, 'email is already exist!');
  }
  if (user.email && user.password) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});
// userSchema.pre(
//   'findOneAndUpdate',
//   async function preUpdateHook(next: CallbackWithoutResultAndOptionalError) {
//     const updatedUserData = this.getUpdate() as UpdateQuery<Pick<TUserProfile, 'password'>>;

//     if (updatedUserData && updatedUserData.password) {
//       updatedUserData.password = await bcrypt.hash(updatedUserData.password as string, 10);
//     }

//     next();
//   }
// );
export const User = model<TUser, UserModel>('User', userSchema);
