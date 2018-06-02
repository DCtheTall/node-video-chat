const Sequelize = require('sequelize');
const config = require('./config');

const sequelize = new Sequelize(config);

sequelize.authenticate()
         .then(() => console.log('Connected to PostgreSQL database'))
         .catch(err => console.log(`Failed to connect to database: ${err.stack}`));

module.exports = sequelize;

