const Boom = require('@hapi/boom');
const { sequelize } = require('../../../db/connect');
const Party = require('./party.model');

class PartyController {
  static async list(req) {
    const parties = await Party.findAll({
      limit: 20,
      order: sequelize.literal('seconds ASC'),
    });
    return parties.map((p) => p.toJSON());
  }
  static async create(req, h) {
    const createdParty = await Party.create(req.payload);
    return h.response(createdParty.toJSON()).created('/parties');
  }
}

module.exports = PartyController;
