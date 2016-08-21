define([
    'marionette',
    'is',
    'underscore',
    'dsf',
    'bootbox',
    'select2'
], function (Marionette, is, _, dsf, bootbox) {
    'use strict';

    return Marionette.ItemView.extend({
        template: 'selectScreen/controls',

        ui: {
            select2: '@select2',
            clearFilters: '@clearFilters',
            result: '@result'
        },

        events: {
            'change @ui.select2': 'onSelectChange',
            'click @ui.clearFilters': 'onClearFilters'
        },

        onRender: function () {
            this.ui.select2.select2({width: '100%'});
            var result = 'Everything';
            if (is.string(this.options.filters.type) && !is.string(this.options.filters.brand)) {
                result = 'All {type}s'.dsf({
                    type: this.options.filters.type
                });
            } else if (is.string(this.options.filters.brand) && !is.string(this.options.filters.colors)) {
                result = this.options.filters.brand;
            } else if (is.string(this.options.filters.brand) && is.string(this.options.filters.colors)) {
                result = '{color} {brand}'.dsf({
                    color: this.options.filters.colors.charAt(0).toUpperCase() +
                        this.options.filters.colors.substr(1),
                    brand: this.options.filters.brand
                });
            }
            this.ui.result.text(result);
        },

        onSelectChange: function (e) {
            var target = $(e.target);
            var name = target.attr('name');
            var value = target.val();

            var items = _.clone(this.model.get('order'));
            var item = _.findWhere(items, {name: name});
            if (!is.set(item)) {
                return;
            }
            if (!is.empty(value)) {
                item.value = value;
            } else {
                delete item.value;
            }
            this.model.set('order', items);

            this.model.setFilters(name);
            this.trigger('rerender');
        },

        onClearFilters: function () {
            var self = this;
            bootbox.confirm('Are you sure you want to reset all filters?', function (reset) {
                if (reset) {
                    self.model.get('order').map(function (item) {
                        delete item.options;
                        delete item.value;
                    });
                    self.model.setFilters(self.model.get('order')[0].name);
                    self.trigger('rerender');
                }
            });
        }
    });
});
