import mongoose from 'mongoose';

import { TGenericErrorMessage } from '../types/errorTypes';

const handleMissingSchemaError = (error: mongoose.Error.MissingSchemaError) => {
  const errors: TGenericErrorMessage[] = [
    {
      path: error.message.split('for ')[1],
      message: error.message,
    },
  ];

  const statusCode = 400;
  return {
    statusCode,
    errorName: error.name,
    errorMessages: errors,
  };
};

export default handleMissingSchemaError;
