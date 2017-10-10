const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './test/dev/dev-app.js',
  output: {
    path: path.resolve(__dirname, '/test/unit'),
    filename: 'tests.js',
    publicPath: '/'
  },
  module: {
    rules: [
     {
      test: /\.vue$/,
      loader: 'vue-loader'
    },{
      test: /\.js$/,
      exclude: /node_modules|vue\/dist/,
      loader: 'babel-loader'
    }]
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'My App',
      template: './test/dev/dev-index.html'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"'
      }
    })
  ],
  devtool: '#eval-source-map'
}
