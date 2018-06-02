const Sequelize = require('sequelize');
const config = require('./config');

const args = process.env.NODE_ENV === 'production' ? [process.env.DATABASE_URL, config] : [config];
const sequelize = new Sequelize(...args);

sequelize.authenticate()
         .then(() => console.log('Connected to PostgreSQL database'))
         .catch(err => console.log(`Failed to connect to database: ${err.stack}`));

module.exports = sequelize;

