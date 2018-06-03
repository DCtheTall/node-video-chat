/* eslint-disable global-require */
if (!process.env.NODE_ENV) require('dotenv').load();
const modules = {
  server: require('./server'),
  subscriptionServer: require('./subscriptions'),
};
modules[process.env.APP_NAME]();
