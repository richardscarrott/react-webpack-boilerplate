var gulp = require('gulp');
var shell = require('gulp-shell');

gulp.task('serve', shell.task('node dist/server/server.js'));