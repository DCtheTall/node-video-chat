const webpack = require('webpack');

const commonPlugins = [
  new webpack.DefinePlugin({
    'process.env': {
      APP_URL: JSON.stringify(process.env.APP_URL),
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
    names: ['app', 'vendor'],
    minChunks: Infinity,
  }),
  new webpack.optimize.ModuleConcatenationPlugin(),
];

module.exports = { serverPlugins, clientPlugins };
