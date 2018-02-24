const Sequelize = require('sequelize');

const sequelize = require('../../../config/sequelize');

const db = {};

[ /* eslint-disable global-require */
  require('./user'),
].forEach((linkModel) => {
  const model = sequelize.import(linkModel.toString(), linkModel);
  db[model.name] = model;
});

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
