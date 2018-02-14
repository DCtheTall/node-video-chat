const webpack = require('webpack');

const commonPlugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production'),
    },
  }),
];

const serverPlugins = [
  ...commonPlugins,
];

module.exports = { serverPlugins };
