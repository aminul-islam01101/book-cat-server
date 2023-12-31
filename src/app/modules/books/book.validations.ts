import { z } from 'zod';

import { publicationMonths } from './book.constants';

//% create user validations zod schema
const createBookZodSchema = z.object({
  body: z.object({
    title: z
      .string({ required_error: 'Title is required' })
      .min(3, 'Password must be at least 3 characters long'),
    author: z
      .string({ required_error: 'Author is required' })
      .min(3, 'Author must be at least 3 characters long'),

    genre: z.string({ required_error: 'Genre is required' }),

    publicationYear: z.string({
      required_error: 'Publication Year is required ',
    }),
    email: z.string({
      required_error: 'email is required',
    }),
    publicationMonth: z.enum([...publicationMonths] as [string, ...string[]], {
      required_error: 'Month is needed',
    }),
  }),
});
const addReviewZodSchema = z.object({
  body: z.object({
    reviewer: z.string().optional(),
    description: z.string().min(4, { message: 'Description must be at least 4 characters long' }),
    profileImage: z.string().optional(),
    email: z.string({ required_error: 'Email is required' }),
  }),
});

export const BookValidations = {
  createBookZodSchema,
  addReviewZodSchema,
};
