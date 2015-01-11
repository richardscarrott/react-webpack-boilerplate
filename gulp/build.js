// https://github.com/webpack/webpack-with-common-libs/blob/master/gulpfile.js
var gulp = require('gulp');
var gutil = require('gulp-util');
var webpack = require('webpack');
var webpackConfig = require('./../webpack.config.js')
var del = require('del');

gulp.task('clean:dist', function(cb) {
    del('dist/**/*.*', cb);
});

gulp.task('build', ['webpack'], function() {
    return gulp.watch(['www/**/*', 'server/**/*'], ['webpack']);
});

gulp.task('webpack', ['clean:dist'], function(callback) {
    var config = Object.create(webpackConfig);
    config.devtool = 'source-map';
    config.debug = true;

    webpack(config).run(function(err, stats) {
        if (err) throw new gutil.PluginError('webpack:build', err);
        gutil.log('[webpack]', stats.toString({
            colors: true
        }));
        callback();
    });

    gulp.src(['server/**/*.*'])
        .pipe(gulp.dest('dist/server'));
});