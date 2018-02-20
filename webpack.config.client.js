if (!process.env.NODE_ENV) require('dotenv').load(); // eslint-disable-line global-require

const publicPath = require('./webpack/public-path');
const vendor = require('./webpack/vendor');

module.exports = {
  name: 'browser',
  entry: {
    app: './src/client/index.jsx',
    vendor,
  },
  target: 'web',
  output: {
    publicPath,
    path: `${__dirname}/public/dist/`,
    filename: '[name].js',
    chunkFilename: '[name].js',
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
};
