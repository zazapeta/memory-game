const { sequelize } = require('../../../db/connect');

module.exports = [
  // Verify the state of the connection
  {
    method: 'GET',
    path: '/utils/dbping',
    options: {
      description: 'ping the db',
      tags: ['api', 'utils'],
    },
    handler: async () => {
      try {
        await sequelize.authenticate();
        return '💫 Connexion Successful 💫';
      } catch (e) {
        return '💔 Connexion Broken 💔';
      }
    },
  },
];
