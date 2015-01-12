// Async proxy mixin to support webpack code splitting.
// https://github.com/rackt/react-router/blob/master/examples/partial-app-loading/app.js
var AsyncMixin = {

    // componentDidMount isn't called when renderingToString as it's queued
    // async however forceUpdate throws an error when run in componentWillMount
    // 
    // ReferenceError: document is not defined
    // at getActiveElement (/Users/Rich/Pro... (length: 2384) /Users/Rich/Projects/react-webpack-boilerplate/node_modules/express/lib/application.js:570
    // https://github.com/facebook/react/issues/1866
    componentWillMount: function() {
        debugger;
        // this.load();
    },

    getInitialState: function() {
        this.load();
        return {};
    },

    load: function() {
        if (this.constructor.loadedComponent) {
            return;
        }
        this.bundle(function(component) {
            this.constructor.loadedComponent = component;
            this.forceUpdate();
        }.bind(this));
    },

    render: function() {
        debugger;
        var Component = this.constructor.loadedComponent;
        if (Component) {
            return <Component />;
        } else {
            return this.preRender();
        }
    },

    preRender: function() {
        return <div>Loading...</div>;
    }

};

module.exports = AsyncMixin;