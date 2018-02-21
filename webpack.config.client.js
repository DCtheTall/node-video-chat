if (!process.env.NODE_ENV) require('dotenv').load(); // eslint-disable-line global-require

const publicPath = require('./webpack/public-path');
const vendor = require('./webpack/vendor.js');
const { clientPlugins: plugins } = require('./webpack/plugins');

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
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['react', 'es2015', 'stage-1'],
        },
      },
    }],
  },
  plugins,
};
