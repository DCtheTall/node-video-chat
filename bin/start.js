/* eslint-disable global-require */
if (!process.env.NODE_ENV) require('dotenv').load();

const modules = {
  graphqlServer: require('./graphql-server'),
  signalServer: require('./signal-server'),
};
modules[process.env.APP_NAME]();
