import express from 'express';

// import AuthRoutes from './modules/auth/auth.routes';

const routes = express.Router();

// const moduleRoutes = [
//   {
//     path: '/auth',
//     // route: AuthRoutes,
//   },
// ];
routes.get('/health-check', (req, res) => {
  res.send('OK');
});

// moduleRoutes.forEach((route) => routes.use(route.path, route.route));

export default routes;
