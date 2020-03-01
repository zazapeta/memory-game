const Boom = require('@hapi/boom');
const Party = require('./party.model');

class PartyController {
  static async list(req) {
    const parties = await Party.findAll();
    return parties.map((p) => p.toJSON());
  }
  static async create(req, h) {
    const createdParty = await Party.create(req.payload);
    return h.response(createdParty.toJSON()).created('/parties');
  }

  static async update(req, h) {
    const party = await Party.findByPk(req.params.id);
    if (!party) {
      return Boom.notFound();
    }
    const updatedParty = await party.save(req.payload);
    return updatedParty.toJSON();
  }
}

module.exports = PartyController;
