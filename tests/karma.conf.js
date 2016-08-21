/* global module */

module.exports = function (config) {
    config.set({
        basePath: '../',
        frameworks: ['jasmine', 'requirejs', 'sinon'],
        files: [
            'tests/karma.js',
            {pattern: 'assets/deps/**/*.js', included: false},
            {pattern: 'assets/scripts/**/*.js', included: false},
            {pattern: 'service/**/*.js', included: false},
            {pattern: 'tests/**/*.js', included: false}
        ],
        exclude: [],
        preprocessors: {},
        reporters: ['dots'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['PhantomJS'],
        singleRun: false,
        concurrency: Infinity
    });
};
