/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ErrorRequestHandler } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';
import { ZodError } from 'zod';

import { configs } from '../configs/env.configs';
import { HandleApiError } from '../shared/errors/handleApiError';
import handleCastError from '../shared/errors/handleCastError';
import handleMissingSchemaError from '../shared/errors/handleMissingSchemaError';
import handleValidationError from '../shared/errors/handleValidationError';
import handleZodError from '../shared/errors/handleZodError';
import { errorLogger } from '../shared/logger';
import { TGenericErrorMessage } from '../shared/types/errorTypes';
import handleJwtTokenError from '../shared/errors/handleJwtTokenError';

const globalErrorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (configs.env === 'development') {
    console.log('🌼 ----------------------------------------------------------🌼');
    console.log('🌼 🔥🔥 file: globalErrorHandler.ts:18 🔥🔥 error🌼', error);
    console.log('🌼 ----------------------------------------------------------🌼');
    errorLogger.error(error);
  } else {
    errorLogger.error(error);
  }

  let statusCode = 500;
  let errorName = 'Something went wrong !';
  let errorMessages: TGenericErrorMessage[] = [];

  // mongoose validation error handler
  if (error?.name === 'ValidationError') {
    const simplifiedError = handleValidationError(error);
    statusCode = simplifiedError.statusCode;
    errorName = simplifiedError.errorName;
    errorMessages = simplifiedError.errorMessages;

    // zodValidator error handler
  } else if (error instanceof ZodError) {
    const simplifiedError = handleZodError(error);
    statusCode = simplifiedError.statusCode;
    errorName = simplifiedError.errorName;
    errorMessages = simplifiedError.errorMessages;

    // handleCastError error handler
  } else if (error?.name === 'CastError') {
    const simplifiedError = handleCastError(error);
    statusCode = simplifiedError.statusCode;
    errorName = simplifiedError.errorName;
    errorMessages = simplifiedError.errorMessages;
  } else if (error?.name === 'MissingSchemaError') {
    // res.status(200).json({error})
    const simplifiedError = handleMissingSchemaError(error);
    statusCode = simplifiedError.statusCode;
    errorName = simplifiedError.errorName;
    errorMessages = simplifiedError.errorMessages;
  }

  if (error instanceof JsonWebTokenError) {
    const simplifiedError = handleJwtTokenError(error);
    statusCode = simplifiedError.statusCode;
    errorName = simplifiedError.errorName;
    errorMessages = simplifiedError.errorMessages;
  }

  // api error handler
  else if (error instanceof HandleApiError) {
    statusCode = error?.statusCode;
    errorName = error.message;
    errorMessages = error?.message
      ? [
          {
            path: '',
            message: error?.message,
          },
        ]
      : [];
    // node default error handler
  } else if (error instanceof Error) {
    errorName = error?.message;
    errorMessages = error?.message
      ? [
          {
            path: '',
            message: error?.message,
          },
        ]
      : [];
  }
  // error response provider
  res.status(statusCode).json({
    success: false,
    errorName,
    errorMessages,
    stack: configs.env !== 'production' ? error?.stack : undefined,
  });
};

export default globalErrorHandler;
