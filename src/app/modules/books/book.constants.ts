import { TMonths } from './book.types';

export const bookFilterableFields = ['searchTerm', 'genre', 'publicationYear', 'tags'];
export const bookCheckboxFields = ['publicationMonth'];
export const bookTagSearchableFields = ['title', 'author', 'publicationYear'];
export const bookSearchableFields = ['title', 'author', 'genre'];
export const publicationMonths: TMonths[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
