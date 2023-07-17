import { Model, Types } from 'mongoose';

export type TReader = {
  email: string;
  booksRead?: [Types.ObjectId];
};

export type ReaderModel = Model<TReader, Record<string, unknown>>;
