import mongoose from 'mongoose';

import { TGenericErrorMessage } from '../types/errorTypes';

const handleCastError = (error: mongoose.Error.CastError) => {
  const errors: TGenericErrorMessage[] = [
    {
      path: error.path,
      message: 'Invalid Id',
    },
  ];

  const statusCode = 400;
  return {
    statusCode,
    errorName: 'Cast Error',
    errorMessages: errors,
  };
};

export default handleCastError;
