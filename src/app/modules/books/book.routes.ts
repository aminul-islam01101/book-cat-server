import express from 'express';

import roleVerifier from '../../../utils/middlewares/roleVerifier';
import zodValidator from '../../../utils/middlewares/zodValidator';
import { EnumUserRole } from '../../../utils/shared/enum';

import { BookControllers } from './book.controllers';
import { BookValidations } from './book.validations';

const router = express.Router();
const { createBookZodSchema } = BookValidations;
const { createBook, getAllBooks, getSingleBook, getYearGenre } = BookControllers;
const { OWNER, READER, ADMIN } = EnumUserRole;

router.post('/', zodValidator(createBookZodSchema), roleVerifier(READER), createBook);
router.get('/year-genre', getYearGenre);
router.route('/:id').get(roleVerifier(READER), getSingleBook);
//   .patch(zodValidator(updateBookZodSchema), roleVerifier(SELLER), updateBook)
//   .delete(roleVerifier(SELLER), deleteBook);

router.get('/', getAllBooks);

export const BookRoutes = router;
