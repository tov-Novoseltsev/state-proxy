'use strict';

var webpackConfig = require('./webpack.js')(/* release */ false);

module.exports = function (config) {
  config.set({

    basePath: '../',

    files: [
      'src/**/*Spec.js'
    ],

    preprocessors: {
      'src/**/*Spec.js': ['webpack']
    },

    webpack: {
      cache: true,
      module: {
        loaders: []
      }
    },

    webpackServer: {
      stats: {
        colors: true
      }
    },

    autoWatch: false,

    singleRun: true,

    frameworks: ['jasmine'],

    browsers: ['Chrome'],

    plugins: [
      'karma-chrome-launcher',
      'karma-phantomjs-launcher',
      'karma-jasmine',
      'karma-webpack'
    ]

  });
};
