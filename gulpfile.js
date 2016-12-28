var del = require('del');
var path = require('path');
var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var loadPlugins = require('gulp-load-plugins');
var isparta = require('isparta');

// Load all of our Gulp plugins
var $ = loadPlugins();

global.env  = process.env.NODE_ENV  || 'development';

function _registerBabel() {
  require('babel-core/register');
}

function lint(files) {
  return gulp.src(files)
    .pipe($.plumber())
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.eslint.failOnError());
}

function test() {
  return gulp.src(['./tests/**/*.spec.js'], {read: false})
    .pipe($.mocha({
      reporter: process.env.MOCHA_REPORTER || 'nyan',
      globals: ["sinon", "chai", "expect"],
      require: ['./tests/test-helper.js']
    }));
}

// Clean up
gulp.task('clean', function(){
  del.sync(['./dist','./dist.zip']);
});

// Lint our source code
gulp.task('lint-src', function() {
  lint(['src/**/*.js']);
});

// Lint our test code
gulp.task('lint-test', function() {
  lint(['tests/**/*.js']);
});

// Lint Source and test
gulp.task('lint', ['lint-src', 'lint-test']);

// Run tests
gulp.task('test', ['lint', 'clean'], function() {
  _registerBabel();
  return test();
});

// Build Source
gulp.task('build', ['clean'], function () {
  return gulp.src("src/**/*.js")
    .pipe($.if(env === 'development', $.sourcemaps.init()))
    .pipe($.babel())
    .pipe($.if(env === 'development', $.sourcemaps.write(".")))
    .pipe(gulp.dest("dist"));
});

// Watch files
gulp.task('watch', ['test', 'build'], function() {
  nodemon({
    script: './dist/index.js',
    ext: 'js',
    ignore: ["dist/*"],
    tasks: ['test', 'build'],
    env: { 'NODE_ENV': 'development'}
  });
});

gulp.task('test-coverage', function () {
  _registerBabel();

  return gulp.src(['src/**/*.js'])
    .pipe($.istanbul({ // Covering filecs
          instrumenter: isparta.Instrumenter,
          includeUntested: true }))
    .pipe($.istanbul.hookRequire()) // Force `require` to return covered files
    .on('finish', () => {
      gulp.src(['./tests/**/*.spec.js'], {read: false})
        .pipe($.mocha({
              reporter: 'spec',
              globals: ["sinon", "chai", "expect"],
              require: ['./tests/test-helper.js'] }))
        .pipe($.istanbul.writeReports());
    });
});

gulp.task('default', ['watch']);
