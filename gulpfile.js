// log modules
const gulp = require('gulp');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const scss = require('gulp-sass');
const rename = require('gulp-rename');
const webpack = require('webpack-stream');


// set directory
const src = './src';
const dist = './dist';
const maps = 'maps';
const plugins = './plugins';


// build scss
gulp.task('scss', function(){
	gulp.src(src + '/scss/rg-uploader.scss')
		.pipe(sourcemaps.init())
		.pipe(scss({
			//outputStyle : 'compact'
			outputStyle: 'compressed'
		}).on('error', scss.logError))
		.pipe(sourcemaps.write(maps))
		.pipe(gulp.dest(dist));
});
gulp.task('scss:watch', function(){
	gulp.watch([src + '/scss/*.scss', '!' + src + '/scss/demo.scss'], ['scss']);
});


// build app
gulp.task('js', function() {
	return gulp.src(src + '/js/rg-Uploader.js')
		.pipe(
			webpack(
				require('./webpack.config.js')
			)
		)
		.pipe(gulp.dest(dist));
});


// merge plugin files
gulp.task('js-plugin', function(){
	gulp.src(plugins + '/*.plugin.js')
		.pipe(sourcemaps.init())
		.pipe(concat('rg-uploader.plugins.js'))
		.pipe(uglify())
		.pipe(sourcemaps.write(maps))
		.pipe(gulp.dest(dist));
});
gulp.task('js-plugin:watch', function(){
	gulp.watch(plugins + '/**/*.js', ['js-plugin']);
});
