const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = [{
  test: /\.jsx?$/,
  exclude: /(node_modules|bower_components)/,
  use: {
    loader: 'babel-loader',
    options: {
      presets: ['react', 'es2015', 'stage-1'],
    },
  },
}, {
  test: /\.(graphql|gql)$/,
  exclude: /node_modules/,
  loader: 'graphql-tag/loader',
}, {
  test: /\.scss$/,
  exclude: /node_modules/,
  loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader!sass-loader' }),
}];
