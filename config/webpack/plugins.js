const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');

const commonPlugins = [
  new ExtractTextPlugin('[name].css'),
  new OptimizeCSSPlugin({ canPrint: true }),
];

if (process.env.NODE_ENV === 'production') {
  commonPlugins.push(new webpack.optimize.UglifyJSPlugin());
}

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
      APP_URL: JSON.stringify(process.env.APP_URL),
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
