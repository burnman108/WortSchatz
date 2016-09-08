﻿/// <binding BeforeBuild='default' Clean='clean' ProjectOpened='watch' />
var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var concat = require('gulp-concat');
var plumber = require('gulp-plumber');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var del = require('del');

// Compile all .less files to .css
gulp.task('less', function () {
  return gulp.src('./wwwroot/static/dev-style/*.less')
    .pipe(plumber())
    .pipe(less({
      paths: [path.join(__dirname, 'less', 'includes')]
    }))
    .pipe(gulp.dest('./wwwroot/static/dev-style/'));
});

// Delete all compiled and bundled files
gulp.task('clean', function () {
  return del(['./wwwroot/static/dev-style/*.css', './wwwroot/static/prod-style/*', './wwwroot/static/prod-js/*']);
});

// Minify and bundle JS files
gulp.task('scripts', function () {
  return gulp.src([
    './wwwroot/static/lib/history.min.js',
    './wwwroot/static/lib/jquery*.min.js',
    './wwwroot/static/dev-js/page.js',
    './wwwroot/static/dev-js/quiz.js'
  ])
    .pipe(uglify())
    .pipe(concat('app.min.js'))
    .pipe(gulp.dest('./wwwroot/static/prod-js/'));
});

// Minify and bundle CSS files
gulp.task('styles', ['less'], function () {
  return gulp.src(['./wwwroot/static/dev-style/*.css', '!./wwwroot/static/dev-style/*.min.css'])
    .pipe(minifyCSS())
    .pipe(concat('app.min.css'))
    .pipe(gulp.dest('./wwwroot/static/prod-style/'));
});

// Default task: full clean+build.
gulp.task('default', ['clean', 'scripts', 'styles'], function () { });

// Watch: recompile less on changes
gulp.task('watch', function () {
  gulp.watch(['./wwwroot/static/dev-style/*.less'], ['less']);
});
