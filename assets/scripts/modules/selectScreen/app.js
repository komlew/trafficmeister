define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'app/router',
    'app/controller'
], function ($, _, Backbone, Marionette, AppRouter, AppController) {
    'use strict';

    Marionette.Region.prototype.attachHtml = function (view) {
        this.$el.html(view.el);
    };

    Backbone.Marionette.Renderer.render = function (template, data) {
        function ref(obj, str) {
            return str.split('/').reduce(function (o, x) {
                return o[x];
            }, obj);
        }
        if (!ref(JADE, template)) {
            throw 'Template "' + template + '" not found!';
        }
        return ref(JADE, template)(data);
    };

    var initialize = function () {
        var app = new Backbone.Marionette.Application();

        app.layout = new Marionette.RegionManager({
            regions: {
                app: '#app'
            }
        });

        app.on('start', function () {
            app.router = new AppRouter({
                controller: new AppController({
                    layout: app.layout
                })
            });

            Backbone.history.start();
        });

        app.start();

        return app;
    };

    return {
        initialize: initialize
    };
});
