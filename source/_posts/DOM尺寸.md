title: DOM尺寸
author: 熊 超
tags:
  - JS
categories:
  - JS
date: 2021-01-23 13:15:00
---
<!--more-->

## 浏览器尺寸的兼容性

### 一、浏览器兼容模式

**怪异模式**和**标准模式**<!DOCTYPE html>

**BackCompat**    **CSS1Compat**

### 二、浏览器窗口可视区域尺寸

IE8及以下：

标准：document.documentElement.clientWidth/clientHeight;

怪异：document.body.clientWidth/clientHeight;

获取可视区域大小：

```js
function getViewportSize() {
  if(window.innerWidth) {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    }
  } else {
    if(document.compatMode === 'BackCompat') {
      return {
        width: document.body.clientWidth,
        height: document.body.clientHeight,
      }
    } else {
      /** 不包含滚动条宽、高 */
      return {
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
      }
    }
  }
}
```

### 三.滚动条距离

![image-20210717171120766](/Users/xiongchao/Library/Application Support/typora-user-images/image-20210717171120766.png)

获取滚动条距离（兼容性处理）：

```js
function getScrollOffset() {
  if(window.pageXOffset){
    return {
            left: window.pageXOffset,
      top: window.pageYOffset,
    }
  } else {
    return {
      left: document.body.scrollLeft + document.documentElement.scrollLeft,
      top: document.body.scrollTop + document.documentElement.scrollTop
    }
  }
}
```

### 四、文档尺寸

文档的真实大小，包括不可见部分。

```js
function getScrollSize() {
  if(document.body.scrollWidth){
    return {
            width: document.body.scrollWidth,
      height: document.body.scrollHeight,
    }
  } else {
    return {
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight
    }
  }
}
```

### 五、盒子外边距

**相对边距**

1、offsetTop/offsetLeft：相对于定位的祖先元素的上/左边距离，如果没有定位的祖先元素，则为距离浏览器窗口的边距；

2、offsetParent：获取该元素最近的有定位的祖先元素，如果没有找到定位的祖先元素，则为body元素；

**绝对边距**

获取盒子距离浏览器左/上的距离。

```js
function getElemDocPosition(el) {
  let parent = el.offsetParent;
  let offsetLeft = el.offsetLeft;
  let offsetTop = el.offsetTop;

  while(parent) {
    offsetLeft += parent.offsetLeft;
    offsetTop += parent.offsetTop;
    parent = parent.offsetParent;
  }

  return {
    left: offsetLeft,
    top: offsetTop
    }
}
```

### 六、操控滚动条

**window.scroll(x, y)**

**window.scrollTo(x, y)**

**window.scrollBy(x, y)**
