import express from 'express';

import roleVerifier from '../../../../utils/middlewares/roleVerifier';
import { EnumUserRole } from '../../../../utils/shared/enum';
import { EmailPassAuthRoutes } from '../email/email.routes';

import { AuthControllers } from './auth.controllers';

// import { GoogleAuthRoutes } from './google/google.auth.route';

const AuthRoutes = express.Router();
const { OWNER, READER, ADMIN } = EnumUserRole;

const moduleRoutes = [
  {
    path: '/',
    route: EmailPassAuthRoutes,
  },

  //   {
  //     path: '/google',
  //     route: GoogleAuthRoutes,
  //   },
];

moduleRoutes.forEach((route) => AuthRoutes.use(route.path, route.route));
AuthRoutes.get('/me', roleVerifier(OWNER, READER, ADMIN), AuthControllers.loggedInUser);
AuthRoutes.post('/logout', AuthControllers.logOut);
AuthRoutes.get('/refresh', AuthControllers.refreshAccessToken);

export default AuthRoutes;
