import { Schema, Types, model } from 'mongoose';

import { ReaderModel, TReader } from './reader.types';

export const ownerSchema = new Schema<TReader>(
  {
    email: {
      type: String,
      required: true,
    },
    booksRead: [{ type: Types.ObjectId, ref: 'Book' }],
  },

  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Reader = model<TReader, ReaderModel>('Reader', ownerSchema);
