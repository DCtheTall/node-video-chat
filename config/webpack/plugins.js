const webpack = require('webpack');

const commonPlugins = [];

const serverPlugins = [
  ...commonPlugins,
  new webpack.DefinePlugin({
    'process.env': JSON.stringify(process.env),
  }),
];

const clientPlugins = [
  ...commonPlugins,
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
];

module.exports = { serverPlugins, clientPlugins };
