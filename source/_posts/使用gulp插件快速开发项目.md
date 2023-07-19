title: 使用gulp插件快速开发项目
author: 熊 超
tags:
  - gulp
categories:
  - 工具
date: 2017-07-16 00:15:00
---
---
<!--more-->

## 简介：
&ensp;&ensp;&ensp;&ensp;gulp有着丰富的插件库，她能自动化地完成javascript、coffee、sass、less、html、image、css 等文件的的测试、检查、压缩、格式化、浏览器自动刷新、部署文件生成，并监听文件在改动后重复指定的这些步骤，能快速提高我们项目的开发效率。


## 1.gulpfile.js基本配置示例：
&ensp;&ensp;&ensp;&ensp;通过此配置示例可以让我们快速编写js,css代码并打包压缩文件，减少文件资源大小。



```js
//导入工具包 require('node_modules里对应模块')
var gulp = require('gulp'); //本地安装gulp所用到的地方
var sass = require('gulp-sass');//将scss文件编译成浏览器可识别的css
var minifycss = require('gulp-minify-css');//压缩css文件，减小文件大小，并给引用url添加版本号避免缓存
var cleancss = require('gulp-clean-css');//压缩css文件，减小文件大小，并给引用url添加版本号避免缓存
var livereload = require('gulp-livereload');//监听文件发生变化时，浏览器自动刷新页面
var babel = require('gulp-babel');//将ES6编译成ES5
var uglify = require('gulp-uglify');//压缩js
var autoprefixer = require('gulp-autoprefixer');//根据设置浏览器版本自动处理浏览器前缀
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
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0'],
            cascade: true, //是否美化属性值 默认：true 
            remove:true //是否去掉不必要的前缀 默认：true 
        }))
        .pipe(gulp.dest('./css')) //将会在css文件夹下生成index.css（复制文件目录及文件）
        .pipe(livereload());//监听文件发生变化时，浏览器自动刷新页面
});

//定义一个babel任务（自定义任务名称）编译js
gulp.task('babel', function () {
    gulp.src('./src/**/*.js') //该任务针对的文件
        .pipe(babel({
            presets: ['es2015']
        })) //该任务调用的模块
        .pipe(livereload())//监听文件发生变化时，浏览器自动刷新页面
        .pipe(uglify({ //压缩js
            // mangle: false,//类型：Boolean 默认：true 是否修改变量名
            // compress: true//类型：Boolean 默认：true 是否完全压缩
        }))
        .pipe(gulp.dest('./js')) //将会在css文件夹下生成index.css（复制文件目录及文件）
});


gulp.task('auto', function () {
    gulp.watch('./sass/**/*.scss', ['sass']);
    gulp.watch('./src/**/*.js', ['babel']);
    // livereload.listen();
});
 
gulp.task('default',['sass','auto','babel']); //定义默认任务

// 通配符路径匹配示例：
// “src/a.js”：指定具体文件；
// “*”：匹配所有文件    例：src/*.js(包含src下的所有js文件)；
// “**”：匹配0个或多个子文件夹    例：src/**/*.js(包含src的0个或多个子文件夹下的js文件)；
// “{}”：匹配多个属性    例：src/{a,b}.js(包含a.js和b.js文件)  src/*.{jpg,png,gif}(src下的所有jpg/png/gif文件)；
// “!”：排除文件    例：!src/a.js(不包含src下的a.js文件)；

//gulp.task(name[, deps], fn) 定义任务  name：任务名称 deps：依赖任务名称 fn：回调函数
//gulp.src(globs[, options]) 执行任务处理的文件  globs：处理的文件路径(字符串或者字符串数组) 
//gulp.dest(path[, options]) 处理完后文件生成路径

```

### 配置文件详解：
#### 执行一个任务分三步走：
1.导入工具包 require('node_modules里对应模块')  
```js
var gulp = require('gulp'); //本地安装gulp所用到的地方
```

