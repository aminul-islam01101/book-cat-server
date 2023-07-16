import express from 'express';

import zodValidator from '../../../../utils/middlewares/zodValidator';

import { EmailControllers } from './email.controllers';
import { EmailSignUpValidations } from './email.validations';

const router = express.Router();

const { createUser, loginUser } = EmailControllers;
const { createEmailUserZodSchema, emailLoginZodSchema } = EmailSignUpValidations;

router.post('/signup', zodValidator(createEmailUserZodSchema), createUser);
router.post('/login', zodValidator(emailLoginZodSchema), loginUser);
// router.post('/forget-pass', zodValidator(forgetPassZodSchema), AuthControllers.resetPassword);
// router.post(
//   '/refresh-token',
//   zodValidator(AuthValidations.refreshTokenZodSchema),
//   AuthControllers.getAccessTokenByRefreshToken
// );

export const EmailPassAuthRoutes = router;
