'use strict';

var webpack = require('webpack');

module.exports = function(release) {
  return {
  	output: {
  		path: './build/',
  		filename: 'state-proxy.js',
      library: 'StateProxy',
      libraryTarget: 'umd'
  	},
  	cache: !release,
    debug: !release,
    entry: './src/StateProxy.js',
    externals: {
    },
    plugins: release ? [
      new webpack.DefinePlugin({'process.env.NODE_ENV': '"production"'}),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin(),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.AggressiveMergingPlugin()
    ] : [],
    resolve: {
      extensions: ['', '.webpack.js', '.web.js', '.js']
    },
    module: {
      preLoaders: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'jshint'
        }
      ]
  	}
  };
};
