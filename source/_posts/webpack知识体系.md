title: Webpack 知识体系
author: 熊 超
tags:
  - Webpack
categories:
  - 构建工具
date: 2022-10-11 13:15:00
---
<!--more-->


### webpack 中 loader 和 plugin 的区别是什么?



![image-20230313215918145](/Users/xiongchao/Library/Application Support/typora-user-images/image-20230313215918145.png)





![image-20230314100016140](/Users/xiongchao/Library/Application Support/typora-user-images/image-20230314100016140.png)

## 一、Webpack 基础

### 1. 简单配置

> 该部分需要掌握：
>
> 1. Webpack 常规配置项有哪些？
> 2. 常用 Loader 有哪些？如何配置？
> 3. 常用插件（Plugin）有哪些？如何的配置？
> 4. Babel 的如何配置？Babel 插件如何使用？



#### 1.1 安装依赖

毫无疑问，先本地安装一下 `webpack` 以及 `webpack-cli`

```bash
$ npm install webpack webpack-cli -D # 安装到本地依赖
```

安装完成 ✅

```bash
+ webpack-cli@4.7.2
+ webpack@5.44.0
```



#### 1.2 工作模式

webpack 在 4 以后就支持 0 配置打包，我们可以测试一下

1. 新建 `./src/index.js` 文件，写一段简单的代码

```js
const a = 'Hello ITEM'
console.log(a)
module.exports = a;
```

此时目录结构

```bash
webpack_work                  
├─ src                
│  └─ index.js         
└─ package.json       
```

2. 直接运行 `npx webpack`，启动打包

![image-20230314100037131](/Users/xiongchao/Library/Application Support/typora-user-images/image-20230314100037131.png)

打包完成，我们看到日志上面有一段提示：`The 'mode' option has not been set,...`

意思就是，我们没有配置 mode（模式），这里提醒我们配置一下

> **模式：** 供 mode 配置选项，告知 webpack 使用相应模式的内置优化，默认值为 `production`，另外还有 `development`、`none`，他们的区别如下

![image-20230314100147865](/Users/xiongchao/Library/Application Support/typora-user-images/image-20230314100147865.png)

怎么配置呢？很简单

1. 只需在配置对象中提供 mode 选项：

```js
module.exports = {
  mode: 'development',
};
```

2. 从 CLI 参数中传递：

```bash
$ webpack --mode=development
```



#### 1.3 配置文件

虽然有 0 配置打包，但是实际工作中，我们还是需要使用配置文件的方式，来满足不同项目的需求

1. 根路径下新建一个配置文件 `webpack.config.js`
2. 新增基本配置信息

```js
const path = require('path')

module.exports = {
  mode: 'development', // 模式
  entry: './src/index.js', // 打包入口地址
  output: {
    filename: 'bundle.js', // 输出文件名
    path: path.join(__dirname, 'dist') // 输出文件目录
  }
}
```




#### 1.4 Loader

这里我们把入口改成 CSS 文件，可能打包结果会如何

1. 新增 `./src/main.css`

2. 修改 entry 配置

```js
const path = require('path')

module.exports = {
  mode: 'development', // 模式
  entry: './src/main.css', // 打包入口地址
  output: {
    filename: 'bundle.css', // 输出文件名
    path: path.join(__dirname, 'dist') // 输出文件目录
  }
}
```

3. 运行打包命令：`npx webpack`

![image-20230314100827307](/Users/xiongchao/Library/Application Support/typora-user-images/image-20230314100827307.png)

这里就报错了！

这是因为：**webpack 默认支持处理 JS 与 JSON 文件，其他类型都处理不了，这里必须借助 Loader 来对不同类型的文件的进行处理。**

4. 安装 `css-loader` 来处理 CSS

```bash
npm install css-loader -D
```

5. 配置资源加载模块

```js
const path = require('path')

module.exports = {
  mode: 'development', // 模式
  entry: './src/main.css', // 打包入口地址
  output: {
    filename: 'bundle.css', // 输出文件名
    path: path.join(__dirname, 'dist') // 输出文件目录
  },
  module: { 
    rules: [ // 转换规则
      {
        test: /\.css$/, //匹配所有的 css 文件
        use: 'css-loader' // use: 对应的 Loader 名称
      }
    ]
  }
}
```

6. 重新运行打包命令 `npx webpack`

<img src="/Users/xiongchao/Library/Application Support/typora-user-images/image-20230314101522488.png" alt="image-20230314101522488" />

哎嘿，可以打包了 😁

```js
dist           
└─ bundle.css  # 打包得到的结果
```

![image-20230314101635017](/Users/xiongchao/Library/Application Support/typora-user-images/image-20230314101635017.png)

这里这是尝试，入口文件还是需要改回 `./src/index.js`

这里我们可以得到一个结论：**Loader 就是将 Webpack 不认识的内容转化为认识的内容**



#### 1.5 插件（plugin）

