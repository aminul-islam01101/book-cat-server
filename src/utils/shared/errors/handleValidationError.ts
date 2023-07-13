import mongoose from 'mongoose';

import { TGenericErrorMessage, TGenericErrorResponse } from '../types/errorTypes';

const handleValidationError = (error: mongoose.Error.ValidationError): TGenericErrorResponse => {
  const errors: TGenericErrorMessage[] = Object.values(error.errors).map(
    (element: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: element?.path,
        message: element?.message,
      };
    }
  );
  const statusCode = 400;
  return {
    statusCode,
    errorName: 'Mongoose Validation Error',
    errorMessages: errors,
  };
};

export default handleValidationError;
