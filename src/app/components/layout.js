var React = require('react');
var Router = require('react-router');
var {RouteHandler, Link} = Router;

require('./layout.css');

var Layout = React.createClass({
    render: function() {
        return (
            <div>
                <Link to="foo">Foo</Link>
                &nbsp;
                <Link to="bar">Bar</Link>
                <RouteHandler />
            </div>
        );
    }
});

module.exports = Layout;
