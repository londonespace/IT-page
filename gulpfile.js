const { src, dest, parallel, series, watch } = require('gulp');

const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;

const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');

const cleanCSS = require('gulp-clean-css');
const imageMin = require('gulp-imagemin');
const del = require('del');

//BROWSER 'SYNC'

function initBrowserSync() {
	browserSync.init({
		server: { baseDir: 'app' },
		notify: false,
		open: false,
		startPath: ''
	});
}

// STYLES

let styleModules = [
	'app/sass/config.sass',
	'app/sass/main.sass',
	'app/sass/header/*.sass'
];

function buildAppStyles() {
	return src(styleModules)
		.pipe(sourcemaps.init())
		.pipe(concat('app.min.sass'))
		.pipe(dest('app/sass/'))
		.pipe(sass())
		.pipe(sourcemaps.write())
		.pipe(dest('app/css/'))
		.pipe(browserSync.stream());
}

function buildDistStyles() {
	return src(styleModules)
		.pipe(concat('app.min.sass'))
		.pipe(sass())
		.pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
		.pipe(cleanCSS(({ level: { 1: { specialComments: 0 } }/*, format: 'beautify'*/ })))
		.pipe(dest('app/css/'));
}

// SCRIPTS

let jsModules = 'app/js/scripts/*.js';

function buildAppScripts() {
	return src(jsModules)
		.pipe(sourcemaps.init())
		.pipe(concat('app.min.js'))
		.pipe(sourcemaps.write())
		.pipe(dest('app/js/'))
		.pipe(browserSync.stream());
}

function buildDistScripts() {
	return src(jsModules)
		.pipe(concat('app.min.js'))
		.pipe(uglify())
		.pipe(dest('app/js/'))
}

//IMAGES

function exportImagesToDist() {
	return src('app/images/*')
		.pipe(imageMin())
		.pipe(dest('dist/images/'));
}

// BUILD

function buildCopy() {
	return src([
		'app/css/*.min.css',
		'app/js/*.min.js',
		'app/images/*',
		'app/*.html',
		'app/fonts/*'
	], { base: 'app' })
		.pipe(dest('dist'));
}

function cleanDist() {
	return del('dist/**/*', { force: true });
}

// WATCH

function startWatching() {
	watch('app/index.html', browserSync.reload);
	watch(styleModules, buildAppStyles);
	watch(['app/js/**/*.js', '!app/js/app.min.js'], buildAppScripts);
}

exports.initBrowserSync = initBrowserSync;

exports.styles = buildAppStyles;
exports.scripts = buildAppScripts;

const appCodeBuild = series(buildAppStyles, buildAppScripts);
const distCodeBuild = series(buildDistStyles, buildDistScripts)

exports.build = series(cleanDist, distCodeBuild, buildCopy, exportImagesToDist);

exports.default = parallel(appCodeBuild,
	series(initBrowserSync, browserSync.reload), startWatching);