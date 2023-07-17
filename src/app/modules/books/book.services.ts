import httpStatus from 'http-status';
import { startSession } from 'mongoose';

import { HandleApiError } from '../../../utils/shared/errors/handleApiError';
import { searchFilterCalculator } from '../../../utils/shared/helpers/searchAndFilter';
import {
  calculatePagination,
  sortConditionSetter,
} from '../../../utils/shared/paginations/pagination.calculator';
import { TPaginationOptions } from '../../../utils/shared/types/paginationTypes';
import { TGenericResponse } from '../../../utils/shared/types/responseTypes';
import { Owner } from '../owners/owner.models';

import { bookSearchableFields } from './book.constants';
import { Book } from './book.models';
import { TBook, TBookFilters, TGenreYear, TReview } from './book.types';

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
  paginationOptions: Partial<TPaginationOptions>
): Promise<TGenericResponse<TBook[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(paginationOptions);

  const whereConditions = searchFilterCalculator(searchTerm, bookSearchableFields, filtersData);
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
const getSingleBook = async (id: string): Promise<TBook | null> => {
  const SingleBook = await Book.findById(id);
  return SingleBook;
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
export const BookServices = { createBook, getAllBooks, getSingleBook, getYearGenre, addReview };
