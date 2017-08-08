const webpack = require('webpack')

const webpackConfig = {
  module: {
    loaders: [{
      test: /\.vue$/,
      loader: 'vue-loader'
    },{
      test: /\.js$/,
      exclude: /node_modules|vue\/dist/,
      loader: 'babel-loader'
    }]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"'
      }
    })
  ],
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
    }
  },
  devtool: '#inline-source-map'
}

module.exports = {
  basePath: '',
  files: [
    '../test/unit/index.js'
  ],
  exclude: [
  ],
  frameworks: ['mocha', 'chai'],
  preprocessors: {
    '../test/unit/index.js': ['webpack', 'sourcemap']
  },
  webpack: webpackConfig,
  webpackMiddleware: {
    noInfo: true
  }
}
