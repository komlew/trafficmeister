define([
    'marionette',
    'is',
    'underscore',
    'select2'
], function (Marionette, is, _) {
    'use strict';

    var ControlsView = Marionette.ItemView.extend({
        template: 'selectScreen/controls',

        ui: {
            select2: '@select2'
        },

        events: {
            'change @ui.select2': 'onSelectChange'
        },

        initialize: function () {

        },

        onRender: function () {
            this.ui.select2.select2({width: '100%'});
        },

        onSelectChange: function (e) {
            var target = $(e.target);
            var name = target.attr('name');

            var items = _.clone(this.model.get('order'));
            var item = _.findWhere(items, {name: name});
            if (!is.set(item)) {
                return;
            }
            item.value = target.val();
            this.model.set('order', items);

            this.model.setFilters();
            this.trigger('rerender');
        }
    });

    return ControlsView;
});
