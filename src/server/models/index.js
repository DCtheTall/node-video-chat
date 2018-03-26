import Sequelize from 'sequelize';
import sequelize from '../../../config/sequelize';

import linkUser from './user';
import linkContactRequest from './contact_request';
import linkContact from './contact';
import linkMessageThread from './message_thread';

const db = {};

[
  linkUser,
  linkContactRequest,
  linkContact,
  linkMessageThread,
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
