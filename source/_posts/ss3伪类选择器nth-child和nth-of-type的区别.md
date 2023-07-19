title: css3伪类选择器nth-child和nth-of-type的区别
author: 熊 超
tags:
  - css
  - 伪类选择器
categories:
  - javascript
date: 2017-06-10 16:35:00
---
---
<!-- more -->


### 使用误区

之前在做项目时一直是:nth-child和:nth-of-type混着用，第一个不行就用第二个，当时就觉得能实现效果就行，后来这样的情况遇到多了，每次用的时候就感觉效果是试出来的，特别浪费时间，现在就来研究一下这两个用法的区别。


### 1.用法效果相同的情况

#### 示例一：

```HTML
# HTML代码
<div class="main">
  <p>one</p>
  <p>two</p>
  <p>three</p>
</div>

```

要实现的效果：将two变红

>* nth-child()的方式:

```CSS
# CSS
p:nth-child(2){color:red;}

```

>* nth-of-type()的方式:

```CSS
# CSS
p:nth-of-type(2){color:red;}

```

效果：
![mark](http://xiongcao.github.io/images/blogs/170610/hl1lJccBCj.png?imageslim)

在同辈元素都相同的情况下两个用法效果一样

### 2.用法相同效果不同的情况

#### 示例二：

```HTML
# HTML代码
<div class="main">
  <p>one</p>
  <div>div</div>
  <p>two</p>
  <p>three</p>
</div>

```
要实现的效果：同样将two变红

>* 先看nth-of-type()的方式:

```CSS
# CSS
p:nth-of-type(2){color:red;}

```
效果：
![mark](http://xiongcao.github.io/images/blogs/170610/5kG378GEBE.png?imageslim)

>* 再来看nth-child()的方式:

```CSS
# CSS
p:nth-child(2){color:red;}

```
效果：
![mark](http://xiongcao.github.io/images/blogs/170610/h346LeKK59.png?imageslim)

### 3.用法不同效果相同的情况

#### 示例三：

```HTML
# HTML代码
<div class="main">
  <p>one</p>
  <div>div</div>
  <p>two</p>
  <p>three</p>
</div>

```
要实现的效果：同样将two变红

>* 先看nth-of-type()的方式:

```CSS
# CSS
p:nth-of-type(2){color:red;}

```

>* 再来看nth-child()的方式:

```CSS
# CSS
p:nth-child(3){color:red;}

```

效果：
![mark](http://xiongcao.github.io/images/blogs/170610/5kG378GEBE.png?imageslim)


### 用法总结
从以上三个示例可以看出：
- 1.在所有子元素都相同的情况下，两种用法效果相同；
- 2.在子元素不同的情况下，:nth-of-type选择的是相同（同种元素）元素中的第几个，而:nth-child选择的其父辈元素下面的第几个子元素；