define([
    'marionette'
], function (Marionette) {
    'use strict';

    var GeneralLayoutView = Marionette.ItemView.extend({
        template: 'selectScreen/general',

        templateHelpers: function () {

        }
    });

    return GeneralLayoutView;
});
