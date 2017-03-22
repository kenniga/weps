var gulp         = require('gulp');
var uglify       = require('gulp-uglify');
var rename       = require('gulp-rename');
var sass         = require('gulp-sass');
var concat       = require('gulp-concat');
var minify       = require('gulp-clean-css');
var merge        = require('merge-stream');
var autoprefixer = require('gulp-autoprefixer');
var order        = require('gulp-order');
var cssimport    = require('gulp-cssimport');


var PATHS = {
  scripts: [
    'node_modules/jquery/dist/jquery.js',
    'node_modules/jquery-slimscroll/jquery.slimscroll.js',
    'node_modules/materialize-css/dist/js/materialize.js',
    'node_modules/fullpage.js/dist/jquery.fullpage.js'
  ]
};

gulp.task('styles', function () {

  var cssExtension = gulp.src([
          'node_modules/fullpage.js/dist/jquery.fullpage.css',
        ])
        .pipe(concat('extensions.css'));

  var materializeSassStream = gulp.src(['node_modules/materialize-css/sass/materialize.scss'])
        .pipe(concat('materialize.css'))
        .pipe(sass());

  var customSassStream = gulp.src(['src/sass/main.scss'])
        .pipe(concat('custom.css'))
        .pipe(sass());

  var mergedStream = merge(materializeSassStream, customSassStream, cssExtension)
        .pipe(order(['materialize-custom.css', 'custom.css', 'extensions.css']))
        .pipe(concat('style.css'))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(rename({
          suffix: ".min",
          extname: ".css"
        }))
        .pipe(gulp.dest('dist/css/'));

  return mergedStream;
});

gulp.task('watch', function () {
    gulp.watch('src/sass/**/*.scss', function() {
        gulp.run('styles');
    });
});

gulp.task('scripts', function () {
  return gulp.src(PATHS.scripts)
          .pipe(concat('script.js'))
          .pipe(gulp.dest('dist/js/'));
});

gulp.task('default', ['styles', 'scripts', 'watch']);
