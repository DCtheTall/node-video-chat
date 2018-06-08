const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

const commonPlugins = [
  new ExtractTextPlugin('[name].css'),
  new OptimizeCSSPlugin({ canPrint: true }),
];

const serverPlugins = [
  ...commonPlugins,
];

const clientPlugins = [
  new webpack.DefinePlugin({
    'process.env': {
      APP_URL: JSON.stringify(process.env.APP_URL),
      GRAPHQL_URI: JSON.stringify(process.env.GRAPHQL_URI),
      GRAPHQL_WS_URI: JSON.stringify(process.env.GRAPHQL_WS_URI),
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    },
  }),
  new webpack.optimize.CommonsChunkPlugin({
    names: ['app', 'vendor'],
    minChunks: Infinity,
  }),
  new webpack.optimize.ModuleConcatenationPlugin(),
  new ManifestPlugin(),
  ...(process.env.NODE_ENV === 'production' ? [new webpack.optimize.UglifyJsPlugin()] : []),
  ...commonPlugins,
];

module.exports = { serverPlugins, clientPlugins };
