var gulp = require('gulp'),
  connect = require('gulp-connect');
gulp.task('server', function() {
  connect.server({
    root: ['app'],
    livereload: true,
    port:80
  });
  var rel=['app/**/*.html','app/**/*.js','app/**/*.css'];
  gulp.watch(rel,function(){
    gulp.src('./app/**/*.html')
    .pipe(connect.reload());
  });

});

gulp.task('default', ['server']);



