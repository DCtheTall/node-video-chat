if (!process.env.NODE_ENV) require('dotenv').load(); // eslint-disable-line global-require

const publicPath = require('./config/webpack/public-path');
const vendor = require('./config/webpack/vendor.js');
const { clientPlugins: plugins } = require('./config/webpack/plugins');
const rules = require('./config/webpack/rules');

module.exports = {
  name: 'browser',
  entry: {
    vendor,
    app: './src/client/index.jsx',
  },
  target: 'web',
  output: {
    publicPath,
    path: `${__dirname}/public/dist/`,
    filename: '[name].js',
    chunkFilename: '[name].[chunkhash].js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: { rules },
  plugins,
};
