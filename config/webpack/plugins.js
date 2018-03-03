const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const commonPlugins = [
  new ExtractTextPlugin('[name].css'),
];

const serverPlugins = [
  new webpack.DefinePlugin({
    'process.env': JSON.stringify(process.env),
  }),
  ...commonPlugins,
];

const clientPlugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      GRAPHQL_URI: JSON.stringify(process.env.GRAPHQL_URI),
    },
  }),
  new webpack.optimize.CommonsChunkPlugin({
    names: ['app', 'vendor'],
    minChunks: Infinity,
  }),
  new webpack.optimize.ModuleConcatenationPlugin(),
  ...commonPlugins,
];

module.exports = { serverPlugins, clientPlugins };
