var gulp = require('gulp');
var shell = require('gulp-shell');

gulp.task('serve', shell.task('node server/server.js'));
gulp.task('serve-debug', shell.task('node-debug server/server.js'));