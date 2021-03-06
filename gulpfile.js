
/*!
 * $ npm install
 * $ gulp
 * $ gulp watch
 */

// Load plugins
var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    del = require('del');

// Styles
gulp.task('styles', function() {
  return sass('assets/scss/stylesheet.scss', { style: 'expanded' })
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest('dist/css'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(cssnano())
    .pipe(gulp.dest('dist/css'))
    .pipe(notify({ message: 'Styles task complete' }));
});

// Scripts
gulp.task('scripts', function() {
  return gulp.src([
      'assets/js/three.min.js',
      'assets/js/orbit_controls.js',
      'assets/js/main_script.js'
    ])
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('external_scripts', function() {
  return gulp.src([
      'assets/external_js/three.min.js',
      'assets/external_js/orbit_controls.js',
      'assets/external_js/DeviceControls.js',
      'assets/external_js/stereo_effect.js'
    ])
    .pipe(concat('three_and_controls.min.js'))
    .pipe(gulp.dest('dist/ext_js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/ext_js'))
    .pipe(notify({ message: 'External Scripts task complete' }));
});

// Images
gulp.task('images', function() {
  return gulp.src('assets/textures/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/textures'))
    .pipe(notify({ message: 'Images task complete' }));
});

// Clean
gulp.task('clean', function() {
  return del(['dist/css', 'dist/ext_js', 'dist/js', 'dist/images']);
});

// Default task
gulp.task('default', ['clean'], function() {
  gulp.start('styles', 'external_scripts', 'scripts', 'images');
});

// Watch
gulp.task('watch', function() {

  // Watch .scss files
  gulp.watch('assets/scss/**/*.scss', ['styles']);

  // Watch .js files
  gulp.watch('assets/js/**/*.js', ['scripts']);

  gulp.watch('assets/external_js/**/*.js', ['external_scripts']);

  // Watch image files
  gulp.watch('assets/textures/**/*', ['images']);


});