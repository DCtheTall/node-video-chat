import Sequelize from 'sequelize';
import sequelize from '../../../config/sequelize';

import linkUser from './user';

const db = {};

[
  linkUser,
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

export default db;
