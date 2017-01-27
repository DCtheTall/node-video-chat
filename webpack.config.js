var webpack = require('webpack');
const uglifyPlugin = new webpack.optimize.UglifyJsPlugin({
  minimize: true,
  compress: {
    warnings: false
  },
  sourceMap: false
});

module.exports = {
  entry: {
    bundle: "./src/main.jsx"
  },
  output: {
    path: "./public",
    filename: "[name].js",
    chunkFilename: "[id].js"
  },
  module: {
    loaders: [
      { test: /.json$/,
        loader: 'json-loader'
      },
      { test: /.jsx$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015', 'stage-2']
        },
      },
      { test: /.scss$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  }
  // plugins: [uglifyPlugin]
}
