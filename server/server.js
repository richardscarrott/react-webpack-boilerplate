'use strict';

var express = require('express');
var path = require('path');
var consolidate = require('consolidate');
var handlebars = require('handlebars');
var colors = require('colors');
var stats = require('../dist/stats.json');

var server = express();

server.engine('html', consolidate.handlebars);
server.set('view engine', 'html');
server.set('views', path.join(__dirname, './views'));
server.set('port', process.env.PORT || 6060);
server.disable('x-powered-by');

server.use(express.static(path.join(__dirname, '../dist')));

server.use(function(req, res) {
    var assets = stats.assetsByChunkName,
        // TODO: share router config with server and app to allow default route to
        // be determined here.
        route = req.url.replace(/\//g, '') || 'foo',
        entry = assets.main,
        chunk = assets[route];

    res.render('index', {
        js: {
            entry: Array.isArray(entry) ? entry[0] : entry,
            chunk: Array.isArray(chunk) ? chunk[0] : chunk
        }
    });
});

server.listen(server.get('port'), function() {
    console.log('Server started: '.cyan + 'http://localhost:' + server.get('port'));
    console.log('Press \'ctrl + c\' to terminate server'.grey);
});