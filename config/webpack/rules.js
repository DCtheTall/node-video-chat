const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = [{
  test: /\.jsx?$/,
  exclude: /(node_modules|bower_components)/,
  use: {
    loader: 'babel-loader',
    options: {
      presets: ['env', 'react', 'stage-1'],
      plugins: ['syntax-dynamic-import'],
    },
  },
}, {
  test: /\.(graphql|gql)$/,
  exclude: /node_modules/,
  loader: 'graphql-tag/loader',
}, {
  test: /\.scss$/,
  exclude: /node_modules/,
  loader: ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: [
      {
        loader: 'css-loader',
        options: { importLoaders: 1 },
      },
      {
        loader: 'postcss-loader',
        options: {
          ident: 'postcss',
          plugins: () => [require('autoprefixer')()],
        },
      },
      'sass-loader',
    ],
  }),
}];