与 Loader 用于转换特定类型的文件不同，**插件（Plugin）可以贯穿 Webpack 打包的生命周期，执行不同的任务**

下面来看一个使用的列子：

1.新建 `./src/index.html` 文件

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ITEM</title>
</head>
<body></body>
</html>
```

如果我想打包后的资源文件，例如：js 或者 css 文件可以自动引入到 Html 中，就需要使用插件 [html-webpack-plugin](https://link.juejin.cn/?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fhtml-webpack-plugin)来帮助你完成这个操作

2.本地安装 `html-webpack-plugin`

```bash
npm install html-webpack-plugin -D
```

3.配置插件

```js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development', // 模式
  entry: './src/index.js', // 打包入口地址
  output: {
    filename: 'bundle.js', // 输出文件名
    path: path.join(__dirname, 'dist') // 输出文件目录
  },
  module: { 
    rules: [
      {
        test: /\.css$/, //匹配所有的 css 文件
        use: 'css-loader' // use: 对应的 Loader 名称
      }
    ]
  },
  plugins:[ // 配置插件
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ]
}
```

运行一下打包，打开 dist 目录下生成的 index.html 文件

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ITEM</title>
<script defer src="bundle.js"></script></head>
<body></body>
</html>
```

可以看到它自动的引入了打包好的 bundle.js ，非常方便实用



#### 1.6 自动清空打包目录

每次打包的时候，打包目录都会遗留上次打包的文件，为了保持打包目录的纯净，我们需要在打包前将打包目录清空

