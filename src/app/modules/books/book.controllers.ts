import { Request, Response } from 'express';
import httpStatus from 'http-status';

import catchAsync from '../../../utils/shared/helpers/catchAsync';
import pick from '../../../utils/shared/helpers/pick';
import sendResponse from '../../../utils/shared/helpers/sendResponse';
import { paginationFields } from '../../../utils/shared/paginations/pagination.constants';

import { bookFilterableFields } from './book.constants';
import { BookServices } from './book.services';
import { TBook, TGenreYear } from './book.types';

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
  const paginationOptions = pick(req.query, paginationFields);

  const result = await BookServices.getAllBooks(filters, paginationOptions);

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
export const BookControllers = { createBook, getAllBooks, getSingleBook, getYearGenre };
