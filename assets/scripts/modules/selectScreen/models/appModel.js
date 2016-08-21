define([
    'backbone',
    'is',
    'underscore',
    'collections/vehicles'
], function (Backbone, is, _, VehiclesList) {
    'use strict';

    return Backbone.Model.extend({
        defaults: {
            order: [{
                name: 'type',
                label: 'Type',
                format: 'string'
            }, {
                name: 'brand',
                label: 'Brand',
                format: 'string'
            }, {
                name: 'colors',
                label: 'Colors',
                format: 'array'
            }],
            collection: new VehiclesList()
        },

        getUniqueValues: function (collection, key) {
            var result = [];
            collection.forEach(function (item) {
                if (is.set(item.get(key))) {
                    result = result.concat(item.get(key));
                }
            });
            return _.chain(result).unique().sortBy().value();
        },

        setFilters: function (name) {
            var items = this.get('order');
            var getValues = this.getUniqueValues;
            var collection = this.get('collection');
            var resetAfter = _.findIndex(items, {name: name});

            items.forEach(function (item, index) {
                if (resetAfter >= 0 && index > resetAfter) {
                    delete item.options;
                    delete item.value;
                }

                var prevItem = items[index - 1];
                if (is.set(prevItem) && is.string(prevItem.value)) {
                    var filter = _.zipObject([prevItem.name], [prevItem.value]);
                    item.options = getValues(collection.where(filter), item.name);
                } else if (!is.set(prevItem)) {
                    item.options = getValues(collection, item.name);
                }
            });
        }
    });
});
