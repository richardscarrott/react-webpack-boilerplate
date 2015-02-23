var gulp = require('gulp');
var fs = require('fs');
var ini = require('ini');
var argv = require('yargs').argv;

// CLI arguments
var env = argv.env || 'dev';

/**
 * Sets the enviroment variables.
 */
function vars(cb) {
    var config = ini.parse(fs.readFileSync('./server/env/.' + env, 'utf-8'));
    for (var prop in config) {
        process.env[prop] = config[prop];
    }
    cb();
}

/**
 * Starts up the server.
 */
function server() {
    require('./../server/server');
}

gulp.task('serve', gulp.series(gulp.parallel('build', vars), server));