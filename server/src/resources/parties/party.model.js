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
    seconds: {
      type: Sequelize.NUMBER,
      defaultValue: 0,
      validate: {
        isInt: true,
        min: 0,
      },
    },
  },
  {
    timestamp: true,
  },
);

Party.modelName = 'Party';

module.exports = Party;
