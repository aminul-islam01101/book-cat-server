import { Model, Schema } from 'mongoose';

export type TLoginEmail = {
  email: string;
};
export type TLoginUser = TLoginEmail & {
  password: string;
};

export type TAccessToken = {
  accessToken: string;
};
export type TRefreshToken = {
  refreshToken: string;
};
export type TTokens = TAccessToken & {
  refreshToken: string;
};
export type TLoginUserResponse = TAccessToken & {
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  refreshToken?: string;
};
export type TRefreshTokenResponse = TAccessToken;

export type TVerifiedLoginUser = {
  id: Schema.Types.ObjectId;
  role: 'seller' | 'buyer' | 'admin';
};

export type TResetMailData = {
  to: string[];
  subject: string;
  text: string;
  html: string;
};
export type TForgetPassResponse = {
  token: string;
};

export type TEmailLogin = {
  email: string;
  password?: string;
};

export type TUser = TEmailLogin & {
  _id: Schema.Types.ObjectId;
  firstName?: string;
  lastName?: string;
  phoneNumber: string;
  role: string;
  confirmPassword?: string;
  confirmationToken?: string;
  signUpMethod: string;
  profileImage?: string;
  owner: Schema.Types.ObjectId;
  reader: Schema.Types.ObjectId;
};

export type TUserMethods = { generateConfirmationToken(): string };
export type UserModel = Model<TUser, Record<string, unknown>, TUserMethods> & {
  isUserExist(
    email: string
  ): Promise<Pick<TUser, '_id' | 'password' | 'role' | 'firstName' | 'lastName' | 'profileImage'>>;
  isPasswordMatched(givenPassword: string, savedPassword: string): Promise<boolean>;
} & Model<TUser>;