2.定义一个任务（自定义任务名称）  
```js   
gulp.task('test', function () {
  gulp.src('./sass/**/*.scss') //该任务针对的文件
      .pipe(test())
      .pipe(gulp.dest('./css')) //将会在css文件夹下生成.css文件（复制文件目录及文件）
})
```
3.执行任务：   
cmd命令提示符 
```
gulp test

```
##### 如果只是简单的配置了上面部分，每当我们修改了代码都需要重新执行命令gulp test,而且如果有多个任务就要执行多个命令，为了避免这么繁琐的操作可以加上如下配置：
```
gulp.task('auto', function () {
    gulp.watch('./src/**/*.js', ['test']);
});
gulp.task('default',['auto','test']); //定义默认任务

```
这样我们只需要输入一次命令gulp,就可以监听到每次代码的修改，自动帮我们编译，减少了很多繁琐的操作。


## 2.使用gulp编译css

### 1.gulp-sass的使用：

#### 1.简介：SASS是一种CSS的开发工具，提供了许多便利的写法，大大节省了设计者的时间，使得CSS的开发，变得简单和可维护。

#### 2.本地安转：npm install gulp-less --save-dev

#### 3.配置gulpfile.js

1.配置：

```js
//导入sass工具包
var sass = require('gulp-sass');

//定义一个sass任务（自定义任务名称）
gulp.task('sass', function () {
    gulp.src('./sass/**/*.scss') //该任务针对的文件
        .pipe(sass({
        outputStyle: 'compact'  //代码风格
      // nested：嵌套缩进的css代码，它是默认值。
      // expanded：没有缩进的、扩展的css代码。
      // compact：简洁格式的css代码。
      // compressed：压缩后的css代码。
        })) //该任务调用的模块
        .pipe(gulp.dest('./css')) //将会在css文件夹下生成index.css（复制文件目录及文件）
});

```

2.sass使用示例：

```css
$blue : #1875e7;　
.class {
    font-size: 12px;
}
.main{
    color:$blue;
    @if 1 + 1 == 2 { 
        border: 1px solid red;
    }@if 5 < 3 { 
        border: 2px dotted blue; 
    }
    .parent{
        margin-left:10px + 20px;
        &:hover{
            cursor: pointer;
            @extend .class;
        }
    }
}

```

#### 4.执行任务：   
命令提示符：gulp sass


#### 5.编译结果：

