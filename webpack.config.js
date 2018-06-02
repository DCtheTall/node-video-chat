const serverConfig = require('./webpack.config.server');
const clientConfig = require('./webpack.config.client');
const subscriptionServerConfig = require('./webpack.config.subscription');

module.exports = [serverConfig, clientConfig, subscriptionServerConfig];
