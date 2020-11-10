const { src, dest, parallel, series, watch } = require('gulp');

const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;

const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');

const cleanCSS = require('gulp-clean-css');
const modifyCssUrls = require('gulp-modify-css-urls');
const imageMin = require('gulp-imagemin');

const newer = require('gulp-newer');
const del = require('del');

//BROWSER 'SYNC'

function initBrowserSync() {
	browserSync.init({
		server: { baseDir: 'app' },
		notify: false,
		open: false,
		startPath: '/html/index.html'
	});
}

// STYLES

let styleModules = 'app/sass/main.sass';

function buildAppStyles() {
	return src(styleModules)
		.pipe(sourcemaps.init())
		.pipe(concat('app.min.sass'))
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
		.pipe(modifyCssUrls(modifyCssUrlsOptions))
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

function minimazeImages() {
	return src('app/img/src/*')
		.pipe(newer('app/img/src/*'))
		.pipe(imageMin())
		.pipe(dest('app/img/dest/'));
}

function cleanMinImages() {
	return del('dist/img/**/*', { force: true });
}

// BUILD

function buildCopy() {
	return src([
		'app/css/*.min.css',
		'app/js/*.min.js',
		'app/img/dest/*',
		'app/html/*.html',
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
	watch('app/img/*', minimazeImages);
}

exports.initBrowserSync = initBrowserSync;

exports.styles = buildAppStyles;
exports.scripts = buildAppScripts;

const appCodeBuild = series(buildAppStyles, buildAppScripts);
const distCodeBuild = series(buildDistStyles, buildDistScripts)

exports.minimazeImages = minimazeImages;
exports.cleanMinImages = cleanMinImages;

exports.build = series(cleanDist, distCodeBuild, buildCopy, minimazeImages);

exports.default = parallel(appCodeBuild,
	series(initBrowserSync, browserSync.reload), startWatching);