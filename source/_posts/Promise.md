title: ES6-Promise的方法比较
author: 熊 超
tags:
  - ES6
categories:
  - 源码
date: 2020-09-27 13:15:00
---
<!--more-->

### 1.Promise.all()

`Promise.all()`方法用于将多个 Promise 实例，包装成一个新的 Promise 实例。

```js
const p = Promise.all([p1, p2, p3]);
```

- 只有`p1`、`p2`、`p3`的状态都变成`fulfilled`，`p`的状态才会变成`fulfilled`。此时`p1`、`p2`、`p3`的返回值组成一个数组，传递给`p`的回调函数。
- 只要`p1`、`p2`、`p3`之中有一个被`rejected`，`p`的状态就变成`rejected`，此时第一个被`reject`的实例的返回值，会传递给`p`的回调函数。

总结：**==必须全部`fulfilled`才返回`fulfilled`的数组，否则返回第一个`rejected`==**。



### 2.Promise.race()

`Promise.race()`方法同样是将多个 Promise 实例，包装成一个新的 Promise 实例。

```javascript
const p = Promise.race([p1, p2, p3]);
```

上面代码中，只要`p1`、`p2`、`p3`之中有一个实例率先改变状态，`p`的状态就跟着改变。那个率先改变的 Promise 实例的返回值，就传递给`p`的回调函数。

总结：**==只返回第一个改变的状态，无乱成功或是失败。==**



### 3.Promise.allSettled()

`Promise.allSettled()`方法接受一个数组作为参数，数组的每个成员都是一个 Promise 对象，并返回一个新的 Promise 对象。

==只有等到参数数组的**所有** Promise 对象都发生状态变更（不管是`fulfilled`还是`rejected`）==，返回的 Promise 对象才会发生状态变更。

```javascript
const promises = [
  fetch('/api-1'),
  fetch('/api-2'),
  fetch('/api-3'),
];

await Promise.allSettled(promises);
removeLoadingIndicator();
```

上面示例中，数组`promises`包含了三个请求，只有等到这三个请求都结束了（不管请求成功还是失败），`removeLoadingIndicator()`才会执行。



### 4.Promise.any()

- 只要参数实例有一个变成`fulfilled`状态，包装实例就会变成`fulfilled`状态；
- 如果所有参数实例都变成`rejected`状态，包装实例就会变成`rejected`状态。

==跟 `Promise.all()` 是完全相反的。==



### Promise的实现原理

```js
function MyPromise(constructor) {
  const that = this;
  this.status = 'pending';  // 定义状态改变前的初始状态
  this.value;  // 定义状态为resolved的时候的状态
  this.reason; // 定义状态为rejected的时候的状态

  function resolev(value) {
    // 两个 === "pending"，保证了状态的改变是不可逆的
    if (that.status === 'pending') {
      that.status = 'resolved';
      that.value = value;
    }
  }

  function reject(reason) {
    if (that.status === 'pending') {
      that.status = 'resolved';
      that.reason = reason;
    }
  }

  // 捕获构造异常
  try {
    constructor(resolev, reject);
  } catch (error) {
    reject(err)
  }
}

MyPromise.prototype.then = function (onFullfilled, onRejected) {
  switch (this.status) {
    case "resolved":
      onFullfilled(this.value);
      break;
    case "rejected":
      onRejected(this.reason)
      break;
  }
}
```

上述就是一个初始版本的myPromise，在myPromise里发生状态改变，然后在相应的then方法里面根据不同的状态可以执行不同的操作。

```js
var p=new myPromise(function(resolve,reject){resolve(1)});
p.then(function(x){console.log(x)})
//输出1
```













