var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    rename = require('gulp-rename'),
    cssnano = require('gulp-cssnano'),
    cssmin = require('gulp-cssmin'),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber'),
    concat = require('gulp-concat'),
    gulpif = require('gulp-if'),
    argv = require('yargs').argv;

gulp.task('css', function () {
   var onError = function(err) {
        notify.onError({
            title:    "SASS error",
            message:  "<%= error.message %>",
            sound:    "Beep"
        })(err);

        this.emit('end');
    };
    return gulp.src('style/style.scss')
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .on('error', onError)
    .pipe(autoprefixer())
    .pipe(gulpif(argv.deploy, cssnano()))
    .pipe(cssmin())
    .pipe(gulp.dest('dist'))
    .pipe(notify({ // Add gulpif here
        title: 'SASS',
        message: 'Compiled successfully',
        sound: "Pop"
    }));
});

gulp.task('js',function(){
    gulp.src(['js/plugins.js', 'js/script.js'])
    .pipe(plumber())
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(concat('script.js'))
    .pipe(notify(function (file) {
        if(file.jshint){
            if (file.jshint.success) {
                return ({
                    title: 'JS',
                    message: 'Compiled successfully',
                    sound: "Pop"
                });
            }

            var errors = file.jshint.results.map(function (data) {
                if (data.error) {
                    return "(" + data.error.line + ':' + data.error.character + ') ' + data.error.reason;
                }
            }).join("\n");
            return file.relative + " (" + file.jshint.results.length + " errors)\n" + errors;
        }
    }))
    .pipe(uglify())
    .pipe(rename({ 
        basename: "final",
        suffix: '.min' 
    }))
    .pipe(gulp.dest('dist'));
});


gulp.task('default', ['css', 'js'], function () {
    if (!argv.deploy) {
        gulp.watch("style/**/*.scss", ['css']);
        gulp.watch("js/script.js", ['js']);
        gulp.watch("js/plugins.js", ['js']);
    }
});