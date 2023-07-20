title: 1px的问题
author: 熊 超
tags:
  - CSS
categories:
  - CSS
date: 2020-04-22 13:15:00
---
<!--more-->

### 一、前言

##### 像素：

是组成图片的色彩和亮度的最小图像单元，是显示屏的画面上能表现出来的最小单位。



##### 分辨率

屏幕分辨率是指纵横向上的像素点数，单位是px。

两个大小尺寸相同的屏幕而言：

当屏幕分辨率低时（例如 640 x 480），在屏幕上显示的像素少，单个像素尺寸比较大。

屏幕分辨率高时（例如 1600 x 1200），在屏幕上显示的像素多，单个像素尺寸比较小。



##### 逻辑像素

那么问题出现了：现在各尺寸、分辨率的设备层出不穷，固定尺寸参数的图片，如果设备的分辨率翻了一倍，那么我们的图片在设备上就缩小了一倍。（1CSS像素在屏幕上表现为1设备物理像素，分辨率翻倍，设备的长和宽方向上的像素数量翻了一倍）

值得一提的是，在PC端，1CSS像素仍表现为1物理像素，但是在移动端设备上（包括安卓手机），此后就出现了逻辑像素的概念，1CSS像素在物理上具体的像素值由设备不同的逻辑像素决定。（有点绕）

举个例子: iPhone6的物理像素是750 * 334，逻辑像素是375 * 667, 设备像素比是2，这意味着我们把2 * 2的物理像素当成1 * 1的像素来使用。当我们设置某元素的宽度为10px时，我们实际上是在设置逻辑像素



##### 设备像素比dpr

设备像素比（device pixel ratio），即**设备逻辑像素**与**物理像素**的比值。

常见的有2dpr、3dpr。



### 二、1px问题

如果我们要画一条物理像素为1px的边框，我们可以先通过媒体查询来查询本设备的dpr，那么在像素比为2dpr的设备上，我们在css中要设置`border:0.5px solid red`，这很容易理解，因为css中我们写的是逻辑像素。

如果我们这样实现，在不同浏览器中，实际上展现效果大不相同。

1. chrome：把小于0.5px的当成0，大于等于0.5px的当作1px
2. firefox：会把大于等于0.55px的当作1px
3. safiri:把大于等于0.75px的当作1px 进一步在手机上观察iOS的Chrome会画出0.5px的边，而安卓(5.0)原生浏览器是不行的。所以直接设置0.5px不同浏览器的差异比较大。



我们可以采用 伪元素 + transform 的方式解决该问题：

```css
h1 {
  position: relative;
}

h1:after {
  content: '';
  display: block;
  width: 100%;
  height: 1px;
  position: absolute;
  left: 0;
  bottom: 0;
  background: red;
  transform: scaleY(1);
  transform-origin: 0 0;
}

@media screen and (min-device-pixel-ratio: 2),
(-webkit-min-device-pixel-ratio: 2) {
  h1:after {
    transform: scaleY(0.5);
  }
}

```



### 三、解决办法

#### 1、0.5px

缺点，不兼容，如上面第二点，pc端浏览器处理方式不一致。

所以要使用css媒体查询或js获取设备像素比，进行区分。

```css
div {
  border: 1px solid #bbb;
}

@media screen and (min-device-pixel-ratio: 2),
(-webkit-min-device-pixel-ratio: 2) {
  h1 {
		border-width: 0.5px;
  }
}


```



#### 2、使用border-image实现

还可以使用 border-image 设置一个透明到边框色的线性渐变

```css
.div{
  width: 100px;
  height: 100px;
  margin-top: 20px;
  border-bottom: 1px solid transparent;
  border-image: linear-gradient(to bottom, transparent 50%, red 50%) 0 0 100%/1px 0;
}
```

我们将其中的小方块放大就可以看出， 方块的底部 border 被分成了两部分，上半部是透明的，下半部是红色的。



#### 3、box-shadow 模拟边框

```css
.box-shadow-1px{
    box-shadow: 0px 0.5px 0px 0px #ee2c2c;
}
```

缺点：边框有阴影，颜色浅，同样也有兼容性问题，Safari 不支持 1px 以下的 box-shadow。



#### 4、伪元素 + transform

用媒体查询根据设备像素比用“伪元素+transform”对边框进行缩放。

```css
@media (-webkit-min-device-pixel-ratio:2),(min-device-pixel-ratio:2){
  .border-bt-1px{
    position: relative;
    :before{
      content: '';
      position: absolute;
      left:0;           
      bottom: 0;
      width: 100%;
      height: 1px;
      background: #ee2c2c;
      transform: scaleY(0.5);
    }
  }
}
```

