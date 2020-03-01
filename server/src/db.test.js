const { sequelize } = require('../db/connect');

describe('## DATABASE ##', () => {
  describe('Database connection', () => {
    it('should connect succeffully', (done) => {
      sequelize.authenticate().then((errors) => {
        if (errors) {
          done(errors);
        } else {
          done();
        }
      });
    });
  });
});