这里我们可以使用插件 [clean-webpack-plugin](https://link.juejin.cn/?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fclean-webpack-plugin) 来实现

1. 安装

```bash
$ npm install clean-webpack-plugin -D
```

2. 配置

```js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 引入插件
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  // ...
  plugins:[ // 配置插件
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new CleanWebpackPlugin() // 引入插件
  ]
}
```



#### 1.7 区分环境

本地开发和部署线上，肯定是有不同的需求

**本地环境：**

- 需要更快的构建速度
- 需要打印 debug 信息
- 需要 live reload 或 hot reload 功能
- 需要 sourcemap 方便定位问题

**生产环境：**

- 需要更小的包体积，代码压缩+tree-shaking
- 需要进行代码分割
- 需要压缩图片体积

针对不同的需求，首先要做的就是做好环境的区分



1. 本地安装 cross-env [[文档地址](https://link.juejin.cn/?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fcross-env)]

```bash
npm install cross-env -D
```

2.  配置启动命令

打开 `./package.json`

```json
"scripts": {
  "dev": "cross-env NODE_ENV=dev webpack serve --mode development", 
  "test": "cross-env NODE_ENV=test webpack --mode production",
  "build": "cross-env NODE_ENV=prod webpack --mode production"
},
```

3. 在 Webpack 配置文件中获取环境变量

```js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

console.log('process.env.NODE_ENV=', process.env.NODE_ENV) // 打印环境变量

const config = {
  entry: './src/index.js', // 打包入口地址
  output: {
    filename: 'bundle.js', // 输出文件名
    path: path.join(__dirname, 'dist') // 输出文件目录
  },
  module: { 
    rules: [
      {
        test: /\.css$/, //匹配所有的 css 文件
        use: 'css-loader' // use: 对应的 Loader 名称
      }
    ]
  },
  plugins:[ // 配置插件
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ]
}

module.exports = (env, argv) => {
  console.log('argv.mode=',argv.mode) // 打印 mode(模式) 值
  // 这里可以通过不同的模式修改 config 配置
  return config;
}
```

4. 测试一下看看

- 执行 `npm run build`

```bash
process.env.NODE_ENV= prod
argv.mode= production
```



#### 1.8 启动 devServer

1. 安装 [webpack-dev-server](https://link.juejin.cn/?target=https%3A%2F%2Fwebpack.docschina.org%2Fconfiguration%2Fdev-server%2F%23devserver)

```bash
npm intall webpack-dev-server@3.11.2 -D
```

> ⚠️注意：本文使用的 `webpack-dev-server` 版本是 `3.11.2`，当版本 `version >= 4.0.0` 时，需要使用 [devServer.static](https://link.juejin.cn/?target=https%3A%2F%2Fwebpack.docschina.org%2Fconfiguration%2Fdev-server%2F%23devserverstatic) 进行配置，不再有 `devServer.contentBase` 配置项。



2. 配置本地服务

```js
// webpack.config.js
const config = {
  // ...
  devServer: {
    contentBase: path.resolve(__dirname, 'public'), // 静态文件目录
    compress: true, //是否启动压缩 gzip
    port: 8080, // 端口号
    // open:true  // 是否自动打开浏览器
  },
 // ...
}
module.exports = (env, argv) => {
  console.log('argv.mode=',argv.mode) // 打印 mode(模式) 值
  // 这里可以通过不同的模式修改 config 配置
  return config;
}
```

**为什么要配置 contentBase ？**

因为 webpack 在进行打包的时候，对静态文件的处理，例如图片，都是直接 copy 到 dist 目录下面。但是对于本地开发来说，这个过程太费时，也没有必要，所以在设置 contentBase 之后，就直接到对应的静态目录下面去读取文件，而不需对文件做任何移动，节省了时间和性能开销。

3. 启动本地服务

```bash
$ npm run dev
```

为了看到效果，我在 html 中添加了一段文字，并在 public 下面放入了一张图片 logo.png

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ITEM</title>
</head>
<body>
  <p>ITEM</p>
</body>
</html>
```

```
public       
└─ logo.png  
```

打开地址 `http://localhost:8080/`

![image-20230314105304952](/Users/xiongchao/Library/Application Support/typora-user-images/image-20230314105304952.png)接着访问 `http://localhost:8080/logo.png`

![image-20230314105340796](/Users/xiongchao/Library/Application Support/typora-user-images/image-20230314105340796.png)

OK，没问题 👌



#### 1.9 引入 CSS

上面，我们在 Loader 里面讲到了使用 css-loader 来处理 css，但是单靠 css-loader 是没有办法将样式加载到页面上。这个时候，我们需要再安装一个 style-loader 来完成这个功能

style-loader 就是将处理好的 css 通过 style 标签的形式添加到页面上

1. 安装 `style-loader`

```bash
npm install style-loader -D
```

2. 配置 Loader

```js
const config = {
  // ...
  module: { 
    rules: [
      {
        test: /\.css$/, //匹配所有的 css 文件
        use: ['style-loader','css-loader']
      }
    ]
  },
  // ...
}
```

> **⚠️注意：** Loader 的执行顺序是固定**从后往前**，即按 `css-loader --> style-loader` 的顺序执行



3. 引用样式文件

在入口文件 `./src/index.js` 引入样式文件 `./src/main.css`

```js
// ./src/index.js
import './main.css';

const a = 'Hello ITEM'
console.log(a)
module.exports = a;
```

```css
/* ./src/main.css */ 
body {
  margin: 10px auto;
  background: cyan;
  max-width: 800px;
}
```

4. 重启一下本地服务，访问 `http://localhost:8080/`

   ![image-20230314110210083](/Users/xiongchao/Library/Application Support/typora-user-images/image-20230314110210083.png)

这样样式就起作用了。

style-loader 核心逻辑相当于：

```js
const content = `${样式内容}`
const style = document.createElement('style');
style.innerHTML = content;
document.head.appendChild(style);
```

通过动态添加 style 标签的方式，将样式引入页面



#### 1.10 CSS 兼容性

使用 [postcss-loader](https://link.juejin.cn/?target=https%3A%2F%2Fwebpack.docschina.org%2Floaders%2Fpostcss-loader%2F)，自动添加 CSS3 部分属性的浏览器前缀

上面我们用到的 `transform: translateX(-50%);`，需要加上不同的浏览器前缀，这个我们可以使用 postcss-loader 来帮助我们完成

```bash
npm install postcss postcss-loader postcss-preset-env -D
```

```js
const config = {
  // ...
  module: { 
    rules: [
      {
        test: /\.css$/, //匹配所有的 css 文件
        use: ['style-loader','css-loader', 'postcss-loader']
      }
    ]
  },
  // ...
}
```

创建 postcss 配置文件 `postcss.config.js`

```js
// postcss.config.js
module.exports = {
  plugins: [require('postcss-preset-env')]
}
```

创建 postcss-preset-env 配置文件 `.browserslistrc`

```nginx
# 换行相当于 and
last 2 versions # 回退两个浏览器版本
> 0.5% # 全球超过0.5%人使用的浏览器，可以通过 caniuse.com 查看不同浏览器不同版本占有率
IE 10 # 兼容IE 10
```



#### 1.11 引入 Less 或者 Sass

<img src="/Users/xiongchao/Library/Application Support/typora-user-images/image-20230314110846900.png" alt="image-20230314110846900" style="zoom:67%;" />



#### 1.12 分离样式文件

前面，我们都是依赖 `style-loader` 将样式通过 style 标签的形式添加到页面上

但是，更多时候，我们都希望可以通过 CSS 文件的形式引入到页面上

1. 安装 [`mini-css-extract-plugin`](https://link.juejin.cn/?target=https%3A%2F%2Fwebpack.docschina.org%2Fplugins%2Fmini-css-extract-plugin%2F)

```shell
$ npm install mini-css-extract-plugin -D
```

2. 修改 `webpack.config.js` 配置

   ```js
   // ...
   // 引入插件
   const MiniCssExtractPlugin = require('mini-css-extract-plugin')
   
   
   const config = {
     // ...
     module: { 
       rules: [
         // ...
         {
           test: /\.(s[ac]|c)ss$/i, //匹配所有的 sass/scss/css 文件
           use: [
             // 'style-loader',
             MiniCssExtractPlugin.loader, // 添加 loader
             'css-loader',
             'postcss-loader',
             'sass-loader', 
           ] 
         },
       ]
     },
     // ...
     plugins:[ // 配置插件
       // ...
       new MiniCssExtractPlugin({ // 添加插件
         filename: '[name].[hash:8].css'
       }),
       // ...
     ]
   }
   
   // ...
   ```

3. 查看打包结果

```markdown
dist                    
├─ avatar.d4d42d52.png  
├─ bundle.js            
├─ index.html           
├─ logo.56482c77.png    
└─ main.3bcbae64.css # 生成的样式文件  
```

![image-20230314140445250](/Users/xiongchao/Library/Application Support/typora-user-images/image-20230314140445250.png)



#### 1.13 图片和字体文件

虽然上面在配置开发环境的时候，我们可以通过设置 `contentBase` 去直接读取图片类的静态文件，看一下下面这两种图片使用情况

1. 页面直接引入

   ```html
   <!-- 本地可以访问，生产环境会找不到图片 -->
   <img src="/logo.png" alt="">
   ```

2. 背景图引入

   ```html
   <div id="imgBox"></div>
   ```

   ```css
   /* ./src/main.css */
   ...
   #imgBox {
     height: 400px;
     width: 400px;
     background: url('../public/logo.png');
     background-size: contain;
   }
   ```

直接会报错

![image-20230314140633926](/Users/xiongchao/Library/Application Support/typora-user-images/image-20230314140633926.png)

所以实际上，Webpack 无法识别图片文件，需要在打包的时候处理一下

常用的处理图片文件的 Loader 包含：

![image-20230314140703022](/Users/xiongchao/Library/Application Support/typora-user-images/image-20230314140703022.png)

```js
const config = {
  //...
  module: { 
    rules: [
      {
        test: /\.(jpe?g|png|gif)$/i,
        use:[
          {
            loader: 'file-loader',
            options: {
              name: '[name][hash:8].[ext]'
            }
          },
          {
            loader: 'url-loader',
            options: {
              name: '[name][hash:8].[ext]',
              // 文件小于 50k 会转换为 base64，大于则拷贝文件
              limit: 50 * 1024
            }
          }
        ]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,  // 匹配字体文件
        use: [
          {
            loader: 'url-loader',
            options: {
              name: 'fonts/[name][hash:8].[ext]', // 体积大于 10KB 打包到 fonts 目录下 
              limit: 10 * 1024,
            } 
          }
        ]
      },
    ]
  },
  // ...
}
```



#### 1.14 资源模块的使用

> webpack5 新增资源模块(asset module)，允许使用资源文件（字体，图标等）而无需配置额外的 loader。



资源模块支持以下四个配置：

> 1. `asset/resource` 将资源分割为单独的文件，并导出 url，类似之前的 file-loader 的功能.
> 2. `asset/inline` 将资源导出为 dataUrl 的形式，类似之前的 url-loader 的小于 limit 参数时功能.
> 3. `asset/source` 将资源导出为源码（source code）. 类似的 raw-loader 功能.
> 4. `asset` 会根据文件大小来选择使用哪种类型，当文件小于 8 KB（默认） 的时候会使用 asset/inline，否则会使用 asset/resource。



贴一下修改后的完整代码

```js
// ./src/index.js

const config = {
  // ...
  module: { 
    rules: [
      // ... 
      {
        test: /\.(jpe?g|png|gif)$/i,
        type: 'asset',
        generator: {
          // 输出文件位置以及文件名
          // [ext] 自带 "." 这个与 url-loader 配置不同
          filename: "[name][hash:8][ext]"
        },
        parser: {
          dataUrlCondition: {
            maxSize: 50 * 1024 //超过50kb不转 base64
          }
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        type: 'asset',
        generator: {
          // 输出文件位置以及文件名
          filename: "[name][hash:8][ext]"
        },
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024 // 超过100kb不转 base64
          }
        }
      },
    ]
  },
  // ...
}

module.exports = (env, argv) => {
  console.log('argv.mode=',argv.mode) // 打印 mode(模式) 值
  // 这里可以通过不同的模式修改 config 配置
  return config;
}
```



#### 1.15 JS 兼容性（Babel）

在开发中我们想使用最新的 Js 特性，但是有些新特性的浏览器支持并不是很好，所以 Js 也需要做兼容处理，常见的就是将 ES6 语法转化为 ES5。

这里将登场的“全场最靓的仔” -- Babel

1. 安装依赖

   ```shell
   $ npm install babel-loader @babel/core @babel/preset-env -D
   ```

   - `babel-loader` 使用 Babel 加载 ES2015+ 代码并将其转换为 ES5
   - `@babel/core` Babel 编译的核心包
   - `@babel/preset-env` Babel 编译的预设，可以理解为 Babel 插件的超集

2. 配置 Babel 预设

   ```js
   // webpack.config.js
   const config = {
     entry: './src/index.js', // 打包入口地址
     output: {
       filename: 'bundle.js', // 输出文件名
       path: path.join(__dirname, 'dist'), // 输出文件目录
     },
     module: { 
       rules: [
         {
           test: /\.js$/i,
           use: [
             {
               loader: 'babel-loader',
               options: {
                 presets: [
                   '@babel/preset-env'
                 ],
               }
             }
           ]
         },
       ]
     },
   }
   ```

尽然是做兼容处理，我们自然也可以指定到底要兼容哪些浏览器

为了避免 `webpack.config.js` 太臃肿，建议将 Babel 配置文件提取出来

根目录下新增 `.babelrc.js`

```js
// ./babelrc.js

module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        // useBuiltIns: false 默认值，无视浏览器兼容配置，引入所有 polyfill
        // useBuiltIns: entry 根据配置的浏览器兼容，引入浏览器不兼容的 polyfill
        // useBuiltIns: usage 会根据配置的浏览器兼容，以及你代码中用到的 API 来进行 polyfill，实现了按需添加
        useBuiltIns: "entry",
        corejs: "3.9.1", // 是 core-js 版本号
        targets: {
          chrome: "58",
          ie: "11",
        },
      },
    ],
  ],
};

```

好了，这里一个简单的 Babel 预设就配置完了

常见 Babel 预设还有：

- `@babel/preset-flow`
- `@babel/preset-react`
- `@babel/preset-typescript`



3. 配置 Babel 插件

对于正在提案中，还未进入 ECMA 规范中的新特性，Babel 是无法进行处理的，必须要安装对应的插件，例如：

```js
// ./ index.js

import './main.css';
import './sass.scss'
import logo from '../public/avatar.png'

import './fonts/iconfont.css'

const a = 'Hello ITEM'
console.log(a)

const img = new Image()
img.src = logo

document.getElementById('imgBox').appendChild(img)

// 新增装饰器的使用
@log('hi')
class MyClass { }

function log(text) {
  return function(target) {
    target.prototype.logger = () => `${text}，${target.name}`
  }
}

const test = new MyClass()
test.logger()
```

执行一下打包

![image-20230314142322496](/Users/xiongchao/Library/Application Support/typora-user-images/image-20230314142322496.png)

不出所料，识别不了 🙅🏻‍♀️

怎么才能使用呢？Babel 其实提供了对应的插件：

- `@babel/plugin-proposal-decorators`
- `@babel/plugin-proposal-class-properties`

安装一下:

```bash
$ npm install babel/plugin-proposal-decorators @babel/plugin-proposal-class-properties -D
```

打开 `.babelrc.js` 加上插件的配置

```js
module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "entry",
        corejs: "3.9.1",
        targets: {
          chrome: "58",
          ie: "11",
        },
      },
    ],
  ],
  plugins: [    
    ["@babel/plugin-proposal-decorators", { legacy: true }],
    ["@babel/plugin-proposal-class-properties", { loose: true }],
  ]
};
```

这样就可以打包了，在 `bundle.js` 中已经转化为浏览器支持的 Js 代码



### 2. SourceMap 配置选择

SourceMap 是一种映射关系，当项目运行后，如果出现错误，我们可以利用 SourceMap 反向定位到源码位置

#### 2.1 devtool 配置

```js
const config = {
  entry: './src/index.js', // 打包入口地址
  output: {
    filename: 'bundle.js', // 输出文件名
    path: path.join(__dirname, 'dist'), // 输出文件目录
  },
  devtool: 'source-map',
  module: { 
     // ...
  }
  // ...
```

执行打包后，dist 目录下会生成以 `.map` 结尾的 SourceMap 文件

```
dist                   
├─ avatard4d42d52.png  
├─ bundle.js           
├─ bundle.js.map     
└─ index.html          
```

除了 `source-map` 这种类型之外，还有很多种类型可以用，例如：

<img src="/Users/xiongchao/Library/Application Support/typora-user-images/image-20230315101350012.png" alt="image-20230315101350012"/>

对照一下校验规则 `^(inline-|hidden-|eval-)?(nosources-)?(cheap-(module-)?)?source-map$` 分析一下关键字

![image-20230314150330776](/Users/xiongchao/Library/Application Support/typora-user-images/image-20230314150330776.png)



#### 2.2 推荐配置

1. 本地开发：

   推荐：`eval-cheap-module-source-map`

   理由：

   - 本地开发首次打包慢点没关系，因为 `eval` 缓存的原因，rebuild 会很快
   - 开发中，我们每行代码不会写的太长，只需要定位到行就行，所以加上 `cheap`
   - 我们希望能够找到源代码的错误，而不是打包后的，所以需要加上 `module`



2. 生产环境：

   推荐：`(none)`

   理由：

   - 就是不想别人看到我的源代码



3. 三种 hash 值

   Webpack 文件指纹策略是将文件名后面加上 hash 值。特别在使用 CDN 的时候，缓存是它的特点与优势，但如果打包的文件名，没有 hash 后缀的话，你肯定会被缓存折磨的够呛 😂

   例如我们在基础配置中用到的：`filename: "[name][hash:8][ext]"`

   这里里面 `[]` 包起来的，就叫占位符，它们都是什么意思呢？请看下面这个表 👇🏻

   <img src="/Users/xiongchao/Library/Application Support/typora-user-images/image-20230314150858915.png" alt="image-20230314150858915" style="zoom:50%;" align="left"/>

表格里面的 `hash`、`chunkhash`、`contenthash` 你可能还是不清楚差别在哪

- **hash** ：任何一个文件改动，整个项目的构建 hash 值都会改变；
- **chunkhash**：文件的改动只会影响其所在 chunk 的 hash 值；
- **contenthash**：每个文件都有单独的 hash 值，文件的改动只会影响自身的 hash 值；



## 二、Webpack 进阶

第二部分，我们将向“能优化”的方向前进 🏃

除了配置上的优化外，我们也要学习如何自己开发 Loader 和 Plugin



### 1. 优化构建速度

#### 1.1 构建费时分析

这里我们需要使用插件 [speed-measure-webpack-plugin](https://link.juejin.cn/?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fspeed-measure-webpack-plugin)，我们参考文档配置一下

1. 首先安装一下

```bash
$ npm i -D speed-measure-webpack-plugin
```

2. 修改我们的配置文件 webpack.config.js

```js
...
// 费时分析
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();
...

const config = {...}

module.exports = (env, argv) => {
  // 这里可以通过不同的模式修改 config 配置

  return smp.wrap(config);
}
```



> **注意：在 webpack5.x 中为了使用费时分析去对插件进行降级或者修改配置写法是非常不划算的**，这里因为演示需要，我后面会继续使用，但是在平时开发中，建议还是不要使用。



#### 1.2 优化 resolve 配置

##### 1.2.1 alias

alias 用的创建 `import` 或 `require` 的别名，用来简化模块引用，项目中基本都需要进行配置。

```js
const path = require('path')
...
// 路径处理方法
function resolve(dir){
  return path.join(__dirname, dir);
}

 const config  = {
  ...
  resolve:{
    // 配置别名
    alias: {
      '~': resolve('src'),
      '@': resolve('src'),
      'components': resolve('src/components'),
    }
  }
};
```

配置完成之后，我们在项目中就可以

```js
// 使用 src 别名 ~ 
import '~/fonts/iconfont.css'

// 使用 src 别名 @ 
import '@/fonts/iconfont.css'

// 使用 components 别名
import footer from "components/footer";
```



##### 1.2.2 extensions

webpack 默认配置

```js
const config = {
  //...
  resolve: {
    extensions: ['.js', '.json', '.wasm'],
  },
};
```

如果用户引入模块时不带扩展名，例如

```js
import file from '../path/to/file';
```

那么 webpack 就会按照 extensions 配置的数组**从左到右**的顺序去尝试解析模块

需要注意的是：

1. 高频文件后缀名放前面；
2. 手动配置后，默认配置会被覆盖

如果想保留默认配置，可以用 `...` 扩展运算符代表默认配置，例如

```js
const config = {
  //...
  resolve: {
    extensions: ['.ts', '...'], 
  },
};
```



##### 1.2.3 modules

告诉 webpack 解析模块时应该搜索的目录，常见配置如下

```js
const path = require('path');

// 路径处理方法
function resolve(dir){
  return path.join(__dirname, dir);
}

const config = {
  //...
  resolve: {
     modules: [resolve('src'), 'node_modules'],
  },
};
```

告诉 webpack 优先 src 目录下查找需要解析的文件，会大大节省查找时间



##### 1.2.4 resolveLoader

resolveLoader 与上面的 resolve 对象的属性集合相同， 但仅用于解析 webpack 的 [loader](https://link.juejin.cn/?target=https%3A%2F%2Fwebpack.docschina.org%2Fconcepts%2Floaders) 包。

**一般情况下保持默认配置就可以了，但如果你有自定义的 Loader 就需要配置一下**，不配可能会因为找不到 loader 报错

- 例如：我们在 loader 文件夹下面，放着我们自己写的 loader

我们就可以怎么配置

```js
const path = require('path');

// 路径处理方法
function resolve(dir){
  return path.join(__dirname, dir);
}

const config = {
  //...
  resolveLoader: {
    modules: ['node_modules',resolve('loader')]
  },
};
```



#### 1.3 externals

`externals` 配置选项提供了「**从输出的 bundle 中排除依赖**」的方法。此功能通常对 **library 开发人员**来说是最有用的，然而也会有各种各样的应用程序用到它。

例如，从 CDN 引入 jQuery，而不是把它打包：

1. 引入链接

```js
<script
  src="https://code.jquery.com/jquery-3.1.0.js"
  integrity="sha256-slogkvB1K3VOkzAI8QITxV3VzpOnkeNVsKvtkYLMjfk="
  crossorigin="anonymous"
></script>
```

2. 配置 externals

```js
const config = {
  //...
  externals: {
    jquery: 'jQuery',
  },
};
```

3. 使用 jQuery

```js
import $ from 'jquery';

$('.my-element').animate(/* ... */);
```

我们可以用这样的方法来剥离不需要改动的一些依赖，大大节省打包构建的时间。



#### 1.4 缩小范围

在配置 loader 的时候，我们需要更精确的去指定 loader 的作用目录或者需要排除的目录，通过使用 `include` 和 `exclude` 两个配置项，可以实现这个功能，常见的例如：

- **`include`**：符合条件的模块进行解析
- **`exclude`**：排除符合条件的模块，不解析
- **`exclude`** 优先级更高

例如在配置 babel 的时候

```js
const path = require('path');

// 路径处理方法
function resolve(dir){
  return path.join(__dirname, dir);
}

const config = {
  //...
  module: { 
    noParse: /jquery|lodash/,
    rules: [
      {
        test: /\.js$/i,
        include: resolve('src'),
        exclude: /node_modules/,
        use: [
          'babel-loader',
        ]
      },
      // ...
    ]
  }
};
```



#### 1.5 noParse

- 不需要解析依赖的第三方大型类库等，可以通过这个字段进行配置，以提高构建速度
- 使用 noParse 进行忽略的模块文件中不会解析 `import`、`require` 等语法

```js
const config = {
  //...
  module: { 
    noParse: /jquery|lodash/,
    rules:[...]
  }

};
```



#### 1.6 IgnorePlugin

防止在 `import` 或 `require` 调用时，生成以下正则表达式匹配的模块：

- `requestRegExp` 匹配(test)资源请求路径的正则表达式。
- `contextRegExp` 匹配(test)资源上下文（目录）的正则表达式。

```js
new webpack.IgnorePlugin({ resourceRegExp, contextRegExp });
```

以下示例演示了此插件的几种用法。

1. 安装 moment 插件（时间处理库）

```bash
$ npm i -S moment
```

2. 配置 IgnorePlugin

```js
// 引入 webpack
const webpack = require('webpack')

const config = {
  ...
  plugins:[ // 配置插件
    ...
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/,
    }),
  ]  
};
```

目的是将插件中的非中文语音排除掉，这样就可以大大节省打包的体积了



### 2. 优化构建结果

#### 2.1 压缩 CSS

1. 安装 [`optimize-css-assets-webpack-plugin`](https://link.juejin.cn/?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Foptimize-css-assets-webpack-plugin)

```bash
$ npm install -D optimize-css-assets-webpack-plugin 
```

2. 修改 `webapck.config.js` 配置

```js 
// ...
// 压缩css
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
// ...

const config = {
  // ...
  optimization: {
    minimize: true,
    minimizer: [
      // 添加 css 压缩配置
      new OptimizeCssAssetsPlugin({}),
    ]
  },
 // ...
}

// ...
```



#### 2.2 压缩 JS

> 在生成环境下打包默认会开启 js 压缩，但是当我们手动配置 `optimization` 选项之后，就不再默认对 js 进行压缩，需要我们手动去配置。

因为 webpack5 内置了[terser-webpack-plugin](https://link.juejin.cn/?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fterser-webpack-plugin) 插件，所以我们不需重复安装，直接引用就可以了，具体配置如下

```js
const TerserPlugin = require('terser-webpack-plugin');

const config = {
  // ...
  optimization: {
    minimize: true, // 开启最小化
    minimizer: [
      // ...
      new TerserPlugin({})
    ]
  },
  // ...
}
```



#### 2.3 清除无用的 CSS

[purgecss-webpack-plugin](https://link.juejin.cn/?target=https%3A%2F%2Fwww.purgecss.cn%2Fplugins%2Fwebpack.html%23%E7%94%A8%E6%B3%95) 会单独提取 CSS 并清除用不到的 CSS

1. 安装插件

```bash
$ npm i -D purgecss-webpack-plugin
```

2. 添加配置

```js
// ...
const PurgecssWebpackPlugin = require('purgecss-webpack-plugin')
const glob = require('glob'); // 文件匹配模式
// ...

function resolve(dir){
  return path.join(__dirname, dir);
}

const PATHS = {
  src: resolve('src')
}

const config = {
  plugins:[ // 配置插件
    // ...
    new PurgecssPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`, {nodir: true})
    }),
  ]
}

```



#### 2.4 Tree-shaking

Tree-shaking 作用是剔除没有使用的代码，以降低包的体积

- webpack 默认支持，需要在 .bablerc 里面设置 `model：false`，即可在生产环境下默认开启

```js
module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        module: false,
        useBuiltIns: "entry",
        corejs: "3.9.1",
        targets: {
          chrome: "58",
          ie: "11",
        },
      },
    ],
  ],
  plugins: [    
    ["@babel/plugin-proposal-decorators", { legacy: true }],
    ["@babel/plugin-proposal-class-properties", { loose: true }],
  ]
};
```



### 3. 优化运行时体验

运行时优化的核心就是提升首屏的加载速度，主要的方式就是

- 降低首屏加载文件体积，首屏不需要的文件进行预加载或者按需加载

#### 3.1 入口点分割

配置多个打包入口，多页打包，这里不过多介绍

#### 3.2 splitChunks 分包配置

optimization.splitChunks 是基于 [SplitChunksPlugin](https://link.juejin.cn/?target=https%3A%2F%2Fwebpack.docschina.org%2Fplugins%2Fsplit-chunks-plugin%2F) 插件实现的

默认情况下，它只会影响到按需加载的 chunks，因为修改 initial chunks 会影响到项目的 HTML 文件中的脚本标签。

webpack 将根据以下条件自动拆分 chunks：

- 新的 chunk 可以被共享，或者模块来自于 `node_modules` 文件夹
- 新的 chunk 体积大于 20kb（在进行 min+gz 之前的体积）
- 当按需加载 chunks 时，并行请求的最大数量小于或等于 30
- 当加载初始化页面时，并发请求的最大数量小于或等于 30

1. 默认配置介绍

```js
module.exports = {
  //...
  optimization: {
    splitChunks: {
      chunks: 'async', // 有效值为 `all`，`async` 和 `initial`
      minSize: 20000, // 生成 chunk 的最小体积（≈ 20kb)
      minRemainingSize: 0, // 确保拆分后剩余的最小 chunk 体积超过限制来避免大小为零的模块
      minChunks: 1, // 拆分前必须共享模块的最小 chunks 数。
      maxAsyncRequests: 30, // 最大的按需(异步)加载次数
      maxInitialRequests: 30, // 打包后的入口文件加载时，还能同时加载js文件的数量（包括入口文件）
      enforceSizeThreshold: 50000,
      cacheGroups: { // 配置提取模块的方案
        defaultVendors: {
          test: /[\/]node_modules[\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
};
```

2. 项目中的使用

```js
const config = {
  //...
  optimization: {
    splitChunks: {
      cacheGroups: { // 配置提取模块的方案
        default: false,
        styles: {
            name: 'styles',
            test: /\.(s?css|less|sass)$/,
            chunks: 'all',
            enforce: true,
            priority: 10,
          },
          common: {
            name: 'chunk-common',
            chunks: 'all',
            minChunks: 2,
            maxInitialRequests: 5,
            minSize: 0,
            priority: 1,
            enforce: true,
            reuseExistingChunk: true,
          },
          vendors: {
            name: 'chunk-vendors',
            test: /[\\/]node_modules[\\/]/,
            chunks: 'all',
            priority: 2,
            enforce: true,
            reuseExistingChunk: true,
          },
         // ... 根据不同项目再细化拆分内容
      },
    },
  },
}
```

#### 3.3 代码懒加载

针对首屏加载不太需要的一些资源，我们可以通过懒加载的方式去实现，下面看一个小🌰

- 需求：点击图片给图片加一个描述

**1. 新建图片描述信息**

```js
const ele = document.createElement('div')
ele.innerHTML = '我是图片描述'
module.exports = ele
```

**2. 点击图片引入描述**

```js
import './main.css';
import './sass.scss'
import logo from '../public/avatar.png'

import '@/fonts/iconfont.css'

const a = 'Hello ITEM'
console.log(a)

const img = new Image()
img.src = logo

document.getElementById('imgBox').appendChild(img)

// 按需加载
img.addEventListener('click', () => {
  import('./desc').then(({ default: element }) => {
    console.log(element)
    document.body.appendChild(element)
  })
})
```



#### 3.4 prefetch 与 preload

上面我们使用异步加载的方式引入图片的描述，但是如果需要异步加载的文件比较大时，在点击的时候去加载也会影响到我们的体验，这个时候我们就可以考虑使用 prefetch 来进行预拉取

##### 3.4.1 prefetch

- **prefetch** (预获取)：浏览器空闲的时候进行资源的拉取

改造一下上面的代码

```js
// 按需加载
img.addEventListener('click', () => {
  import( /* webpackPrefetch: true */ './desc').then(({ default: element }) => {
    console.log(element)
    document.body.appendChild(element)
  })
})
```

##### 3.4.2 preload

- **preload** (预加载)：提前加载后面会用到的关键资源
- ⚠️ 因为会提前拉取资源，如果不是特殊需要，谨慎使用

网示例：

```js
import(/* webpackPreload: true */ 'ChartingLibrary');
```

