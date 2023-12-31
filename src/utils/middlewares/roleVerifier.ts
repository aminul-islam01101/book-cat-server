import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';

import { TTokens } from '../../app/modules/auth/shared/auth.types';
import { configs } from '../configs/env.configs';
import { HandleApiError } from '../shared/errors/handleApiError';
import { jwtHelpers } from '../shared/helpers/jwtHelpers';

const roleVerifier =
  (...requiredRoles: string[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      // get authorization token
      const token = req.headers.authorization;

      const { refreshToken, accessToken } = req.cookies as TTokens;

      if (!token && !accessToken) {
        throw new HandleApiError(httpStatus.UNAUTHORIZED, 'You are not authorized');
      }
      // verify token
      let verifiedUser = null;

      verifiedUser = jwtHelpers.verifyToken(
        token || accessToken,
        configs.jwtSecretAccess as Secret
      );

      req.user = verifiedUser;

      if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role as string)) {
        throw new HandleApiError(httpStatus.FORBIDDEN, 'Forbidden');
      }
      next();
    } catch (error) {
      next(error);
    }
  };

export default roleVerifier;
