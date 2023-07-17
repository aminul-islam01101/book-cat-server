import { Model, Types } from 'mongoose';

export type TMonths =
  | 'January'
  | 'February'
  | 'March'
  | 'April'
  | 'May'
  | 'June'
  | 'July'
  | 'August'
  | 'September'
  | 'October'
  | 'November'
  | 'December';
export type TReview = {
  reviewer: string;
  description: string;
  profileImage: string;
  timeStamp: Date;
};

export type TBook = {
  title: string;
  author: string;
  genre: string;
  publicationMonth:
    | 'January'
    | 'February'
    | 'March'
    | 'April'
    | 'May'
    | 'June'
    | 'July'
    | 'August'
    | 'September'
    | 'October'
    | 'November'
    | 'December';
  publicationYear: string;
  reviews: TReview[];
  owner: Types.ObjectId;
  email: string;
};
export type TBookFilters = {
  searchTerm?: string;
  genre?: string;
  publicationYear?: string;
};
export type TGenreYear = {
  genres: string[];
  years: { label: string; value: string }[];
};
export type ReviewModel = Model<TReview, Record<string, unknown>>;
export type BookModel = Model<TBook, Record<string, unknown>>;
