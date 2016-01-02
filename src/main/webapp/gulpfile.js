var gulp = require('gulp');
var gulpUtil = require('gulp-util');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var browserSync = require('browser-sync').create();

browserSync.emitter.on("init", function() {
    console.log('BrowserSync is running');
});


gulp.task('browserify', function() {
    gulpUtil.log("browserify executed");
    browserify('js/index.js')
        .transform(babelify, {presets: ["es2015", "react"]})
        .bundle()
        .on('error', function (err) {
            gulpUtil.log(err)
        })
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('./build'))
        .pipe(browserSync.reload({stream: true}));
});


gulp.task('html', function() {
    gulp.src('./*.html')
        .pipe(browserSync.reload({stream: true}));
});


gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: ".",
            index: "index.html"
        }
    });
});

gulp.task('css', function() {
    gulp.src('css/**/*.css')
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('watch', function() {
    gulp.watch('js/**/*.js', ['browserify']);
    gulp.watch('./*.html', ['html']);
    gulp.watch('css/**/*.css', ['css']);
});



gulp.task('default', ['browser-sync', 'watch']);