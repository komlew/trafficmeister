define([
    'backbone'
], function (Backbone) {
    'use strict';

    return Backbone.Model.extend({
        idAttribute: 'id',
        defaults: {
            id: null,
            type: '',
            brand: '',
            colors: [],
            img: ''
        }
    });
});
