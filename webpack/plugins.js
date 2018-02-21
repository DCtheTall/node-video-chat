const webpack = require('webpack');

const commonPlugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    },
  }),
];

const serverPlugins = [
  ...commonPlugins,
];

const clientPlugins = [
  ...commonPlugins,
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks: Infinity,
  }),
  // new webpack.optimize.CommonsChunkPlugin({
  //   name: 'wp-runtime',
  //   chunks: ['app', 'vendor'],
  // }),
  new webpack.optimize.AggressiveSplittingPlugin(),
];

module.exports = { serverPlugins, clientPlugins };
