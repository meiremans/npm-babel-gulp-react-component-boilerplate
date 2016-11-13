var gulp = require('gulp');
var plug = require('gulp-load-plugins')({lazy: true});

var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var del = require('del');
var sass = require('gulp-sass');

gulp.task('build', ['sass'], function () {
    return browserify({
        extensions: ['.jsx', '.js'],
        entries: './src/app.jsx',
    })
        .transform(babelify.configure({ignore: /(node_modules)/}))
        .bundle()
        .on("error", function (err) {
            console.log("Error : " + err.message);
        })
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(plug.uglify())
        .pipe(gulp.dest('./dist/'));
});

gulp.task('clean', function () {
    return del('dist/**', {force: true});
});

gulp.task('copy-files', ['clean'], function () {
    return gulp.src(['./src/index.html', './favicon.ico'])
        .pipe(gulp.dest('./dist/'));
});

gulp.task('copy-images', ['copy-files'], function () {
    return gulp.src(['./src/img/**/*'])
        .pipe(gulp.dest('./dist/img'));
});
gulp.task('sass', ['copy-images'], function () {
    return gulp.src('./src/css/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./dist/css'));
});