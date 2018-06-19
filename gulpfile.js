var gulp = require('gulp'); // 引入gulp
var server = require('gulp-webserver'); // 起服务
var uglify = require('gulp-uglify'); // 压缩js文件
var mincss = require('gulp-clean-css'); // 压缩css文件
var sass = require('gulp-sass'); // 编译scss
var sequence = require('gulp-sequence'); // 设置任务的执行顺序
var autoprefixer = require('gulp-autoprefixer'); // 自动添加前缀
var clean = require('gulp-clean'); // 删除指定文件
var path = require('path'); // 引入node内置模块
var fs = require('fs'); // 引入node内置模块
var url = require('url'); // 引入node内置模块
var mock = require('./mock/data.json'); // 引入数据

// 开发环境 --- 起服务
gulp.task('devServer',function(){
    return gulp.src('src')
        .pipe(server({
            port:9090, // 配置端口号
            open:true, // 自动打开浏览器
            middleware:function(req,res,next){ // 拦截请求数据
                var pathname = url.parse(req.url).pathname;
                if(pathname === '/favicon.ico'){
                    return false;
                }
                if(pathname == '/api/list'){
                    res.end(JSON.stringify(mock));
                }else{
                    pathname = pathname === '/' ? 'index.html' : pathname;
                    res.end(fs.readFileSync(path.join(__dirname,'src',pathname)))
                }
                
            }
        }))
})

// 开发坏境 --- 编译scss
gulp.task('devcss',function(){
    return gulp.src('src/scss/*.scss')
        .pipe(sass())
        .pipe(autoprefixer({
            browsers:['last 2 versions','Android >= 4.0']
        }))
        .pipe(gulp.dest('src/css'))
})

// 开发环境 --- 监听任务，执行任务
gulp.task('watch',function(){
    return gulp.watch('src/scss/*.scss',['devcss']);
})


// 线上环境 --- 起服务
gulp.task('buildServer',function(){
    return gulp.src('build')
        .pipe(server({
            port:9090, // 配置端口号
            open:true, // 自动打开浏览器
            middleware:function(req,res,next){ // 拦截请求数据
                var pathname = url.parse(req.url).pathname;
                if(pathname === '/favicon.ico'){
                    return false;
                }
                if(pathname == '/api/list'){
                    res.end(JSON.stringify(mock));
                }else{
                    pathname = pathname === '/' ? 'index.html' : pathname;
                    res.end(fs.readFileSync(path.join(__dirname,'build',pathname)))
                }
                
            }
        }))
})

// 删除指定文件
gulp.task('clean',function(){
    return gulp.src('build')
        .pipe(clean());
})

// 线上环境 --- copycss
gulp.task('buildCss',function(){
    return gulp.src('src/css/*css',{base:'src'})
        .pipe(mincss())
        .pipe(gulp.dest('build'))
})


// 线上环境 --- copyjs
gulp.task('buildjs',function(){
    return gulp.src('src/js/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('build/js'))
})

// 线上环境 --- 设置任务执行的顺序
gulp.task('build',function(cb){
    sequence('clean','buildCss','buildjs','buildServer',cb)
})

// 开发环境 --- 设置任务执行的顺序
gulp.task('dev',function(cb){
    sequence('devcss','watch','devServer',cb)
})
