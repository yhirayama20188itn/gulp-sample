var gulp = require('gulp');
var browserSync = require('browser-sync');
var ejs = require('gulp-ejs');
var rename = require('gulp-rename');
var fs = require("fs");
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var babel = require("gulp-babel");
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var mozjpeg = require('imagemin-mozjpeg');

gulp.task('bs', function () {
  browserSync({
    server: {
      baseDir: "./dist/"
    }
  });
});

gulp.task('ejs', function () {
  const json_path = "src/data/test.json";
  const json = JSON.parse(fs.readFileSync(json_path));
  return gulp.src(
    ['src/ejs/**/*.ejs', '!' + 'src/ejs/**/_*.ejs']
  )
    // .pipe(plumber())
    .pipe(ejs({
      jsonData: json
    }))
    .pipe(rename({ extname: '.html' }))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({ stream: true }))
});

gulp.task('sass', function () {
  return gulp.src(
    ['src/sass/**/*.scss', '!' + 'src/sass/**/_*.scss']
  )
    // .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'expanded'
    }))
    .pipe(autoprefixer({
      // ☆IEは11以上、Androidは4.4以上
      // その他は最新2バージョンで必要なベンダープレフィックスを付与する設定
      browsers: ["last 2 versions", "ie >= 11", "Android >= 4"],
      grid: true
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.reload({ stream: true }))
});

gulp.task('babel', function(done) {
  return gulp.src('src/js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.reload({ stream: true }))
    done();
})

gulp.task('imagemin', function () {
  return gulp.src('src/img/**/*.{jpg,jpeg,png,svg,gif}')
    // .pipe(plumber())
    .pipe(imagemin([
      pngquant({
        quality: [0.7, 0.85],
        speed: 1
      })
      // mozjpeg({
      //   quality: 85,
      //   progressive: true
      // }),
      // imagemin.svgo(),
      // imagemin.gifsicle()
    ]
    ))
    .pipe(imagemin())
    .pipe(gulp.dest('dist/img'));
});

gulp.task('watch', function () {
  gulp.watch('src/ejs/**/*.ejs', gulp.task('ejs'));
  gulp.watch("src/sass/**/*.scss", gulp.task('sass'));
  gulp.watch("src/js/**/*.js", gulp.task('babel'));
  // gulp.watch("./src/js/*.js", ['bs-reload']);
})

gulp.task('start', gulp.parallel('ejs', 'sass', 'babel', 'imagemin'));
gulp.task('default', gulp.parallel('bs', 'watch'));
