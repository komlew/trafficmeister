define([
    'backbone',
    'is',
    'collections/vehicles'
], function (Backbone, is, VehiclesList) {
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

        setFilters: function () {
            var self = this;
            var edge;
            var collection = this.get('collection').where({visible: true});
            this.get('order').forEach(function (item) {
                if (edge) {
                    delete item.options;
                    delete item.value;
                    return;
                }
                if (!is.set(item.value) || is.empty(item.value)) {
                    item.options = self.getUniqueValues(collection, item.name);
                    edge = true;
                }
            });
        }
    });

});
