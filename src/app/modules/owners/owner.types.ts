import { Model, Types } from 'mongoose';

export type TOwner = {
  email: string;
  books?: [Types.ObjectId];
};

export type OwnerModel = Model<TOwner, Record<string, unknown>>;
