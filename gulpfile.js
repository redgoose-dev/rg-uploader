const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const shell = require('shelljs');


gulp.task('prebuild', function() {
	try {
		shell.rm('-rf', 'dist');
		shell.rm('-rf', 'lib');
		shell.mkdir('-p', 'dist');
	} catch(e) {
		console.error(e);
	}
});