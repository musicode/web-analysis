var gulp = require('gulp');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

gulp.task('concat', function () {

    gulp.src([
            './src/util.js',
            './src/core.js',
            './src/plugins/click.js'
        ])
        .pipe(uglify())
        .pipe(concat('wat.min.js'))
        .pipe(gulp.dest('./output'));

});

gulp.task('default', ['concat']);