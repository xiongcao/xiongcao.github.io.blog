title: Jquery Dom元素Index()方法的使用
author: 熊 超
tags:
  - jquery
categories:
  - javascript
keywords: index jquery
date: 2017-06-10 12:30:00
---
------
<!--more-->

### 前言
作为一个做后端java开发的被强行拉到前端组的菜鸟，前端知识略懂皮毛的我对于jquery很多常用方法都有误区，比如我现在要说的jquery DOM元素的index()方法。

### jquery获取元素索引值index()方法使用误区



由于对index()方法理解不是很深，所以在做项目时就遇到了有的页面获取的索引是正常的有的页面获取的索引总是大了2个，然后为了让最后的结果正常我就直接减2，并在后面注释"//这里不知道为什么总是多了2，但其他页面又是正常的"，结果组长偶然一次机会看到了我这个注释就批评我说“哪有人这么写代码的”。唉，糗事就不多说了，以后写代码再也不敢这样了。

### jquery获取元素索引值index()方法作用



#### 用法一：$(select).index();
> * 示例一：

```HTML
# html代码:
<div class="main">
  <div class="box">Milk</div>
  <div class="box">Tea</div>
  <div class="box">Coffee</div>
 </div>
```
```js
# js代码：
$(".box").on("click",function(){
  $(this).index();//结果：如果点击的Milk则返回 0
});

```



这个示例看起来是获取的自己在与自己相同元素中的位置，那么看实例二

> * 示例二：

```HTML
# html代码:
<div class="main">
  <p>Soda</p>
  <div class="box">Milk</div>
  <div class="box">Tea</div>
  <div class="box">Coffee</div>
 </div>
 
```
```JavaScript
# js代码：
$(".box").on("click",function(){
  $(this).index();//结果：如果点击的Milk则返回 1
});

```
从以上两个示例可以看出$(select).index()即使在没有参数的情况下也是相对用法，这个相对用法是相对其父元素中的位置，而不是获取自己在相同元素中的位置

#### 用法二：$(select1).index(select2);
> * 示例：

```HTML
# html代码:
<p class="box">Tea</p>
<div class="main">
  <p>Soda</p>
  <div class="box">Milk</div>
  <div class="box" id="box2">Tea</div>
  <div class="box">Coffee</div>
</div>

```
```js
# js代码:
$(".box").index($("#box2"));//结果: 2

```

通过这个示例可以看出**$(select1).index(select2)**的用法是选择器**select2**相对于选择器**select1**的位置索引，跟同辈元素和其父辈元素都无关。

### 总结

虽然index()的用法比较简单，但是理解不深的话在项目中运用出了问题还是麻烦的，特别是对于我这个前端菜鸟出现果过这种尴尬的事情还是记录下来比较好，以免以后再跳进同一个坑。