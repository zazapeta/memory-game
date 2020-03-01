const Joi = require('@hapi/joi');
const { list, create, update } = require('./party.controller');

module.exports = [
  {
    method: 'GET',
    path: '/parties',
    options: {
      description: 'list of all parties',
      tags: ['api', 'parties'],
    },
    handler: list,
  },
  {
    method: 'POST',
    path: '/parties',
    options: {
      description: 'create a party',
      tags: ['api', 'parties'],
      validate: {
        payload: Joi.object({
          username: Joi.string()
            .min(1)
            .max(20),
          seconds: Joi.number()
            .integer()
            .min(0),
        }),
      },
    },
    handler: create,
  },
];
