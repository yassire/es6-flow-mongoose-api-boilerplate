const gulp = require('gulp');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const flow = require('gulp-flowtype');
const del = require('del');
const runSequence = require('run-sequence');
const gulpLoadPlugins = require('gulp-load-plugins');
const path = require('path');

const plugins = gulpLoadPlugins();

const paths = {
  js: ['src/**/*.js', '!build/**', '!node_modules/**'],
  nonJs: ['./package.json', './.gitignore', './.env'],
};

// Clean up build directory
gulp.task('clean', () =>
  del.sync(['build/**', 'build/.*', '!build']));

// Copy non-js files to build
gulp.task('copy', () =>
  gulp.src(paths.nonJs)
    .pipe(plugins.newer('build'))
    .pipe(gulp.dest('build')));

gulp.task('babel', () => gulp.src('src/**/*.js')
  .pipe(sourcemaps.init())
  .pipe(babel())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('build')));

gulp.task('flow', () => gulp.src('src/**/*.js')
  .pipe(flow({
    killFlow: false,
    declarations: './flow-typed',
  })));

// Start server with restart on file changes
gulp.task('nodemon', ['flow', 'copy', 'babel'], () =>
  plugins.nodemon({
    script: path.join('build', 'index.js'),
    ext: 'js',
    ignore: ['node_modules/**/*.js', 'build/**/*.js'],
    tasks: ['copy', 'babel'],
  }));

// gulp serve for development
gulp.task('serve', ['clean'], () => runSequence('nodemon'));

// default task: clean dist, compile js files and copy non-js files.
gulp.task('default', ['clean'], () => {
  runSequence(['flow', 'copy', 'babel']);
});

