import { SortOrder } from 'mongoose';

export type TPaginationOptions = {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: SortOrder;
};

export type TPaginationResult = TPaginationOptions & {
  skip: number;
};
export type TSortConditions = {
  [key: string]: SortOrder;
};
