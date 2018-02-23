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
}];
