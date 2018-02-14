const publicPath = require('./webpack/public-path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  name: 'server',
  entry: './bin/start.js',
  target: 'node',
  output: {
    publicPath,
    path: `${__dirname}/build/`,
    filename: 'server.js',
  },
  externals: [nodeExternals()],
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
