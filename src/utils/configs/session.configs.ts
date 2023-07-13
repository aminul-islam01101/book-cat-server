import MongoStore from 'connect-mongo';

import { mongoDbUrl } from './db.configs';

const sessionConfigs = {
  secret: 'cat',
  resave: true,
  saveUninitialized: true,

  store: MongoStore.create({
    mongoUrl: mongoDbUrl,
    collectionName: 'sessions',
    dbName: 'authPack',
    ttl: 60 * 60,
  }),
  cookie: {
    // maxAge: 2419200000,
    //* production only
    // secure: true
    // sameSite: 'none',
  },
};
export default sessionConfigs;
