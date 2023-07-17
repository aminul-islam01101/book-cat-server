import httpStatus from 'http-status';
import { CallbackWithoutResultAndOptionalError, Schema, model } from 'mongoose';

import { HandleApiError } from '../../../utils/shared/errors/handleApiError';

import { BookModel, TBook, TReview } from './book.types';
import { publicationMonths } from './book.constants';

const TReviewSchema = new Schema<TReview>({
  reviewer: { type: String, required: true },
  description: { type: String, required: true },
  profileImage: { type: String, required: true },
  timeStamp: { type: Date, required: true },
});

export const bookSchema = new Schema<TBook, BookModel>(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, required: true },
    publicationMonth: {
      type: String,
      required: true,
      enum: publicationMonths,
    },
    publicationYear: {
      type: String,
      required: true,
    },
    reviews: [TReviewSchema],
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'Owner',
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

bookSchema.pre('save', async function preSaveHook(next: CallbackWithoutResultAndOptionalError) {
  const Book = this.constructor as BookModel;
  const isExist = await Book.findOne({
    title: this.title,
    publicationMonth: this.publicationMonth,
    publicationYear: this.publicationYear,
  });
  if (isExist) {
    throw new HandleApiError(httpStatus.CONFLICT, 'Book is already exist!');
  }
  next();
});

export const Book = model<TBook>('Book', bookSchema);
