const gulp = require('gulp');
const gulp_sass = require('gulp-sass');
const webpack = require('webpack');
const webpack_stream = require('webpack-stream');
const webpack_config = require('./webpack.config.js');

gulp.task('css', () => {
	return gulp.src('./src/css/*.scss')
		.pipe(gulp_sass().on('error', gulp_sass.logError))
		.pipe(gulp.dest('./dist/css'));
});

gulp.task('js', () => {
	gulp.src('./src/js/accordion.js')
		.pipe(webpack_stream(webpack_config), webpack)
		.pipe(gulp.dest('./dist/js'));
});

gulp.task('watch', function() {
	gulp.watch('./src/css/*.scss', ['css']);
	gulp.watch('./src/js/*.js', ['js']);
});

gulp.task('default', ['css', 'js', 'watch']);