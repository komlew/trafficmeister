/* global require, console, escape */
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var mainBowerFiles = require('main-bower-files');
var concat = require('gulp-concat');
var jade = require('gulp-jade');
var wrap = require('gulp-wrap-amd');
var declare = require('gulp-declare');
var merge = require('merge-stream');
var fs = require('fs');
var path = require('path');
// require('es6-promise').polyfill();

gulp.task('default', function () {
    // Default tasks
    gulp.start(
        'dependencies',
        'templates',
        'styles'
    );

    // Watch dependency changes
    gulp.watch(['./bower.json'],
               ['dependencies']);

    // Watch js files
    gulp.watch(['assets/scripts/**/*.js'],
               ['jshint']);

    // Watch scss stylesheets
    gulp.watch('assets/styles/**/*.scss',
               ['styles']);

    // Watch html templates
    gulp.watch('assets/templates/**/*.jade',
               ['templates']);
});

gulp.task('build', function () {
    gulp.start(
        'dependencies',
        'templates',
        'styles'
    );
});

gulp.task('dependencies', function () {
    return gulp.src(mainBowerFiles(), {base: 'bower_components'})
        .pipe(gulp.dest('./assets/deps'));
});

gulp.task('styles', function () {
    return gulp.src('assets/styles/base/*.scss')
        .pipe($.sass({
            outputStyle: 'compressed',
            precision: 10,
            includePaths: ['.'],
            onError: console.error.bind(console, 'Sass error:')
        }))
        .pipe($.postcss([
            require('autoprefixer')({
                browsers: [
                    'last 10 versions',
                    'Chrome >= 4',
                    'Firefox >= 2',
                    'Explorer >= 8'
                ]
            })
        ]))
        .pipe(gulp.dest('assets/styles/css'))
        .pipe(reload({stream: true}));
});

gulp.task('jshint', function () {
    return gulp.src(['assets/scripts/**/*.js', '!assets/scripts/templates/**/*.js'])
        .pipe(reload({stream: true, once: true}))
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

function getFolders (dir) {
    return fs.readdirSync(dir).filter(function (file) {
        return fs.statSync(path.join(dir, file)).isDirectory();
    });
}

gulp.task('templates', function () {
    var modules = getFolders('assets/templates');
    var tasks = modules.map(function (module) {
        return gulp.src('assets/templates/' + module + '/**/*')
            .pipe(jade({
                client: true
            }))
            .pipe(declare({
                namespace: 'JADE.' + module,
                noRedeclare: true,
                processName: function (filePath) {
                    return declare.processNameByPath(filePath.replace('assets/templates/' + module, ''));
                }
            }))
            .pipe(concat(module + '.js'))
            .pipe(wrap({
                deps: ['is', 'jade', 'jquery', 'underscore'],
                params: ['is', 'jade', '$', '_'],
                exports: 'this["JADE"]'
            }))
            .pipe(gulp.dest('assets/scripts/templates'));
    });
    return merge(tasks);
});
