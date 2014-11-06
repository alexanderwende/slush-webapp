var gulp        = require('gulp'),
    fs          = require('fs'),
    del         = require('del'),
    less        = require('gulp-less'),
    concat      = require('gulp-concat'),
    builder     = require('systemjs-builder'),
    sourcemaps  = require('gulp-sourcemaps'),
    htmlreplace = require('gulp-html-replace'),
    mocha       = require('gulp-mocha');
    baseURL     = './src/',
    distURL     = './dist/',
    testURL     = './test/';

builder.config({
    baseURL: baseURL + 'js'
});

gulp.task('clean', function (done) {
    del(distURL, done);
});

gulp.task('copy', ['clean'], function () {
    return gulp.src(baseURL + 'index.html')
        .pipe(htmlreplace({ remove: '', js: ['js/system.js', 'js/app.js'], css: 'css/app.css' }))
        .pipe(gulp.dest(distURL));
});

gulp.task('less', ['clean'], function () {
    return gulp.src(baseURL + 'less/**/*.less', {base: baseURL + 'less/'})
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(distURL + 'css'));
});

gulp.task('concat', ['clean'], function () {
    return gulp.src([
        './bower_components/traceur-runtime/traceur-runtime.min.js',
        './bower_components/es6-module-loader/dist/es6-module-loader.js',
        './bower_components/system.js/dist/system.js'
        ])
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(concat('system.js'))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(distURL + 'js'));
});

gulp.task('build-init', ['clean'], function (done) {
    // systemjs-builder crashes, when build directory does not exist yet
    // so we will create it if needed
    fs.mkdir(distURL, function (error) {
        if (error && error.code !== 'EEXIST') return done(error);
        fs.mkdir(distURL + 'js', function (error) {
            if (error && error.code !== 'EEXIST') return done(error);
            done();
        });
    });
});

gulp.task('build', ['build-init'], function () {
    return builder.build('app', null, distURL + 'js/app.js');
});

gulp.task('default', ['clean', 'copy', 'less', 'concat', 'build']);

gulp.task('watch', function () {

    var jsWatcher = gulp.watch(baseURL + 'js/**/*.js', ['default']);
    jsWatcher.on('change', function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running build...');
    });

    var lessWatcher = gulp.watch(baseURL + 'less/**/*.less', ['default']);
    lessWatcher.on('change', function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running build...');
    });
});

gulp.task('test', function () {
    return gulp.src(testURL + '**/*.js', {read: false})
        .pipe(mocha({
            reporter: 'spec'
        }));
});
