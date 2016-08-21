define([
    'marionette',
    'views/listItem',
    'is',
    'underscore',
], function (Marionette, ListItemView, is, _) {
    'use strict';

    return Marionette.CollectionView.extend({
        childView: ListItemView,
        className: 'row',
        childViewOptions: function () {
            return {
                arrayFilters: this.options.arrayFilters
            };
        },
        onChildviewPickItem: function (view, options) {
            this.trigger('pickItem', options);
        }
    });
});
