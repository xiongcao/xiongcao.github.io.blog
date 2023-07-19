title: js 将对象数组中具有相同值的对象取出组成新的数组
author: 熊 超
tags:
  - js
  - Array
categories:
  - javascript
date: 2018-07-26 14:58:00
---
<!--more-->

### 实现方法：
```js
let arr = [
  {
    "id": 577,
    "name": "艾杜纱 毛孔洁净洗面奶",
    "skuName": "125mL",
    "image": "commodityImage/haZW5gLF.jpg",
    "price": 122.32,
    "store": 327,
    "status": 1,
    "brandId": 18,
    "categoryId": 32
  }, {
    "id": 536,
    "name": "心机彩妆 星魅霓光唇膏",
    "skuName": "BE300",
    "image": "commodityImage/ibg54OOx.jpg",
    "price": 273.65,
    "store": 50,
    "status": 1,
    "brandId": 17,
    "categoryId": 33
  }, {
    "id": 546,
    "name": "心机彩妆 炫眉膏",
    "skuName": "77",
    "image": "commodityImage/356LBmxe.jpg",
    "price": 160.68,
    "store": 20,
    "status": 1,
    "brandId": 17,
    "categoryId": 20
  }
]

console.log(arr,'原始数组');
console.log(sortArr(arr, 'brandId'),'转化后的数组');

/**
* arr 要转化的数组
* key 根据某一键转化
*/
function sortArr(arr, key) {
  let newArr = [],
      tempArr = [],
      temp;

  // 按照特定的参数将数组排序，将具有相同值的排在一起
  arr = arr.sort(function(a, b) {
      let s = a[key],
          t = b[key];

      return s < t ? -1 : 1;
  });
  console.log(arr,"排序之后的数组");

  if ( arr.length ){
      temp = arr[0][key];
  }

  // 将相同类别的对象添加到统一个数组
  for (let i in arr) {
      if ( arr[i][key] === temp ){
          tempArr.push( arr[i] );
      } else {
          temp = arr[i][key];
          newArr.push(tempArr);
          tempArr = [arr[i]];
      }
  }
  // 将最后的内容推出新数组
  newArr.push(tempArr);
  return newArr;
}

```
### 结果：

![](http://xiongcao.github.io/images/blogs/201807271015_408.png)
![](http://xiongcao.github.io/images/blogs/201807271015_241.png)
