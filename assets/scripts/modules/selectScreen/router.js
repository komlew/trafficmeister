define([
    'marionette',
    'app/controller'
], function (Marionette, AppController) {
    'use strict';

    return Marionette.AppRouter.extend({
        appRoutes: {
            '': 'default'
        }
    });
});
