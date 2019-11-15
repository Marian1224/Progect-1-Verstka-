
const gulp         = require('gulp'),
      concat       = require('gulp-concat'),
      autoprefixer = require('gulp-autoprefixer'),
      cleanCSS     = require('gulp-clean-css'),
      uglify       = require('gulp-uglify'),
      imagemin     = require('gulp-imagemin'),
      pngquant     = require('gulp-pngquant'),
      cache        = require('gulp-cache'),  
      del          = require('del'),
      browserSync  = require('browser-sync').create();
         

const cssFiles = [
  './src/css/general.css',
  './src/css/header.css',
  './src/css/content.css',
  './src/css/text.css',
  './src/css/aside.css'
];

const jsFiles = [
  // consecutive folders with "scripts.js"
]


function style() {
  return gulp.src(cssFiles)
    .pipe(concat("styles.css"))
    .pipe(autoprefixer({ 
      // browsers: ['last 2 version'],
      cascade: false 
      }))
    .pipe(cleanCSS({ level: 2 }))
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.stream());
}

function scripts() {
  return gulp.src(jsFiles)
    .pipe(concat("scripts.js"))
    .pipe(uglify({ toplevel: true }))
    .pipe(gulp.dest('./dist/js'))
    .pipe(browserSync.stream());
}

function img() {
  return gulp.src('./src/img/**/*')
  .pipe(cache(imagemin({
    interlaced: true,
    progressive: true,
    svgoPlugins: [{ removeViewBox: false }],
    une: [pngquant()]
    })))
  .pipe(gulp.dest('./dist/img'))
}

function clean() {
  return del(['dist/*']);
}

function clear() {
  return cache.clearAll();
}

function watch() {
  browserSync.init({
      server: {
        baseDir: "./"
      },
      // notify: false 
    });
    gulp.watch('./src/css/**/*.css', style)
    gulp.watch('./src/js/**/*.js', scripts)
    gulp.watch('./src/img/**/*', img)
    gulp.watch("./*.html").on('change', browserSync.reload)
  }


gulp.task('style', style);
gulp.task('scripts', scripts);
gulp.task('img', img);
gulp.task('del', clean);
gulp.task('clear', clear);
gulp.task('watch', watch);


gulp.task('build', gulp.series(clean, gulp.parallel(style,scripts,img)));
gulp.task('dev', gulp.series('build', 'watch'));