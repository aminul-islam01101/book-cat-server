import { Request, Response } from 'express';
import httpStatus from 'http-status';

import catchAsync from '../../../utils/shared/helpers/catchAsync';
import pick from '../../../utils/shared/helpers/pick';
import sendResponse from '../../../utils/shared/helpers/sendResponse';
import { paginationFields } from '../../../utils/shared/paginations/pagination.constants';
import { TReader } from '../readers/reader.types';

import { bookCheckboxFields, bookFilterableFields } from './book.constants';
import { BookServices } from './book.services';
import { TBook, TFavorites, TGenreYear, TReview } from './book.types';

const createBook = catchAsync(async (req: Request, res: Response) => {
  const bookData = req.body as TBook;

  const result = await BookServices.createBook(bookData);

  sendResponse<object>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Books created successfully!',
    data: {},
  });
});

//% get  all Books
const getAllBooks = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, bookFilterableFields);
  const checkBoxFilter = pick(req.query, bookCheckboxFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await BookServices.getAllBooks(filters, paginationOptions, checkBoxFilter);

  sendResponse<TBook[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `${!result.data.length ? 'No Book found' : 'Book retrieved successfully !'}`,
    meta: result.meta,
    data: result.data,
  });
});
const getSingleBook = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BookServices.getSingleBook(id);

  sendResponse<TBook>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `${!result ? 'No Book found' : 'Book retrieved successfully !'}`,
    data: result,
  });
});
const getYearGenre = catchAsync(async (req: Request, res: Response) => {
  const result = await BookServices.getYearGenre();

  sendResponse<TGenreYear>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `${!result ? 'No Book found' : 'Book retrieved successfully !'}`,
    data: result,
  });
});
const addReview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body as TReview;
  const result = await BookServices.addReview(id, data);

  sendResponse<TBook>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `${!result ? 'Review add failed' : 'Review added successfully !'}`,
    data: result,
  });
});
const updateBook = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedData = req.body as Partial<TBook>;
  const result = await BookServices.updateBook(id, updatedData);
  sendResponse<TBook>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book updated successfully !',
    data: result,
  });
});
const deleteBook = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await BookServices.deleteBook(id);
  sendResponse<TBook>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book Deleted successfully !',
    data: result,
  });
});
const manipulateFavorite = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.params;
  const data = req.body as TFavorites;

  const result = await BookServices.manipulateFavorite(email, data);
  sendResponse<TReader>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book Deleted successfully !',
    data: result,
  });
});
const getReader = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.params;

  const result = await BookServices.getReader(email);
  sendResponse<TReader>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Reader Retrieved successfully !',
    data: result,
  });
});
export const BookControllers = {
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
