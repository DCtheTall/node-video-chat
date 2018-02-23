const webpack = require('webpack');

const commonPlugins = [
  new webpack.DefinePlugin({
    'process.env': JSON.stringify(process.env),
  }),
];

const serverPlugins = [
  ...commonPlugins,
];

const clientPlugins = [
  ...commonPlugins,
  new webpack.optimize.CommonsChunkPlugin({
    names: ['app', 'vendor'],
    minChunks: Infinity,
  }),
  new webpack.optimize.ModuleConcatenationPlugin(),
];

module.exports = { serverPlugins, clientPlugins };
