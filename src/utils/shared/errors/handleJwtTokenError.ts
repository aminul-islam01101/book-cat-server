import { JsonWebTokenError } from 'jsonwebtoken';

import { TGenericErrorMessage } from '../types/errorTypes';

const handleJwtTokenError = (error: JsonWebTokenError) => {
  const errors: TGenericErrorMessage[] = [
    {
      path: '',
      message: error?.message,
    },
  ];

  const statusCode = 403;
  return {
    statusCode,
    errorName: error?.name,
    errorMessages: errors,
  };
};

export default handleJwtTokenError;
