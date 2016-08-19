define([
    'marionette',
    'template'
], function (Marionette) {
    'use strict';

    var LoadingView = Marionette.ItemView.extend({
        template: 'selectScreen/loading',
        className: 'mainView__spinner',
        templateHelpers: function () {
            var classList = this.options.classList || 'fa fa-spinner fa-spin fa-2x';
            var label = this.options.label || 'Loading...';
            return {
                classList: classList,
                label: label
            };
        }
    });

    return LoadingView;
});
