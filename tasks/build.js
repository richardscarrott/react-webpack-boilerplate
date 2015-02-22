// https://github.com/webpack/webpack-with-common-libs/blob/master/gulpfile.js

// TODO: Work out better way to pass in environment vars as the DefinePlugin
// doesn't optimize well.

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

var compiler;

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
                path.join(__dirname, '../src/bower_components'),
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
                ENV: JSON.stringify(require('../src/env/' + env))
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
 * Returns the prod webpack config.
 * @return {Object} The webpack config.
 */
function getProdConfig() {
    var config = getDefaultConfig();
    config.output.filename = '[chunkhash].entry.js';
    config.output.chunkFilename = '[chunkhash].[name].js';
    config.plugins = config.plugins.concat([
        new webpack.optimize.UglifyJsPlugin()
    ]);
    return config;
}

/**
 * Returns the webpack config based on `env`.
 * @return {Object} The webpack config.
 */
function getConfig() {
    if (env === 'prod' || env === 'uat') {
        return getProdConfig();
    } else {
        return getDevConfig();
    }
}

gulp.task('clean', function(cb) {
    del('dist/**', cb);
});

gulp.task('webpack', ['clean'], function(cb) {
    compiler = webpack(getConfig());
    compiler.run(function(err) {
        if (err) throw new gutil.PluginError('webpack', err);
        cb();
    });
});

gulp.task('copy', ['clean'], function() {
    return gulp.src([
        'src/**',
        '!src/app{,/**}',
        '!src/bower_components{,/**}',
        '!src/env{,/**}'
    ]).pipe(gulp.dest('dist'));
});

gulp.task('build', ['webpack', 'copy']);
// TODO: upgrade to gulp 4.0 and remove copy and webpack deps on clean.
// ideally they'd be private functions...
// gulp.task('build', gulp.series(clean, gulp.parallel(webpack, copy)));

gulp.task('watch', ['build'], function() {
    compiler.watch(200, function(err, stats) {
        if (err) throw new gutil.PluginError('webpack', err);
        gutil.log(stats.toString({
            colors: true
        }));
    });
});