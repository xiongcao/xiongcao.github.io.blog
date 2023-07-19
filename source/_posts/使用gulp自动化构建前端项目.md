title: 使用gulp自动化构建前端项目
author: 熊 超
tags:
  - gulp
categories:
  - 工具
date: 2017-07-09 10:30:00
---
---
<!--more-->

### gulp简介：
&ensp;&ensp;&ensp;&ensp;gulp是前端开发过程中对代码进行构建的工具，是自动化项目的构建利器；她不仅能对网站资源进行优化，而且在开发过程中很多重复的任务能够使用正确的工具自动完成，从而大大提高我们的工作效率。<br/>

&ensp;&ensp;&ensp;&ensp;gulp是基于Nodejs的自动任务运行器,她能自动化地完成javascript、coffee、sass、less、html、image、css 等文件的的测试、检查、压缩、格式化、浏览器自动刷新、部署文件生成，并监听文件在改动后重复指定的这些步骤。



### 环境搭建：

#### 1.安装nodeJS
1.gulp是基于nodejs，所以需要安装nodejs。   
2.自己去node官网下载nodejs安装。

#### 2.npm工具
##### 说明：
npm（node package manager）nodejs的包管理器，用于node插件管理（包括安装、卸载、管理依赖等）；

##### 使用npm安装插件：npm install &lt;name&gt; [-g] [--save-dev]；  
1.name: node插件名称。例：npm install gulp-sass --save-dev；

2.-g: 全局安装,可以通过命令行在任何地方调用它。如果不写-g则使非全局安装，将安装在定位目录的node_modules文件夹下，通过require()调用；  

3.--save: 将保存配置信息至package.json（package.json是nodejs项目配置文件）；

4.-dev: 保存至package.json的devDependencies节点，不指定-dev将保存至dependencies节点；

#### 3.安装gulp
1.npm install gulp -g；

#### 4.新建package.json文件

1.说明：package.json是基于nodejs项目必不可少的配置文件，它是存放在项目根目录的普通json文件；

2.通过命令行新建：npm init， 创建过程中会提示让输入各种信息，可以一直回车忽略它。
![mark](http://xiongcao.github.io/images/blogs/170709/1BEACEhcE9.png?imageslim)


#### 5.新建gulpfile.js文件
1.说明：gulpfile.js是gulp项目的配置文件，是位于项目根目录的普通js文件
2.新建gulpfile.js文件示例  
```js
//导入工具包 require('node_modules里对应模块')
var gulp = require('gulp'); //本地安装gulp所用到的地方
var sass = require('gulp-sass');
var minifycss = require('gulp-minify-css');//压缩css插件
var cleancss = require('gulp-clean-css');//压缩css插件
 
//定义一个sass任务（自定义任务名称）
gulp.task('sass', function () {
    gulp.src('./sass/**/*.scss') //该任务针对的文件
        .pipe(sass()) //该任务调用的模块
        .pipe(cleancss({
            advanced: false,//类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
            compatibility: 'ie7',//保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
            keepBreaks: true,//类型：Boolean 默认：false [是否保留换行]
            keepSpecialComments: '*'
            //保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
        }))
        .pipe(gulp.dest('./css')); //将会在css文件夹下生成index.css（复制文件目录及文件）
});
 
gulp.task('default',['sass']); //定义默认任务
 
//gulp.task(name[, deps], fn) 定义任务  name：任务名称 deps：依赖任务名称 fn：回调函数
//gulp.src(globs[, options]) 执行任务处理的文件  globs：处理的文件路径(字符串或者字符串数组) 
//gulp.dest(path[, options]) 处理完后文件生成路径

```

#### 6.运行gulp
1.gulp [name]:  gulpfile.js里面定义的模块的名称 例如:gulp sass。  
2.gulp default: 如果定义了默认任务gulp.task('default',['sass'])可直接执行gulp命令。


### &ensp;&ensp;&ensp;&ensp;到此为止使用gulp自动化构建前端项目的环境已经配置完成了，接下来就是我们自己去安装相应的插件来完善项目了。