const should = require('should');
const Party = require('./party.model');
const { start } = require('../../server');

const party = {
  username: 'joe',
  progress: 100,
};
describe('## PARTIES ##', () => {
  let server;
  beforeEach(async () => {
    server = await start();
  });
  afterEach(async () => {
    await server.stop();
  });
  describe('GET /parties', () => {
    it('Should get the user list', async () => {
      const createdParties = await Promise.all([
        Party.create(party),
        Party.create(party),
        Party.create(party),
      ]);
      const res = await server.inject({
        method: 'GET',
        url: '/parties',
      });
      should(res.statusCode).be.equal(200);
      should(res.result).match(createdParties.map((p) => p.toJSON()));
    });
  });
  describe('POST /parties', () => {
    it('Should return 201 and create a party', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/parties',
        payload: {
          username: 'jhon',
        },
      });
      should(res.statusCode).be.equal(201);
      const createdParty = (await Party.findAll())[0];
      should(res.result).match(createdParty.toJSON());
    });
    it('Should return 400 as username is missing', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/parties',
      });
      should(res.statusCode).be.equal(400);
    });
  });
  describe('PUT /parties', () => {
    it('Should return 200 and update a party', async () => {
      const createdParty = await Party.create(party);
      const res = await server.inject({
        method: 'PUT',
        url: `/parties/${createdParty.id}`,
        payload: {
          progress: 85,
        },
      });
      should(res.statusCode).be.equal(200);
      should(res.result).match(createdParty.toJSON());
    });
    it('Should return 404 as the party dos not exist', async () => {
      const res = await server.inject({
        method: 'PUT',
        url: `/parties/456dq4f56`,
        payload: {
          progress: 85,
        },
      });
      should(res.statusCode).be.equal(404);
    });
    it('Should return 400 as progress is out of range', async () => {
      const createdParty = Party.create(party);
      const res = await server.inject({
        method: 'PUT',
        url: `/parties/${createdParty.id}`,
        payload: {
          progress: 185,
        },
      });
      should(res.statusCode).be.equal(400);
    });
  });
});