import httpStatus from 'http-status';
import { startSession } from 'mongoose';

import { HandleApiError } from '../../../utils/shared/errors/handleApiError';
import { monthConverter } from '../../../utils/shared/helpers/monthConverTer';
import { searchFilterCalculator } from '../../../utils/shared/helpers/searchAndFilter';
import {
  calculatePagination,
  sortConditionSetter,
} from '../../../utils/shared/paginations/pagination.calculator';
import { TPaginationOptions } from '../../../utils/shared/types/paginationTypes';
import { TGenericResponse } from '../../../utils/shared/types/responseTypes';
import { Owner } from '../owners/owner.models';
import { Reader } from '../readers/reader.models';
import { TReader } from '../readers/reader.types';

import { bookSearchableFields, bookTagSearchableFields } from './book.constants';
import { Book } from './book.models';
import {
  TBook,
  TBookCheckBookFilter,
  TBookFilters,
  TFavorites,
  TGenreYear,
  TMonths,
  TReview,
} from './book.types';

//% create email user service
const createBook = async (book: TBook): Promise<TBook | null> => {
  const owner = await Owner.findOne({ email: book.email });
  if (!owner) {
    throw new HandleApiError(httpStatus.BAD_REQUEST, 'Owner not found');
  }

  const session = await startSession();
  try {
    session.startTransaction();
    const ownerDetails = { id: owner._id, email: owner.email };

    // Create User
    const createdBook = await Book.create([{ ...book, owner: ownerDetails }], { session });
    if (!createdBook.length) {
      throw new HandleApiError(httpStatus.BAD_REQUEST, 'Failed to create Book');
    }
    if (owner.books === null || owner.books === undefined) {
      owner.books = [createdBook[0]._id];
    } else {
      owner.books.push(createdBook[0]._id);
    }
    const updatedOwner = await owner.save({ session });
    if (!updatedOwner) {
      throw new HandleApiError(httpStatus.BAD_REQUEST, 'Failed to create Book');
    }
    await session.commitTransaction();
    await session.endSession();

    return createdBook[0] as TBook;
  } catch (error) {
    if (session) {
      await session.abortTransaction();
      await session.endSession();
    }
    throw error;
  }
};
const getAllBooks = async (
  filters: TBookFilters,
  paginationOptions: Partial<TPaginationOptions>,
  checkboxFilter: TBookCheckBookFilter
): Promise<TGenericResponse<TBook[]>> => {
  const { searchTerm, tags, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(paginationOptions);

  const whereConditions = searchFilterCalculator(
    searchTerm,
    bookSearchableFields,
    filtersData,
    checkboxFilter,
    tags,
    bookTagSearchableFields
  );
  const sortConditions = sortConditionSetter(sortBy, sortOrder);

  const result = await Book.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit)
    .select('-reviews');

  const total = await Book.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};
// Tue Jul 18 2023 12:13:03 GMT+0600 (Bangladesh Standard Time)
const getSingleBook = async (id: string): Promise<TBook | null> => {
  const SingleBook = await Book.findById(id);

  const publicationTime = monthConverter(
    `${SingleBook?.publicationMonth as TMonths} ${SingleBook?.publicationYear as string}`
  );
  let singleBookObj = SingleBook;
  if (SingleBook) {
    singleBookObj = SingleBook.toObject();

    singleBookObj.publicationTime = publicationTime;
  }

  return singleBookObj;
};
const getYearGenre = async (): Promise<TGenreYear | null | undefined> => {
  try {
    const result = await Book.aggregate([
      {
        $group: {
          _id: null,
          genres: { $addToSet: '$genre' },
          years: { $addToSet: { label: '$publicationYear', value: '$publicationYear' } },
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ]).exec();

    const [aggregatedData] = result as TGenreYear[];
    return aggregatedData;
  } catch (err) {
    console.error(err);
  }
};
const addReview = async (id: string, review: TReview): Promise<TBook | null> => {
  const isBookExist = await Book.findById(id);
  if (!isBookExist) {
    throw new HandleApiError(httpStatus.BAD_REQUEST, 'Book not found');
  }

  const isReviewExist = isBookExist.reviews.find(
    (eachReview) =>
      eachReview.email === review.email && eachReview.description === review.description
  );
  if (isReviewExist) {
    throw new HandleApiError(httpStatus.BAD_REQUEST, 'Review already exist');
  }
  const updateBookReview = await Book.findByIdAndUpdate(
    id,
    { $push: { reviews: review } },
    { new: true }
  );
  return updateBookReview;
};
const updateBook = async (id: string, payload: Partial<TBook>): Promise<TBook | null> => {
  const isExist = await Book.findOne({ _id: id });
  if (!isExist) {
    throw new HandleApiError(httpStatus.NOT_FOUND, 'Book not found !');
  }

  const result = await Book.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};
const deleteBook = async (id: string): Promise<TBook | null> => {
  const isExist = await Book.findOne({ _id: id });
  if (!isExist) {
    throw new HandleApiError(httpStatus.NOT_FOUND, 'Book not found !');
  }

  const result = await Book.findOneAndDelete(
    { _id: id },
    {
      new: true,
    }
  );
  return result;
};
const manipulateFavorite = async (email: string, payload: TFavorites): Promise<TReader | null> => {
  const { bookId, type } = payload;
  const isExist = await Book.findOne({ _id: bookId }).lean();

  if (!isExist) {
    throw new HandleApiError(httpStatus.NOT_FOUND, 'Book not found !');
  }
  const isReaderExist = await Reader.findOne({ email });
  if (!isReaderExist) {
    throw new HandleApiError(httpStatus.NOT_FOUND, 'Reader not found !');
  }

  if (type === 'bookmark') {
    const isBookmarked = isReaderExist?.bookmark?.includes(bookId) ?? false;

    const updateQuery = isBookmarked
      ? { $pull: { bookmark: bookId } }
      : { $push: { bookmark: bookId }, $pull: { booksRead: bookId, booksReading: bookId } };

    const updateBookMark = await Reader.findOneAndUpdate({ email }, updateQuery, { new: true });
    return updateBookMark;
  }

  if (type === 'reading') {
    const isBookmarked = isReaderExist?.booksReading?.includes(bookId) ?? false;

    const updateQuery = isBookmarked
      ? { $pull: { booksReading: bookId } }
      : { $push: { booksReading: bookId }, $pull: { booksRead: bookId, bookmark: bookId } };

    const updateBookMark = await Reader.findOneAndUpdate({ email }, updateQuery, { new: true });
    return updateBookMark;
  }
  if (type === 'read') {
    const isBookmarked = isReaderExist?.booksRead?.includes(bookId) ?? false;

    const updateQuery = isBookmarked
      ? { $pull: { booksRead: bookId } }
      : { $push: { booksRead: bookId }, $pull: { booksReading: bookId, bookmark: bookId } };

    const updateBookMark = await Reader.findOneAndUpdate({ email }, updateQuery, { new: true });
    return updateBookMark;
  }

  return isReaderExist;
};
const getReader = async (email: string): Promise<TReader | null> => {
  const isExist = await Reader.findOne({ email });
  if (!isExist) {
    throw new HandleApiError(httpStatus.NOT_FOUND, 'Book not found !');
  }

  return isExist;
};
export const BookServices = {
  createBook,
  getAllBooks,
  getSingleBook,
  getYearGenre,
  addReview,
  updateBook,
  deleteBook,
  manipulateFavorite,
  getReader,
};
