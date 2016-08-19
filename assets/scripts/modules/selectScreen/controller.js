define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'bootbox',
    'dsf',
    'trafficMeister',
    'models/appModel',
    'views/loading',
    'views/general',
    'views/controls'
], function ($, _, Backbone, Marionette, bootbox, dsf, trafficMeister,
            MainModel, LoadingView, GeneralView, ControlsView) {
    'use strict';

    var Controller = Marionette.Object.extend({

        initialize: function () {
            this.spinner({
                label: 'Fetching data...'
            });
        },

        default: function () {
            var self = this;

            this.addingRegions = $.Deferred();
            this.getServerData = $.Deferred();
            this.appRendering();
            this.fetchingData();

            this.model = new MainModel();
            this.model.get('collection').on('sort', function () {
                self.model.setFilters();
                self.renderControls();
            });

            $.when(this.addingRegions).done(function (regions) {
                if (!Number.isInteger(regions) || regions <= 1) {
                    self.spinner({
                        classList: 'fa fa-exclamation-triangle fa-2x',
                        label: 'Can\'t load interface, please try again later.'
                    });
                    return;
                }
                self.spinner({
                    label: 'Fetching data...'
                }, 'controls');
                self.spinner({
                    label: 'Fetching data...'
                }, 'list');
            });

            $.when(this.addingRegions, this.getServerData).done(function (regions, data) {
                var collection = self.model.get('collection');
                collection.set(data).sort();
            });
        },

        spinner: function (options, region) {
            options = options || {};
            region = region || 'app';

            var Loading = new LoadingView(options);
            this.options.layout.get(region).show(Loading);
        },

        appRendering: function () {
            var GeneralLayout = new GeneralView();
            this.options.layout.get('app').show(GeneralLayout);

            this.options.layout.addRegions({
                header: '#header',
                controls: '#controls',
                list: '#list'
            });
            this.addingRegions.resolve(this.options.layout.length);
        },

        fetchingData: function () {
            var self = this;
            trafficMeister.fetchData(function (err, data) {
                if (err) {
                    var retryText = ('Oops! Our server says: {err}.<br>' +
                            'We\'re doing our best to fix this. ' +
                            'Would you like to retry?').dsf({
                        err: err
                    });
                    bootbox.confirm(retryText, function (result) {
                        if (result) {
                            self.fetchingData();
                        }
                    });
                } else {
                    self.getServerData.resolve(data);
                }
            });
        },

        renderControls: function () {
            var self = this;

            var Controls = new ControlsView({
                model: this.model
            }).on('rerender', function () {
                self.renderControls();
            });
            this.options.layout.get('controls').show(Controls);
        }
    });

    return Controller;
});
