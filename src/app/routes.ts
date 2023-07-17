import express from 'express';

import AuthRoutes from './modules/auth/shared/auth.routes';
import { BookRoutes } from './modules/books/book.routes';

const routes = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/books',
    route: BookRoutes,
  },
];

moduleRoutes.forEach((route) => routes.use(route.path, route.route));

export default routes;
