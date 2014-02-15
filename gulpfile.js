var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

var paths = {
    libraries: ['js/src/libraries/*.js'],
    src: ['js/src/logic/*.js']
}


gulp.task('libraries', function(){
    return gulp.src(paths.libraries)
        .pipe(concat('libraries.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('js/build'));
});

gulp.task('logic', function(){
    return gulp.src(paths.src)
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('js/build'));
});

gulp.task('watch', function(){
    gulp.watch(paths.libraries, ['libraries']);
    gulp.watch(paths.src, ['logic']);
});

gulp.task('default', ['watch']);