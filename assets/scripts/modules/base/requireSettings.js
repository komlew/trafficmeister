require.config({
    waitSeconds: 0,
    baseUrl: '../',
    paths: {
        backbone: 'deps/backbone/backbone',
        bootbox: 'deps/bootbox.js/bootbox',
        bootstrap: 'deps/bootstrap/dist/js/bootstrap.min',
        dsf: 'deps/DecentStringFormatter/src/dsf',
        is: 'deps/is-js/is',
        jade: 'deps/jade/runtime',
        jquery: 'deps/jquery/dist/jquery.min',
        jqueryRole: 'deps/role/lib/jquery.role.min',
        lodash: 'deps/lodash/lodash.min',
        marionette: 'deps/marionette/lib/backbone.marionette.min',
        moment: 'deps/moment/min/moment.min',
        select2: 'deps/select2/dist/js/select2.full.min'
    },
    shim: {
        backbone: {
            deps: ['underscore'],
            exports: 'Backbone'
        },
        bootbox: {
            deps: ['bootstrap'],
            exports: 'bootbox'
        },
        bootstrap: {
            deps: ['jquery']
        },
        jquery: {
            exports: '$'
        },
        jqueryRole: {
            deps: ['jquery']
        },
        marionette: {
            deps: ['backbone', 'jqueryRole'],
            exports: 'Marionette'
        },
        select2: {
            deps: ['jquery']
        }
    },
    map: {
        '*': {
            underscore: 'lodash'
        }
    }
});
