if (!process.env.NODE_ENV) require('dotenv').load(); // eslint-disable-line global-require

const publicPath = require('./config/webpack/public-path');
const nodeExternals = require('webpack-node-externals');
const { serverPlugins: plugins } = require('./config/webpack/plugins');
const rules = require('./config/webpack/rules');

module.exports = {
  name: 'server',
  entry: './bin/start.js',
  target: 'node',
  node: {
    __dirname: false,
    __filename: false,
  },
  output: {
    publicPath,
    path: `${__dirname}/build/`,
    filename: 'server.js',
  },
  externals: [nodeExternals()],
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: { rules },
  plugins,
};
