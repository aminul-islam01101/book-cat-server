import mongoose from 'mongoose';

import { errorLogger } from '../shared/logger';

import { configs } from './env.configs';

mongoose.set('strictQuery', true);

const mongoDbUrl = configs.databaseUrl;

const connectDataBase = async () => {
  try {
    await mongoose.connect(configs.databaseUrl as string);
    console.log(
      `
database connection successful 🌹`.cyan
    );
  } catch (err) {
    errorLogger.error('Failed to connect to database', err);
  }
};

export { connectDataBase, mongoDbUrl };
