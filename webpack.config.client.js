if (!process.env.NODE_ENV) require('dotenv').load(); // eslint-disable-line global-require

const publicPath = require('./config/webpack/public-path');
const vendor = require('./config/webpack/vendor.js');
const { clientPlugins: plugins } = require('./config/webpack/plugins');
const rules = require('./config/webpack/rules');

module.exports = {
  name: 'browser',
  entry: {
    vendor,
    app: ['babel-polyfill', './src/client/index.jsx'],
  },
  devtool: process.env.NODE_ENV === 'production' ? 'cheap-eval-source-map' : false,
  target: 'web',
  output: {
    publicPath,
    path: `${__dirname}/public/dist/`,
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: { rules },
  plugins,
};
