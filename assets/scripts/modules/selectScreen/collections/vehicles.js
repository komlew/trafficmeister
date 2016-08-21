define([
    'backbone',
    'models/vehicle'
], function (Backbone, VehicleModel) {
    'use strict';

    return Backbone.Collection.extend({
        model: VehicleModel,
        comparator: 'brand'
    });
});
