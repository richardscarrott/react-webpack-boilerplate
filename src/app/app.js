var React = require('react');
var Router = require('react-router');
var {Route, DefaultRoute, NotFoundRoute, RouteHandler} = Router;
var AsyncMixin = require('mixins/async');
var LayoutComponent = require('components/layout');
var four04Component = require('components/404');
var Modernizr = require('modernizr/modernizr');

if (ENV.debug) {
    alert('Hello world.');
}

if (Modernizr.csstransforms3d) {
    alert('Browser supports 3d transformations');
}

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

Router.run(routes, Router.HistoryLocation, function(Handler) {
    React.render(<Handler />, document.getElementById('main'));
});
