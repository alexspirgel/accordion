const gulp = require('gulp');
const gulpSass = require('gulp-sass');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpack_config = require('./webpack.config.js');

gulp.task('css', () => {
	return gulp.src('./src/css/*.scss')
		.pipe(gulpSass().on('error', gulpSass.logError))
		.pipe(gulp.dest('./dist/css'));
});

gulp.task('js', () => {
	gulp.src('./src/js/ace-accordion.js')
		.pipe(webpackStream(webpack_config), webpack)
		.pipe(gulp.dest('./dist/js'));
});

gulp.task('watch', function() {
	gulp.watch('./src/css/*.scss', ['css']);
	gulp.watch('./src/js/*.js', ['js']);
});

gulp.task('default', ['css', 'js', 'watch']);