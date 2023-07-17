import express from 'express';

import roleVerifier from '../../../utils/middlewares/roleVerifier';
import zodValidator from '../../../utils/middlewares/zodValidator';
import { EnumUserRole } from '../../../utils/shared/enum';

import { BookControllers } from './book.controllers';
import { BookValidations } from './book.validations';

const router = express.Router();
const { createBookZodSchema, addReviewZodSchema } = BookValidations;
const { createBook, getAllBooks, getSingleBook, getYearGenre, addReview } = BookControllers;
const { OWNER, READER, ADMIN } = EnumUserRole;

// router.post('/', zodValidator(createBookZodSchema), roleVerifier(READER), createBook);
// router.get('/year-genre', getYearGenre);
// router.route('/:id').get(roleVerifier(READER), getSingleBook);

// //   .delete(roleVerifier(SELLER), deleteBook);
// router.put('/review/:id', zodValidator(addReviewZodSchema), addReview);
// router.get('/', getAllBooks);
router.get('/year-genre', getYearGenre);
router.get('/', getAllBooks);
router.get('/:id', roleVerifier(READER), getSingleBook);

router.post('/', zodValidator(createBookZodSchema), roleVerifier(READER), createBook);

router.put('/review/:id', zodValidator(addReviewZodSchema), addReview);

export const BookRoutes = router;
