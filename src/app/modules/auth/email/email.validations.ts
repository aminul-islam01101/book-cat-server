import { z } from 'zod';

//% create user validations zod schema
const createEmailUserZodSchema = z
  .object({
    body: z.object({
      password: z
        .string({ required_error: 'password is required' })
        .min(6, 'Password must be at least 6 characters long'),
      confirmPassword: z
        .string({ required_error: 'password is required' })
        .min(6, 'Password must be at least 6 characters long'),

      firstName: z.string({
        required_error: 'First name is required',
      }),
      lastName: z.string({
        required_error: 'Last name is required',
      }),

      email: z.string({
        required_error: 'email is required',
      }),
      phoneNumber: z.string({
        required_error: 'phoneNumber is required',
      }),
    }),
  })
  .refine((data) => data.body.password === data.body.confirmPassword, {
    message: 'Passwords do not match',
    path: ['body', 'confirmPassword'],
  });

//% login user validations zod schema
const emailLoginZodSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'email is required',
    }),
    password: z.string({
      required_error: 'Password is required',
    }),
  }),
});
export const EmailSignUpValidations = {
  createEmailUserZodSchema,
  emailLoginZodSchema,
};
