/* global jQuery, describe, it, expect, beforeEach, beforeAll, afterEach, afterAll, jasmine, spyOn */

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

define(['app/app', 'template'], function (App) {
    'use strict';

    // keep these variable visible to all tests
    var app;
    var router;
    var controller;

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

        app = App.initialize();
        router = app.router;
        controller = app.router.options.controller;

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

    describe('Router', function () {
        it('works by default', function () {
            expect(window.location.hash).toBe('');
            expect(app.layout).toBeDefined();
            expect(app.layout.length).toBeGreaterThan(1);
        });

        it('default action creates DOM elements', function () {
            expect(document.querySelector('#app').firstChild.tagName.toLowerCase()).toBe('div');
            expect(document.querySelector('.header__logo').tagName.toLowerCase()).toBe('img');
        });

        it('works with different hash', function () {
            window.location.hash = 'anything';
            expect(window.location.hash).toBe('#anything');
            expect(app.layout).toBeDefined();
            expect(app.layout.length).toBeGreaterThan(1);
        });

        it('another action creates DOM elements', function () {
            router.navigate('anything/else/', {trigger: true});
            expect(window.location.hash).toBe('#anything/else/');
            expect(document.querySelector('#app').firstChild.tagName.toLowerCase()).toBe('div');
            expect(document.querySelector('.header__logo').tagName.toLowerCase()).toBe('img');
        });
    });

    describe('Controller', function () {
        beforeAll(function() {
            spyOn(controller, 'default');
        });

        it('is called on router navigation', function () {
            router.navigate('', {trigger: true});
            setTimeout(function() {
                expect(controller.default).toHaveBeenCalled();
            }, 1);
        });

        it('has model with collection and order array', function () {
            expect(controller.model).toBeDefined();
            expect(controller.model.attributes).toBeDefined();
            expect(controller.model.get('collection')).toBeDefined();
            expect(controller.model.get('order')).toBeDefined();
        });

        it('resolve promiss and update model', function () {
            controller.default();
            expect(controller.getServerData.state()).toBe('pending');
            expect(controller.model.get('collection').length).toBe(0);
            controller.getServerData.resolve([{
                id: 1,
                type: 'car',
                brand: 'Bugatti Veyron',
                colors: ['red', 'black'],
                img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Bugatti_Veyron_16.4_%E2%80%93_Frontansicht_%281%29%2C_5._April_2012%2C_D%C3%BCsseldorf.jpg/520px-Bugatti_Veyron_16.4_%E2%80%93_Frontansicht_%281%29%2C_5._April_2012%2C_D%C3%BCsseldorf.jpg'
            }, {
                id: 2,
                type: 'airplane',
                brand: 'Boeing 787 Dreamliner',
                colors: ['red', 'white', 'black', 'green'],
                img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/All_Nippon_Airways_Boeing_787-8_Dreamliner_JA801A_OKJ_in_flight.jpg/600px-All_Nippon_Airways_Boeing_787-8_Dreamliner_JA801A_OKJ_in_flight.jpg'
            }]);
            expect(controller.getServerData.state()).toBe('resolved');
            expect(controller.model.get('collection').length).toBe(2);
            expect(controller.model.get('collection').findWhere({id: 1}).get('type')).toBe('car');
        });
    });
});
