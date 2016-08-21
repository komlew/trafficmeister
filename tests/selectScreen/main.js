/* global jQuery, describe, it, expect, spyOn */

require.config({
    paths: {
        template: 'scripts/templates/selectScreen',
        trafficMeister: '../service/index',

        collections: 'scripts/modules/selectScreen/collections',
        models: 'scripts/modules/selectScreen/models',
        views: 'scripts/modules/selectScreen/views',
        app: 'scripts/modules/selectScreen'
    },
    shim: {
        trafficMeister: {
            exports: 'trafficMeister'
        }
    }
});

// polyfill for missing Number.isInteger method in PhantomJS
Number.isInteger = Number.isInteger || function (value) {
    return typeof value === 'number' && isFinite(value) &&
        Math.floor(value) === value;
};

define(['app/app', 'jquery', 'template'], function (App, $) {
    'use strict';

    describe('Dependencies', function () {
        it('are defined', function () {
            expect(window).toBeDefined();
            expect(_).toBeDefined();
            expect(App).toBeDefined();
            expect(Backbone).toBeDefined();
            expect($).toBeDefined();
            expect(_).toBeDefined();
            expect(Marionette).toBeDefined();
        });
    });

    describe('App', function () {
        var section = document.createElement('section');
        section.setAttribute('id', 'app');
        document.body.appendChild(section);

        var app = App.initialize();

        it('initializes', function () {
            expect(document.querySelector('#app')).not.toBeNull();
            expect(app.layout).toBeDefined();
            expect(app.layout.length).toBeGreaterThan(0);
        });

        it('layout has more then one region', function () {
            expect(document.querySelector('#header')).not.toBeNull();
            expect(document.querySelector('#controls')).not.toBeNull();
            expect(document.querySelector('#list')).not.toBeNull();
            expect(app.layout.length).toBeGreaterThan(1);
        });
    });

});
