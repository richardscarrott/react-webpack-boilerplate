'use strict';

// TODO: work out how we can make enhanced-require not synchronous as loading... is always
// rendered when it hits require.ensure()...
// TODO: Try actually building for node and run that...but not sure how that would export the html...
// TODO: Try attaching react to the root html element so the app can then manage the title..
// frozen head might be useful - https://www.npmjs.com/package/react-frozenhead

var express = require('express');
var path = require('path');
var consolidate = require('consolidate');
var handlebars = require('handlebars');
var colors = require('colors');
var stats = require('./stats.json');
var webpackConfig = require('../../webpack.config');
var webpack = require('webpack');
var myRequire = require('enhanced-require')(module, {
    recursive: true,
    module: webpackConfig.module,
    resolve: webpackConfig.resolve,
    // This doesn't work - https://github.com/webpack/enhanced-require/issues/9
    // Currently using React and React Router from npm...
    // Try this - https://github.com/lpiepiora/bower-webpack-plugin
    plugins: [
        new webpack.ResolverPlugin(
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('bower.json', ['main'])
        )
    ]
});

var app = myRequire('app');

// console.log('one');
// myRequire.ensure([], function() {
//     app = myRequire('app');
//     console.log('two');
// });
// console.log('three');

var server = express();

server.engine('html', consolidate.handlebars);
server.set('view engine', 'html');
server.set('views', path.join(__dirname, './views'));
server.set('port', process.env.PORT || 6060);
server.disable('x-powered-by');

server.use(express.static(path.join(__dirname, '../www')));

server.use(function(req, res) {

    var assets = stats.assetsByChunkName,
        // TODO: share router config with server and app to allow default route to
        // be determined here.
        route = req.url.replace(/\//g, '') || 'foo',
        entry = assets.main,
        chunk = assets[route],
        html;

    html = app.start(req.url, function(html) {
        res.render('index', {
            content: html,
            js: {
                entry: entry[0],
                chunk: chunk && chunk[0]
            }
        });
    });
});

server.listen(server.get('port'), function() {
    console.log('Server started: '.cyan + 'http://localhost:' + server.get('port'));
    console.log('Press \'ctrl + c\' to terminate server'.grey);
});