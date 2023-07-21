import { Model, Types } from 'mongoose';

export type TReader = {
  email: string;
  booksRead?: [string];
  bookmark?: [string];
  booksReading?: [string];
};

export type ReaderModel = Model<TReader, Record<string, unknown>>;
