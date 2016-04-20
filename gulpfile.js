'use strict';

var gulp = require('gulp');
var del = require('del');
var parseArgs = require('minimist');
var webpack = require('webpack');

var argv = parseArgs(process.argv.slice(2));

// Settings
var DEST = './build';
var RELEASE = !!argv.release;

gulp.task('clean', del.bind(null, [DEST]));

gulp.task('default', ['build']);

gulp.task('build', ['clean'], function(cb) {
  var config = require('./config/webpack.js')(RELEASE);
  var compiler = webpack(config);
  compiler.run(function(err, stats) {
    if (err) {
      console.log(err);
        return;
    }
    console.log('[webpack]', stats.toString({colors: true}));
    cb();
  });
});