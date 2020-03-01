const path = require('path');
const glob = require('glob');
const Sequelize = require('sequelize');
const cfg = require('./config');
const sequelize = new Sequelize(cfg);

const models = {};
async function registerModels() {
  glob
    .sync('../src/**/*.model.js')
    .map((modelFile) => require(path.relative(__dirname, modelFile)))
    .forEach((model) => {
      if (model && model.modelName) {
        models[model.modelName] = model;
      }
    });
}
registerModels();

module.exports = { Sequelize, sequelize, models };
