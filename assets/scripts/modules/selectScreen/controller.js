define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'bootbox',
    'is',
    'dsf',
    'trafficMeister',
    'models/appModel',
    'views/loading',
    'views/general',
    'views/controls',
    'views/list'
], function ($, _, Backbone, Marionette, bootbox, is, dsf, trafficMeister,
            MainModel, LoadingView, GeneralView, ControlsView, ListView) {
    'use strict';

    return Marionette.Object.extend({
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
            this.model.get('collection').off('reset').on('reset', function () {
                self.model.setFilters();
                self.renderControls();
                self.renderList();
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
                collection.reset(data).sort();
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
                    var retryText = ('Oops! Our server returns: {err}.<br>' +
                            'We\'re doing our best to fix this. ' +
                            'Would you like to retry?').dsf({
                        err: err
                    });
                    bootbox.confirm(retryText, function (retry) {
                        if (retry) {
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
                model: this.model,
                filters: self.getFilters()
            }).on('rerender', function () {
                self.renderControls();
                self.renderList();
            });
            this.options.layout.get('controls').show(Controls);
        },

        getFilters: function () {
            var filters = this.model.get('order').map(function (item) {
                if (!is.array(item.options) || !is.string(item.value)) {
                    return;
                }
                return [item.name, item.value];
            });
            return _.chain(filters).compact().zipObject().value();
        },

        renderList: function () {
            var self = this;
            var filters = this.getFilters();
            var List = new ListView({
                arrayFilters: {}
            }).on('pickItem', function (filters) {
                var order = self.model.get('order').map(function (item) {
                    item.value = filters[item.name];
                    if (!is.set(item.value)) {
                        delete item.value;
                    }
                });
                self.model.setFilters();
                self.renderControls();
                self.renderList();
            });

            if (is.empty(filters)) {
                List.collection = this.model.get('collection');
            } else {
                var items = this.model.get('order');
                var collection = this.model.get('collection').toJSON();
                _.forOwn(filters, function (value, key) {
                    var filter = _.zipObject([key], [value]);
                    if (_.findWhere(items, {name: key}).format === 'string') {
                        collection = _.where(collection, filter);
                    } else {
                        List.options.arrayFilters[key] = value;
                        collection = _.filter(collection, function (item) {
                            return _.includes(item[key], value);
                        });
                    }
                });
                List.collection = new Backbone.Collection(collection);
            }
            this.options.layout.get('list').show(List);
        }
    });
});
