const gulp = require('gulp');
const gulp_sass = require('gulp-sass');

gulp.task('sass', () => {
	return gulp.src('*.scss')
		.pipe(gulp_sass().on('error', gulp_sass.logError))
		.pipe(gulp.dest('.'));
});

gulp.task('watch', function() {
	gulp.watch('*.scss', ['sass']);
});

gulp.task('default', ['sass', 'watch']);