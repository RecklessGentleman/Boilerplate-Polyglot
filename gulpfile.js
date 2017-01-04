// Gulp
require('es6-promise').polyfill();
var gulp = require('gulp'),
	plumber = require('gulp-plumber'),
	rename = require('gulp-rename'),
	gulpIf = require('gulp-if'),
	runSequence = require('run-sequence');
// CSS
var sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	cssnano = require('gulp-cssnano');
// HTML
var extender = require('gulp-html-extend'),
	htmlmin = require('gulp-html-minifier');
// IMG
var imagemin = require('gulp-imagemin');
// JS
var concat    = require('gulp-concat'),
	uglify 	  = require('gulp-uglify'),
	cache 	  = require('gulp-cache');
// BrowserSync
var browserSync = require('browser-sync').create();

// Sources
var source = {
	scss: 'app/css/**/*.scss',
	css:  'app/css/*.css',
	html: 'app/*.html',
	js:   'app/js/**/*.js',
	img:  'app/img/**/*',
	fonts:'app/fonts/**/*'
};

// ==================================
// :: Tasks :: 
// ==================================

// :: Browser Sync =================
gulp.task('browserSync', function() {
	browserSync.init({
		server: { baseDir: './dist' },
	})
});

gulp.task('bs-reload', function () {
	// All this does is reload the browser. Doesn't even need () after .reload
	browserSync.reload();
});


// :: CSS =================
gulp.task('sass', function(){
	gulp.src([source.scss])
	.pipe(plumber({
		errorHandler: function (error) {
			console.log(error.message);
			this.emit('end');
		}}))
	.pipe(sass())
	.pipe(autoprefixer('last 2 versions'))
	.pipe(gulp.dest('app/css/'))
	.pipe(rename({suffix: '.min'}))
	.pipe(cssnano())
	.pipe(gulp.dest('dist/css/'))
	.pipe(browserSync.reload({stream:true}))
});


// :: HTML =================
gulp.task('publishHTML', function() {
	gulp.src(source.html)
	.pipe(extender({annotations:true,verbose:false})) // default options
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./dist', {overwrite: true}));
});


// :: FONTS ===============
gulp.task('fonts', function() {
	gulp.src(source.fonts)
	.pipe(gulp.dest('./dist/fonts'));
});


// :: IMG =================
gulp.task('img', function(){
	gulp.src(source.img)
	.pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
	.pipe(gulp.dest('dist/img/'));
});


// :: JS =================
gulp.task('scripts', function(){
	return gulp.src(source.js)
	.pipe(plumber({
		errorHandler: function (error) {
			console.log(error.message);
			this.emit('end');
		}}))
	.pipe(concat('main.js'))
	.pipe(gulp.dest('dist/js/'))
	.pipe(rename({suffix: '.min'}))
	.pipe(uglify())
	.pipe(gulp.dest('dist/js/'))
	//.pipe(browserSync.reload({stream:true}))
});


// :: Sequences, so you don't have to mess with the default task ::
gulp.task('buildHTML', function() {
	runSequence('publishHTML', 'bs-reload');
});

gulp.task('buildCSS', function() {
	runSequence('sass', 'bs-reload');
});

gulp.task('buildJS', function() {
	runSequence('scripts', 'bs-reload');
});

gulp.task('buildIMG', function() {
	runSequence('img', 'bs-reload');
});

gulp.task('buildFONTS', function() {
	runSequence('fonts', 'bs-reload');
});


// :: WATCH TASKS =================
gulp.task('default', ['browserSync', 'bs-reload', 'sass', 'publishHTML', 'sass', 'scripts', 'img', 'fonts', 'buildHTML', 'buildCSS', 'buildJS', 'buildIMG', 'buildFONTS'], function (){
	gulp.watch(source.scss, ['buildCSS']); // SCSS and CSS
	gulp.watch(source.html, ['buildHTML']); // HTML
	gulp.watch(source.js, ['buildJS']); // Javascript
	gulp.watch(source.img, ['buildIMG']); // Images
	gulp.watch(source.fonts, ['buildFONTS']); // Fonts
});










