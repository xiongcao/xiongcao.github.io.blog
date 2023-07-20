title: CommonJS, AMD, CMD
author: 熊 超
tags:
  - JS
categories:
  - JS
date: 2020-11-11 13:15:00
---
<!--more-->

### 1、异同对比

| 名称      | AMD                                  | CMD                            | CommonJs | ES6                                       |
| --------- | ------------------------------------ | ------------------------------ | -------- | ----------------------------------------- |
| 全称      | Asynchronous <br />Module Definition | Common Module <br />Definition | CommonJs | ECMAScript6.0                             |
| 同步/异步 | 异步                                 | 异步                           | 同步     | 同步 / 异步<br />取决于采用什么loader API |
| 实现实例  | RequireJs                            | Seajs                          | NodeJS   | JavaScript                                |
| 运行环境  | 浏览器                               | 浏览器                         | 服务端   | 浏览器/服务端                             |



### 2、详细说明

#### 2.1 AMD

`AMD` 是 **RequireJS** 在推广过程中对模块定义的规范化产出。

**注意：**

- `require([ ],callback)` 首先异步加载数组内的模块，随后才会去执行`callback`;

```js

require(['jquery', 'math', 'getStyle'], function($, math, getStyle){
  // ...
})
```

`require()` 异步加载`moduleA`，`moduleB`，`moduleC`，浏览器不会失去响应;

它指定的回调函数，只有前面的模块都加载成功后，才会运行，解决了依赖性的问题。



#### 2.2 CMD

`CMD` 是 `SeaJS` 在推广过程中对模块定义的规范化产出。

**CMD与AMD的区别：**

- ==对于依赖的模块，AMD是提前执行，CMD是延迟执行。（不过RequireJS从2.0开始，也改成可以延迟执行）==
- ==AMD推崇依赖前置，CMD推崇依赖就近。==

```js
// AMD
define(['./a', './b'], function(a, b) {
	// 依赖一开始就写好
  a.test();
  b.test();
})

// CMD
define(function(require, exports, module) {
  // 依赖可以就近书写
  var a = require('./a')
})
```



#### 2.3 CommonJS

在模块中，通过require()方法来引入外部的模块。

上下文提供了**`exports` 对象**导出当前模块的方法和变量， 并且它是唯一导出的出口。

在模块中还存在一个**module对象**，它**代表模块自身**，而`exports`是`module`的属性。

```javascript
// lib.js
var counter = 3;
function incCounter() {
  counter++;
}
module.exports = {
  counter,
  incCounter
};

```

```javascript
// main.js
var mod = require('./lib');

console.log(mod.counter);  // 3
mod.incCounter();
console.log(mod.counter); // 3
```



与 **`ES6`** 模块的差异：它们有三个重大差异。

- `CommonJS` 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
- `CommonJS` 模块是运行时加载，ES6 模块是编译时输出接口。
- `CommonJS` 模块的`require()`是同步加载模块，ES6 模块的`import`命令是异步加载，有一个独立的模块依赖的解析阶段。

==第二个差异==是因为 `CommonJS` 加载的是一个对象（即`module.exports`属性），该对象只有在脚本运行完才会生成。

而 `ES6` 模块不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成。

