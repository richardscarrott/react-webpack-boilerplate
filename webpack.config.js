var path = require('path');
var webpack = require('webpack');
var StatsPlugin = require('stats-webpack-plugin');

module.exports = {
    entry: 'app.js',
    output: {
        path: path.join(__dirname, 'dist/www'),
        filename: '[chunkhash].entry.js',
        chunkFilename: '[chunkhash].[name].js'
    },
    module: {
        noParse: /bower_components/,
        loaders: [
            { test: /\.js$/, loader: 'jsx-loader?harmony' },
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            { test: /\.(png|jpg|gif)$/, loader: 'url-loader?limit=8192' }
        ]
    },
    resolve: {
        root: [
            path.join(__dirname, 'www/bower_components'),
            path.join(__dirname, 'www/app'),
            path.join(__dirname, 'www/assets')
        ]
    },
    plugins: [
        new webpack.ResolverPlugin(
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('bower.json', ['main'])
        ),
        new StatsPlugin(path.join(__dirname, 'dist/server', 'stats.json'), {
            chunkModules: true
        })
    ]
};