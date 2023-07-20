title: Sass 和 Less
author: 熊 超
tags:
  - Sass
  - Lessss
categories:
  - CSS
date: 2022-10-11 13:15:00
---
<!--more-->

### Sass

Sass是一种动态样式语言，Sass语法属于缩排语法，比css比多出好些功能(如==变量、嵌套、运算、混入(Mixin)、继承、颜色处理，函数==等)，更容易阅读。

Sass与Scss是什么关系?

Sass的缩排语法，对于写惯css前端的web开发者来说很不直观，也不能将css代码加入到Sass里面，因此==sass语法进行了改良，Sass 3就变成了Scss(sassy css)==。与原来的语法兼容，只是用{}取代了原来的缩进。



### Less

Less也是一种动态样式语言. 受Sass影响较大,对CSS赋予了动态语言的特性，如变量，继承，运算， 函数。==Less 既可以在客户端上运行，也可在服务端运行== (借助 Node.js)。





### Sass/Scss与Less区别

#### 1 编译环境不一样

- Sass的安装需要Ruby环境，是在服务端处理的；
- Less是需要引入less.js来处理Less代码输出css到浏览器，也可以在开发环节使用Less，然后编译成css文件，直接放到项目中



#### 2 变量符不一样

Scss是$，而Less是@

```css
scss-作用域
$color: #00c; /* 蓝色 */
#header {
    $color: #c00; /* red */
    border: 1px solid $color; /* 红色边框 */
}
#footer {
    border: 1px solid $color; /* 蓝色边框 */
}


Less-作用域
@color: #00c; /* 蓝色 */
#header {    
    @color: #c00; /* red */
    border: 1px solid @color; /* 红色边框 */
}
#footer {
    border: 1px solid @color; /* 蓝色边框 */
}
Less-作用域编译后
#header{
    border:1px solid #cc0000;
}
```



#### 3 输出设置

Less没有输出设置，Sass提供4中输出选项：nested, compact, compressed 和 expanded，stylus不知。

输出样式的风格可以有四种选择，默认为nested

- nested：嵌套缩进的css代码
- expanded：展开的多行css代码
- compact：简洁格式的css代码
- compressed：压缩后的css代码



#### 4 处理条件语句

Sass支持条件语句，可以使用if{}else{}，for{}循环等等。

Less的条件语句使用有些另类，他不是我们常见的关键词if和else if之类，而其实现方式是利用关键词“when”



#### 5 引用外部CSS文件

scss引用的外部文件命名必须以_开头

Less引用外部文件和css中的@import没什么差异。

```scss
// 源代码：
@import "_test1.scss";
@import "_test2.scss";
// 编译后：
h1 {
    font-size: 17px;
}
h2 {
    font-size: 17px;
}
```

