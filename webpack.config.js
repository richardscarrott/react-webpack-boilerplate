var path = require('path');
var webpack = require('webpack');
var StatsPlugin = require('stats-webpack-plugin');

module.exports = {
    entry: 'app.js',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[chunkhash].entry.js',
        chunkFilename: '[chunkhash].[name].js'
    },
    module: {
        loaders: [
            { test: /\.js$/, loader: 'jsx-loader?harmony' },
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            { test: /\.(png|jpg|gif)$/, loader: 'url-loader?limit=8192' },
            { test: /react\.js$/, loader: 'expose?React' }
        ]
    },
    resolve: {
        root: [
            path.join(__dirname, 'src/bower_components'),
            path.join(__dirname, 'src/app'),
            path.join(__dirname, 'src/assets')
        ]
    },
    plugins: [
        new webpack.ResolverPlugin(
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('bower.json', ['main'])
        ),
        new StatsPlugin(path.join(__dirname, 'dist', 'stats.json'), {
            chunkModules: true
        })
    ]
};