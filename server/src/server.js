const hapi = require('@hapi/hapi');
/* swagger section */
const Inert = require('@hapi/inert'); // file response handler
const Vision = require('@hapi/vision'); // template string
const HapiSwagger = require('hapi-swagger');

const package = require('../package.json');
const { sequelize, associate } = require('../db/connect');

const registerPlugins = async (server) => {
  // LOGGER
  await server.register({
    plugin: require('hapi-pino'),
    options: {
      prettyPrint: true,
      logEvents: ['response', 'onPostStart'],
    },
  });

  // DOCUMENTATION
  if (process.NODE_ENV !== 'test') {
    await server.register([
      { plugin: Inert },
      { plugin: Vision },
      {
        plugin: HapiSwagger,
        options: {
          info: {
            title: package.description,
            version: package.version,
          },
        },
      },
    ]);
  }
  return server;
};

let serverRegistredPlugins = false;
exports.start = async () => {
  const server = hapi.server({
    port: process.env.PORT || 3001,
    host: 'localhost',
    routes: { cors: true },
  });
  server.route(require('./resources/utils/utils.routes'));
  server.route(require('./resources/parties/party.routes'));
  if (process.env.NODE_ENV === 'test') {
    await sequelize.models.Party.sync({ force: true });
    if (!serverRegistredPlugins) {
      await registerPlugins(server);
      serverRegistredPlugins = true;
    }
    await server.initialize();
  } else {
    await sequelize.sync();
    await registerPlugins(server);
    await server.start();
    console.log(
      `[API v${package.version}] Server running at: ${server.info.uri}`,
    );
    console.log(
      `Documentation is avalaible at: ${server.info.uri}/documentation`,
    );
  }
  return server;
};

process.on('unHandledRejection', (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
});
