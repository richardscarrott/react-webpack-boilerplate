// https://github.com/webpack/webpack-with-common-libs/blob/master/gulpfile.js

var gulp = require('gulp');
var gutil = require('gulp-util');
var path = require('path');
var webpack = require('webpack');
var StatsPlugin = require('stats-webpack-plugin');
var BrowserConsoleBuildErrorPlugin = require('browser-console-build-error-webpack-plugin');
var autoprefixer = require('autoprefixer-core');
var del = require('del');
var argv = require('yargs').argv;

// CLI arguments
var env = argv.env || 'dev';
var release = !!argv.release;
var watch = !!argv.watch;

/**
 * Deletes the contents of the dist directory.
 * @param {Function}
 */
function clean(cb) {
    del('dist/**', cb);
}

/**
 * Returns the default webpack config used by both dev and release builds.
 * @return {Object} The webpack config.
 */
function getDefaultConfig() {
    return {
        entry: 'app.js',
        output: {
            path: path.join(__dirname, '../dist'),
            filename: 'entry.js',
            chunkFilename: '[name].js'
        },
        module: {
            loaders: [
                { test: /\.js$/, loader: 'jsx-loader?harmony' },
                { test: /\.css$/, loader: 'style-loader!css-loader!postcss-loader' },
                { test: /\.(png|jpg|gif)$/, loader: 'url-loader?limit=8192' },
                { test: /react\.js$/, loader: 'expose?React' }
            ]
        },
        postcss: [autoprefixer()],
        resolve: {
            root: [
                path.join(__dirname, '../bower_components'),
                path.join(__dirname, '../src/app'),
                path.join(__dirname, '../src/assets')
            ]
        },
        plugins: [
            new webpack.ResolverPlugin(
                new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('bower.json', ['main'])
            ),
            new StatsPlugin(path.join(__dirname, '../dist', 'stats.json'), {
                chunkModules: true
            }),
            new webpack.DefinePlugin({
                ENV: require('../src/env/' + env)
            }),
            new BrowserConsoleBuildErrorPlugin()
        ]
    };
}

/**
 * Returns the dev webpack config.
 * @return {Object} The webpack config.
 */
function getDevConfig() {
    var config = getDefaultConfig();
    config.devtool = 'source-map';
    config.debug = true;
    return config;
}

/**
 * Returns the release webpack config.
 * @return {Object} The webpack config.
 */
function getReleaseConfig() {
    var config = getDefaultConfig();
    config.output.filename = '[chunkhash].entry.js';
    config.output.chunkFilename = '[chunkhash].[name].js';
    config.plugins = config.plugins.concat([
        new webpack.optimize.UglifyJsPlugin()
    ]);
    return config;
}

/**
 * Returns the dev or release webpack config based on option passed.
 * @return {Object} The webpack config.
 */
function getConfig() {
    return release ? getReleaseConfig() : getDevConfig();
}

/**
 * Bundles the src code.
 * @param {Function}
 */
function bundle(cb) {
    var compiler = webpack(getConfig());
    var firstRun = true;
    function handler(err, stats) {
        if (err) {
            new gutil.PluginError('webpack', err);
        }
        gutil.log(stats.toString({
            colors: true
        }));
        if (firstRun) {
            cb();
        }
    }
    if (watch) {
        compiler.watch(200, handler);
    } else {
        compiler.run(handler);
    }
}

/**
 * Copies all files in root of src, e.g. favicon.ico, robots.txt etc.
 * @return {Stream}
 */
function copy() {
    return gulp.src('src/*.*')
        .pipe(gulp.dest('dist'));
}

gulp.task('build', gulp.series(clean, gulp.parallel(bundle, copy)));
