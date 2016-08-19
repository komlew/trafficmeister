define([
    'marionette',
    'app/controller'
], function (Marionette, AppController) {
    'use strict';

    var Router = Marionette.AppRouter.extend({
        appRoutes: {
            '': 'default'
        }
    });

    return Router;
});