![mark](http://xiongcao.github.io/images/blogs/170715/IaCJglCfag.png?imageslim)

### 2.gulp-minify-css的使用：

#### 1.插件介绍：压缩css文件，减小文件大小，并给引用url添加版本号避免缓存  


#### 2.本地安转：npm install gulp-minify-css --save-dev。

#### 3.配置gulpfile.js    

1.配置
```js
var minifycss = require('gulp-minify-css');

//定义一个sass任务（自定义任务名称）
gulp.task('sass', function () {
    gulp.src('./sass/**/*.scss') //该任务针对的文件
        .pipe(sass({
            outputStyle: 'compact'  //代码风格
        // nested：嵌套缩进的css代码，它是默认值。
        // expanded：没有缩进的、扩展的css代码。
        // compact：简洁格式的css代码。
        // compressed：压缩后的css代码。
        })) //该任务调用的模块
        .pipe(minifycss({
            advanced: false,//类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
            compatibility: 'ie7',//保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
            keepBreaks: true,//类型：Boolean 默认：false [是否保留换行]
            keepSpecialComments: '*'
            //保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
        }))
        .pipe(gulp.dest('./css')) //将会在css文件夹下生成index.css（复制文件目录及文件）
});


```
2.使用示例：
![mark](http://xiongcao.github.io/images/blogs/170715/GCLHfi4haD.png?imageslim)

#### 4.执行任务：   
命令提示符：gulp sass

#### 5.编译结果：
![mark](http://xiongcao.github.io/images/blogs/170715/CHD62jD9kd.png?imageslim)
编译之后的css文件被压缩了

### 3.gulp-autoprefixer：

#### 1.插件介绍：根据设置浏览器版本自动处理浏览器前缀


#### 2.本地安转：npm install gulp-autoprefixer --save-dev。

#### 3.配置gulpfile.js    

1.配置
```js
var autoprefixer = require('gulp-autoprefixer');

//定义一个sass任务（自定义任务名称）
gulp.task('sass', function () {
    gulp.src('./sass/**/*.scss') //该任务针对的文件
        .pipe(sass({
            outputStyle: 'compact'  //代码风格
        // nested：嵌套缩进的css代码，它是默认值。
        // expanded：没有缩进的、扩展的css代码。
        // compact：简洁格式的css代码。
        // compressed：压缩后的css代码。
        })) //该任务调用的模块
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0'],
            cascade: true, //是否美化属性值 默认：true 
            remove:true //是否去掉不必要的前缀 默认：true 
        }))
        .pipe(gulp.dest('./css')) //将会在css文件夹下生成index.css（复制文件目录及文件）
});


```
2.使用示例：
![mark](http://xiongcao.github.io/images/blogs/170715/lhl9ajJEIA.png?imageslim)

#### 4.执行任务：   
命令提示符：gulp sass

#### 5.编译结果：
浏览器中的编译结果：
![mark](http://xiongcao.github.io/images/blogs/170715/IKCG8CDh46.png?imageslim)


## 3.使用gulp编译js

### 1.gulp-babel的使用：

#### 1.介绍：gulp-babel是可以将ES6编译成大多数浏览器可识别的ES5规范

#### 2.本地安转：
1.npm install gulp-babel --save-dev  
2.npm install babel-preset-es2015 --save-dev

#### 3.配置gulpfile.js

1.配置：

```js
//导入babel工具包
var less = require('gulp-babel');

//定义一个babel任务（自定义任务名称）
//定义一个babel任务（自定义任务名称）编译js
gulp.task('babel', function () {
    gulp.src('./src/**/*.js') //该任务针对的文件
        .pipe(babel({
            presets: ['es2015']
        })) //该任务调用的模块
        .pipe(gulp.dest('./js')) //将会在css文件夹下生成index.css（复制文件目录及文件）
});

```

2.ES6使用示例：

![mark](http://xiongcao.github.io/images/blogs/170716/LBLjFGhFF5.png?imageslim)

#### 4.执行任务：   
命令提示符：gulp babel


#### 5.编译结果：

![mark](http://xiongcao.github.io/images/blogs/170716/Hbd5lihjCL.png?imageslim)


### 2.gulp-uglify的使用：

#### 1.介绍：压缩js代码

#### 2.本地安转： npm install gulp-uglify --save-dev  

#### 3.配置gulpfile.js

1.配置：

```js
//导入uglify工具包
var uglify = require('gulp-uglify');

//定义一个babel任务（自定义任务名称）编译js
gulp.task('babel', function () {
    gulp.src('./src/**/*.js') //该任务针对的文件
        .pipe(babel({
            presets: ['es2015']
        })) //该任务调用的模块
        .pipe(uglify({ //压缩js
         // mangle: false,//类型：Boolean 默认：true 是否修改变量名
         // compress: true//类型：Boolean 默认：true 是否完全压缩
        }))
        .pipe(gulp.dest('./js')) //将会在css文件夹下生成index.css（复制文件目录及文件）
});

```

2.ES6使用示例：

![mark](http://xiongcao.github.io/images/blogs/170716/LBLjFGhFF5.png?imageslim)

#### 4.执行任务：   
命令提示符：gulp babel


#### 5.编译结果：

![mark](http://xiongcao.github.io/images/blogs/170716/7Kg8hi0Jla.png?imageslim)


### gulp插件库还有其他很多优秀的插件，可以根据自己的需要引入。
此dome在我的github上，可以下载自行查看<a href="https://github.com/xiongcao/project-gule" target="_blank">https://github.com/xiongcao/project-gule</a>