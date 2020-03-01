// const { migrate } = require('../db/migrate');
// const { associate } = require('../db/associate');
const { start } = require('./server');

async function main() {
  // await migrate();
  // await associate();
  start();
}

main();
