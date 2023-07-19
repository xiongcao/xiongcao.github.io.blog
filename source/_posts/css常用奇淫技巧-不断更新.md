title: css常用奇淫技巧(不定期更新)
author: 熊 超
tags:
  - CSS
categories:
  - 前端
date: 2018-08-30 09:43:00
---
<!-- more -->
### 一、常用技巧

#### 清除浮动
1. 添加新的元素 、应用 clear：both; 
2. 父级定义 overflow: auto;
3. 父元素也设置浮动;
4. 使用br标签和其自身的html属性:《br clear="all"/》 clear="all | left | right | none";
5. 最高大上的方法，强烈推荐 parentDom:after{content: " ";display: block;clear: both;}



#### 垂直居中

``` html
<div class="box box1">
  <span>垂直居中</span>
</div>
```
``` css
.box {
  width: 200px;
  height: 200px;
  background: red;
} 
```

##### 方法1：table-cell

``` css 
.box1 {
  display: table-cell;
  vertical-align: middle;
  text-align: center;
}
```
##### 方法2：display:flex（部分低版本浏览器不兼容）

``` css
.box2 {
  display: flex;
  justify-content:center;
  align-items:Center;
}
```

##### 方法3：绝对定位和负边距(已知元素高度)
``` css
.box3 {position:relative;}
.box3 span {
    position: absolute;
    width:100px;
    height: 50px;
    top:50%;
    left:50%;
    margin-left:-50px;
    margin-top:-25px;
    text-align: center;
}
```

##### 方法4：绝对定位和0(已知元素高度)
``` css
.box {position:relative;}

.box4 span {
  width: 50%; 
  height: 50%; 
  background: #000;
  overflow: auto; 
  margin: auto; 
  position: absolute; 
  top: 0; left: 0; bottom: 0; right: 0; 
}
```

##### 方法5：display:flex和margin:auto
``` css
.box5 {
    display: flex;
    text-align: center;
}
.box5 span {margin: auto;}
```

#### 文本超出部分隐藏

##### 单行文本超出部分隐藏
``` css
#ellipsis {
  overflow: hidden;   /*超出的文本隐藏*/
  text-overflow: ellipsis;    /*溢出用省略号显示*/
  white-space: nowrap;    /*溢出不换行*/
}
```

##### 多行文本超出部分隐藏
``` css
#ellipsis {
  overflow: hidden; 
  display: -webkit-box;   /*作为弹性伸缩盒子模型显示*/
  -webkit-box-orient: vertical;   /*设置伸缩盒子的子元素排列方式--从上到下垂直排列*/
  -webkit-line-clamp: 2;   /*显示的行*/
}
```

### 二、形状技巧

##### 三角形

``` css
#triangle1 {
  width: 0;
  height: 0;
  border-top: 50px solid red;
  border-right: 50px solid orange;
  border-bottom: 50px solid yellow;
  border-left: 50px solid green;
}

#triangle2 {
  width: 0;
  height: 0;
  border-top: 50px solid red;
  border-right: 50px solid transparent;
  border-bottom: 50px solid transparent;
  border-left: 50px solid transparent;
}
```
![](http://xiongcao.github.io/images/blogs/201810171448_18.png)

##### 未读数量
``` css
#superscript {
    width: 50px;
    height: 50px;
    background: red;
    padding:0 20px;
    border-radius: 20px;
}
```
![](http://xiongcao.github.io/images/blogs/201810171448_144.png)

##### 字体边框同色
``` css
#app{
    width: 100px;
    height: 100px;
    color: red;
    font-size: 30px;

    /*方案一    CSS3 currentColor 表示当前的文字颜色*/
    /* border: 10px solid currentColor; */
    
    /*方案二    border 的默认值 (initial) 就是 currentColor*/
    border: 10px solid;
  }
```
![](http://xiongcao.github.io/images/blogs/201810171448_736.png)

##### 放大镜
``` css
#div5{
    width: 50px;
    height: 50px;
    border: 5px solid #000000;
    border-radius: 50%;
    position: relative;
}

#div5::after{
    content: ' ';
    display: block;
    width: 8px;
    height: 60px;
    border-radius: 5px;
    background: #000000;
    position: absolute;
    right: -22px;    
    top: 38px;
    transform: rotate(-45deg);
}
```
![](http://xiongcao.github.io/images/blogs/201810171449_641.png)