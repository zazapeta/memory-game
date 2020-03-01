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
        }),
      },
    },
    handler: create,
  },
  {
    method: 'PUT',
    path: '/parties/{id}',
    options: {
      description: 'update a party',
      tags: ['api', 'parties'],
      validate: {
        payload: Joi.object({
          progress: Joi.number()
            .min(0)
            .max(100),
          seconds: Joi.number()
            .integer()
            .min(0),
        }),
      },
    },
    handler: update,
  },
];
