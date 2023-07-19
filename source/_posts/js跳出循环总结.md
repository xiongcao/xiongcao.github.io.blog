title: js跳出循环总结
author: 熊 超
tags:
  - Array
  - 循环
categories:
  - javascript
date: 2018-07-31 09:53:00
---
<!--more-->

## 一.跳出一层循环
```js
var arr = ["a", "b",'c','d'];
```
### 结束for循环
```js
for(var i=0;i<arr.length;i++){
  if(i==2){
      break;
  }
  console.log(arr[i],i);
}
console.log('循环外');
```
注意：return 虽说可以结束循环，但是循环体后面的内容也无法执行了

### 结束forEach循环
```js
try {
    arr.forEach((o,i) => {
        if(i==2){
            throw new Error("EndIterative");
        }
        console.log(o,i);
    });
} catch (e) {
    if(e.message!='EndIterative'){
        throw e;
    }
}
console.log('循环体外');
```

注意：return 只能结束本次循环，并不能终止整个循环

### 结束for...in循环
```js
for (var i in arr) {
    if(i==2){
        break;
    }
    console.log(arr[i],i);
}
console.log('循环体外');
```
注意：return 虽说可以结束循环，但是循环体后面的内容也无法执行了

##### 结果：
![mark](http://xiongcao.github.io/images/blogs/201807311448_240.png)

## 二.跳出多层循环
```js
var arr = [["a", "b", "c"],["小红", "小明", "小亮"]];
```
### 正常多层for循环
```js
for (var i = 0; i < arr.length; i++) {
    for (var j = 0; j < arr[i].length; j++) {
        console.log(arr[i][j], '内层');
    }
    console.log(arr[i], "外层");
}
console.log("循环体外");
```
#####结果：
![mark](http://xiongcao.github.io/images/blogs/201808010918_525.png)

### 使用break
```js
for (var i = 0; i < arr.length; i++) {
    for (var j = 0; j < arr[i].length; j++) {
      if(j==i){
          break;
      }
      console.log(arr[i][j], '内层');
    }
    console.log(arr[i], "外层");
}
```
结果： 只跳出了一层循环

![mark](http://xiongcao.github.io/images/blogs/201807311606_181.png)

### 我们可以使用以下方法跳出多层for循环
```js
var flag = false;
for (var i = 0; i < arr.length; i++) {
    for (var j = 0; j < arr[i].length; j++) {
      if(j==1){
          flag = true;
          break;
      }
      console.log(arr[i][j], '内层');
    }
    if(flag){
        break;
    }
    console.log(arr[i], "外层");
}
```
结果： 只执行了一次j=0就结束了循环
![mark](http://xiongcao.github.io/images/blogs/201808010928_686.png)

### 使用return
```js
for (var i = 0; i < arr.length; i++) {
    for (var j = 0; j < arr[i].length; j++) {
      if(j==1){
          return;
      }
      console.log(arr[i][j], '内层');
    }
    console.log(arr[i], "外层");
}
console.log('我在循环体外');
```
结果： 虽然跳出了多层循环，但是循环体后面的内容都没有被执行

![mark](http://xiongcao.github.io/images/blogs/201807311646_81.png)

### 跳出多层forEach循环
```js
try {
    arr.forEach((newArr,i) => {
        newArr.forEach((o,j)=>{
            if(j==1){
                throw new Error("EndIterative");
            }
            console.log(o,'内层')
        });
        console.log(newArr,'外层');
    });
} catch (e) {
    if(e.message!="EndIterative"){
        throw e;
    }
}
console.log('循环体外');
```
结果： 正确跳出了多层循环
![mark](http://xiongcao.github.io/images/blogs/201808010928_686.png)

## 最后总结：
1. break只能在for、for...in循环中使用不能再forEach里面使用，并且break只能跳出单层循环；
2. return 虽然可以终止循环，但是也终止了return之后的所有语句，特别注意：return 不能终止forEach循环，只能结束当前循环。

