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
  reviewer?: string;
  description: string;
  profileImage?: string;
  email: string;
};

export type TBook = {
  title: string;
  author: string;
  genre: string;
  publicationMonth: TMonths;
  publicationYear: string;
  reviews: TReview[];
  owner: {
    id: Types.ObjectId;
    email: string;
  };
  publicationTime?: string;

  email: string;
};
export type TBookFilters = {
  searchTerm?: string;
  genre?: string;
  publicationYear?: string;
  tags?: string[];
};
export type TBookCheckBookFilter = {
  publicationMonth?: string;
};

export type TGenreYear = {
  genres: string[];
  years: { label: string; value: string }[];
};
export type TFavorites = {
  bookId: string;
  type: string;
};

export type ReviewModel = Model<TReview, Record<string, unknown>>;
export type BookModel = Model<TBook, Record<string, unknown>>;
