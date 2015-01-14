// https://github.com/webpack/webpack-with-common-libs/blob/master/gulpfile.js
var gulp = require('gulp');
var gutil = require('gulp-util');
var webpack = require('webpack');
var webpackConfig = require('./../webpack.config.js')
var del = require('del');

function cleanDist(cb) {
    del('dist/**/*.*', cb);
}

function copySrc() {
    gulp.src([
        'src/**/*',
        '!src/app{,/**}',
        '!src/bower_components{,/**}'
    ]).pipe(gulp.dest('dist'));
}

function build(name, config, cb) {
    cleanDist();
    webpack(config).run(function(err, stats) {
        if (err) throw new gutil.PluginError(name, err);
        gutil.log('[' + name + ']', stats.toString({
            colors: true
        }));
        copySrc(cb);
    });
}

function watchSrc(task) {
    return gulp.watch(['src/**/*'], [task]);
}

gulp.task('build:dev:watch', ['build:dev'], function() {
    return watchSrc('build:dev');
});

gulp.task('build:dev', function(cb) {
    var config = Object.create(webpackConfig);
    config.devtool = 'source-map';
    config.debug = true;
    build('webpack:dev', config, cb);
});