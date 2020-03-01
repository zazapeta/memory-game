const { Sequelize, sequelize } = require('../../../db/connect');

const Party = sequelize.define(
  'Party',
  {
    id: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    username: {
      type: Sequelize.STRING,
      validate: {
        len: [1, 20],
      },
      allowNull: false,
    },
    progress: {
      type: Sequelize.NUMBER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100,
      },
    },
  },
  {
    timestamp: true,
  },
);

Party.modelName = 'Party';

module.exports = Party;
