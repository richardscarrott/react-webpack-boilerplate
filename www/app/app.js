// Expose React on window for react-router.
var isBrowser = typeof window !== 'undefined';
var _global = isBrowser ? window : global;
var React = _global.React = require('react');
var Router = require('react-router');
var {Route, DefaultRoute, NotFoundRoute, RouteHandler} = Router;
var AsyncMixin = require('mixins/async');
var LayoutComponent = require('components/layout');
var four04Component = require('components/404');

// react-router makes code splitting pretty ugly...
var preFooComponent = React.createClass({
    mixins: [AsyncMixin],
    bundle: require('bundle?lazy&name=foo!components/foo')
});

var preBarComponent = React.createClass({
    mixins: [AsyncMixin],
    bundle: require('bundle?lazy&name=bar!components/bar')
});

var routes = (
    <Route name="home" path="/" handler={LayoutComponent}>
        <Route name="foo" handler={preFooComponent} />
        <Route name="bar" handler={preBarComponent} />
        <DefaultRoute handler={preFooComponent} />
        <NotFoundRoute handler={four04Component} />
    </Route>
);

if (isBrowser) {
    Router.run(routes, Router.HistoryLocation, function(Handler) {
        React.render(<Handler />, document.getElementById('main'));
    });
} else {
    module.exports = {
        start: function(route, cb) {
            Router.run(routes, route, function(Handler) {
                var html = React.renderToString(<Handler />);
                cb(html);
            });
        }
    };
}