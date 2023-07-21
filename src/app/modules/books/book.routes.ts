import express from 'express';

import roleVerifier from '../../../utils/middlewares/roleVerifier';
import zodValidator from '../../../utils/middlewares/zodValidator';
import { EnumUserRole } from '../../../utils/shared/enum';

import { BookControllers } from './book.controllers';
import { BookValidations } from './book.validations';

const router = express.Router();
const { createBookZodSchema, addReviewZodSchema } = BookValidations;
const {
  createBook,
  getAllBooks,
  getSingleBook,
  getYearGenre,
  addReview,
  updateBook,
  deleteBook,
  manipulateFavorite,
  getReader,
} = BookControllers;
const { READER } = EnumUserRole;

router
  .route('/')
  .post(zodValidator(createBookZodSchema), roleVerifier(READER), createBook)
  .get(getAllBooks);

router.route('/year-genre').get(getYearGenre);

router
  .route('/:id')
  .get(getSingleBook)
  .patch(roleVerifier(READER), updateBook)
  .delete(roleVerifier(READER), deleteBook);

router.put('/review/:id', zodValidator(addReviewZodSchema), addReview);
router.post('/favorite/:email', manipulateFavorite);
router.get('/reader/:email', getReader);

export const BookRoutes = router;
