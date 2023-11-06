/**
 * 
 * Gulp 在组件库中的运用
以elementUI为例，下载elementUI 源码

打开packages/theme-chalk/gulpfile.js

该文件的作用是将 scss 文件编译为 css 文件
 */

"use strict";

// 引入gulp
// series创建任务列表，
// src创建一个流，读取文件
// dest 创建一个对象写入到文件系统的流
const { series, src, dest } = require("gulp");
// gulp-dart-sass编译scss文件
const sass = require("gulp-dart-sass");
// gulp-autoprefixer 给css样式添加前缀
const autoprefixer = require("gulp-autoprefixer");
// gulp-cssmin 压缩css
const cssmin = require("gulp-cssmin");

// 处理src目录下的所有scss文件，转化为css文件
function compile() {
  return (
    src("./src/*.scss")
      .pipe(sass.sync().on("error", sass.logError))
      .pipe(
        // 给css样式添加前缀
        autoprefixer({
          overrideBrowserslist: ["ie > 9", "last 2 versions"],
          cascade: false,
        })
      )
      // 压缩css
      .pipe(cssmin())
      // 将编译好的css 输出到lib目录下
      .pipe(dest("./lib"))
  );
}

// 将src/fonts文件的字体文件 copy到 /lib/fonts目录下
function copyfont() {
  return src("./src/fonts/**").pipe(cssmin()).pipe(dest("./lib/fonts"));
}

// series创建任务列表
exports.build = series(compile, copyfont);
