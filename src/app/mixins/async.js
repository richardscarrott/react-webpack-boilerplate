// Async proxy mixin to support webpack code splitting.
// https://github.com/rackt/react-router/blob/master/examples/partial-app-loading/app.js
var AsyncMixin = {

    componentDidMount: function() {
        this.load();
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