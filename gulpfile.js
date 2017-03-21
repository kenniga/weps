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
    'node_modules/materialize-css/dist/js/materialize.js'
  ]
};

gulp.task('styles', function () {

  // var gridSassStream = gulp.src(['src/libs/simple-grid/grid/simple-grid.scss'])
  //       .pipe(concat('simple-grid-custom.css'))
  //       .pipe(sass());

  var materializeSassStream = gulp.src(['node_modules/materialize-css/sass/materialize.scss'])
        .pipe(concat('materialize.css'))
        .pipe(sass());

  var customSassStream = gulp.src(['src/sass/main.scss'])
        .pipe(concat('custom.css'))
        .pipe(sass());

  var mergedStream = merge(materializeSassStream, customSassStream)
        .pipe(order(['materialize-custom.css', 'custom.css']))
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
