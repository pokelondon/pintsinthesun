/*
 *   Task Automation to make my life easier.
 *   Author: Jean-Pierre Sierens
 *   ===========================================================================
 */

// declarations, dependencies
// ----------------------------------------------------------------------------
var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var gutil = require('gulp-util');
var babelify = require('babelify');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var http = require('http');
var st = require('st');
var server = require('gulp-express');



// External dependencies you do not want to rebundle while developing,
// but include in your application deployment
var dependencies = [
    'D3',
    'React',
    'THREE'
];
// keep a count of the times a task refires
var scriptsCount = 0;
var subprocess;

// Gulp tasks
// ----------------------------------------------------------------------------
gulp.task('scripts', function () {
    bundleApp(false).pipe(server.notify());
});

gulp.task('deploy', function (){
    bundleApp(true);
});

gulp.task('watch', function () {
    gulp.watch(['./src/app/**/*.js'], ['scripts']);
    gulp.watch('./src/public/sass/**/*.scss', ['sass']);
});

gulp.task('sass', function () {
    return gulp.src('./src/public/sass/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(postcss([autoprefixer({browsers: ['last 2 versions']})]))
        .pipe(gulp.dest('./src/build/css'))
        .pipe(server.notify());
});


gulp.task('server', function(done) {
    var options = {
        cwd: 'src'
    }
    options.env = process.env;
    options.env.NODE_ENV = 'development';

    server.run(['server.js'], options, 35729);
});

gulp.task('default', ['scripts','watch', 'server']);


// Private Functions
// ----------------------------------------------------------------------------
function bundleApp(isProduction) {
    scriptsCount++;
    // Browserify will bundle all our js files together in to one and will let
    // us use modules in the front end.
    var appBundler = browserify({
        entries: './src/app/app.js',
        debug: true
    })

    // If it's not for production, a separate vendors.js file will be created
    // the first time gulp is run so that we don't have to rebundle things like
    // react everytime there's a change in the js file
    if (!isProduction && scriptsCount === 1){
        // create vendors.js for dev environment.
        browserify({
            require: dependencies,
            debug: true
        })
        .bundle()
        .on('error', gutil.log)
        .pipe(source('vendors.js'))
        .pipe(gulp.dest('./src/build/js/'));
    }
    if (!isProduction){
        // make the dependencies external so they dont get bundled by the
        // app bundler. Dependencies are already bundled in vendor.js for
        // development environments.
        dependencies.forEach(function(dep){
            appBundler.external(dep);
        })
    }

    return appBundler
        // transform ES6 and JSX to ES5 with babelify
        .transform("babelify", {presets: ["es2015", "react", "stage-2"]})
        .bundle()
        .on('error', gutil.log)
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('./src/build/js/'));
}
