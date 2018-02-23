const Sequelize = require('sequelize');
const config = require('./config');

module.exports = new Sequelize(config);
