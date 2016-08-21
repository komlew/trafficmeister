define([
    'marionette',
    'is',
    'underscore'
], function (Marionette, is, _) {
    'use strict';

    return Marionette.ItemView.extend({
        template: 'selectScreen/listItem',
        className: 'col-sm-6 col-md-4',

        ui: {
            pickType: '@pickType',
            pickBrand: '@pickBrand',
            pickColor: '@pickColor'
        },

        events: {
            'click @ui.pickType': 'onPickType',
            'click @ui.pickBrand': 'onPickBrand',
            'click @ui.pickColor': 'onPickColor'
        },

        templateHelpers: function () {
            return {
                arrayFilters: this.options.arrayFilters
            };
        },

        onPickType: function () {
            this.trigger('pickItem', {
                type: this.model.get('type')
            });
        },

        onPickBrand: function () {
            this.trigger('pickItem', {
                type: this.model.get('type'),
                brand: this.model.get('brand')
            });
        },

        onPickColor: function (e) {
            var color = this.options.arrayFilters.color || e.target.getAttribute('data-color');
            if (!_.includes(this.model.get('colors'), color)) {
                return;
            }
            this.trigger('pickItem', {
                type: this.model.get('type'),
                brand: this.model.get('brand'),
                colors: color
            });
        }
    });
});
