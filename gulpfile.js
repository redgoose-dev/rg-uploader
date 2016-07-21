var log = function(o) { console.log(o); };

// log modules
var gulp = require('gulp');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var scss = require('gulp-sass');
var rename = require('gulp-rename');
var webpack = require('webpack-stream');


// set directory
var src = './src';
var dist = './dist';
var maps = 'maps';
var plugins = './plugins';


// build scss
gulp.task('scss', function(){
	gulp.src(src + '/scss/rg-uploader.scss')
		.pipe(sourcemaps.init())
		.pipe(scss({
			//outputStyle : 'compact'
			outputStyle: 'compressed'
		}).on('error', scss.logError))
		.pipe(rename({ suffix: '.min' }))
		.pipe(sourcemaps.write(maps))
		.pipe(gulp.dest(dist + '/css'));
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
		.pipe(gulp.dest(dist + '/js/'));
});


// merge plugin files
gulp.task('js-plugin', function(){
	gulp.src(plugins + '/*.plugin.js')
		.pipe(sourcemaps.init())
		.pipe(concat('plugin.pkgd.js'))
		.pipe(uglify())
		.pipe(sourcemaps.write(maps))
		.pipe(gulp.dest(dist + '/js/'));
});
gulp.task('js-plugin:watch', function(){
	gulp.watch(plugins + '/**/*.js', ['js-plugin']);
});
