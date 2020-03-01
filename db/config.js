module.exports = {
  dialect: 'sqlite',
  storage: process.env.NODE_ENV === 'test' ? ':memory:' : './db/db.sqlite',
  retry: {
    match: [
      /SequelizeConnectionError/,
      /SequelizeConnectionRefusedError/,
      /SequelizeHostNotFoundError/,
      /SequelizeHostNotReachableError/,
      /SequelizeInvalidConnectionError/,
      /SequelizeConnectionTimedOutError/,
    ],
    max: 10,
  },
};
