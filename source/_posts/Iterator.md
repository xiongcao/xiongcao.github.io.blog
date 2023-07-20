title: ES6-Iterator
author: 熊 超
tags:
  - ES6
categories:
  - ES6
date: 2020-10-12 13:15:00
---
<!--more-->

## 1、Iterator

一种数据结构只要部署了 Iterator 接口，我们就称这种数据结构是“可遍历的”（iterable）。

原生具备 Iterator 接口的数据结构如下：(==**for...of可以遍历具备iterator的结构**==)

-Array

-Map

-Set

-String

-TypedArray

-函数的 arguments 对象

-NodeList 对象

类似数组的对象调用数组的`Symbol.iterator`方法

```javascript
let iterable = {
  0: 'a',
  1: 'b',
  2: 'c',
  length: 3,
  [Symbol.iterator]: Array.prototype[Symbol.iterator]
}

for (let item of iterable) {
  console.log(item); // 'a', 'b', 'c'
}
```

#### 1.1、调用Iterator的场合

- 数组的解构赋值

- 扩展运算符

- yield* (后面跟的是一个可遍历的结构，它会调用该结构的遍历器接口)

- 其他场合
  
  for...of
  
  Array.form()
  
  Map()、Set()
  
  Promise.all()
  
  Promise.race()

#### 1.2、Array.form()方法用于将两类对象转为真正的数组:

- 类似数组的对象;

- Iterator对象





## 2、Generator函数

#### 2.1、yield表达式

由于 Generator 函数返回的遍历器对象，只有调用`next`方法才会遍历下一个内部状态，所以其实提供了一种可以暂停执行的函数。`yield`表达式就是暂停标志。

遍历器对象的`next`方法的运行逻辑如下。

（1）==遇到`yield`表达式，就暂停执行后面的操作==，并将紧跟在`yield`==后面的那个表达式的值==，作为返回的对象的`value`属性值。

（2）下一次调用`next`方法时，再继续往下执行，直到遇到下一个`yield`表达式。

（3）如果没有再遇到新的`yield`表达式，就一直运行到函数结束，直到`return`语句为止，并将`return`语句后面的表达式的值，作为返回的对象的`value`属性值。

（4）如果该函数没有`return`语句，则返回的对象的`value`属性值为`undefined`。

```javascript
function* helloWorldGenerator() {
  yield 'hello';
  yield 'world';
  return 'ending';
}

var hw = helloWorldGenerator();
hw.next()
// { value: 'hello', done: false }

hw.next()
// { value: 'world', done: false }

hw.next()
// { value: 'ending', done: true }

hw.next()
// { value: undefined, done: true }
```



#### 2.2、与 Iterator 接口的关系

```javascript
var myIterable = {};
myIterable[Symbol.iterator] = function* () {
  yield 1;
  yield 2;
  yield 3;
};

[...myIterable] // [1, 2, 3]
```



#### 2.3、next参数

`yield`表达式本身没有返回值，或者说总是返回`undefined`。

`next`方法可以带一个参数，该==参数就会被当作上一个`yield`表达式的返回值==。

```javascript
function* foo(x) {
  var y = 2 * (yield (x + 1));
  var z = yield (y / 3);
  return (x + y + z);
}

var a = foo(5);
a.next() // Object{value:6, done:false}
a.next() // Object{value:NaN, done:false}
a.next() // Object{value:NaN, done:true}

var b = foo(5);
b.next() // { value:6, done:false }
b.next(12) // { value:8, done:false }
b.next(13) // { value:42, done:true }
```



#### 2.4、for...of

```javascript
function* foo() {
  yield 1;
  yield 2;
  yield 3;
  yield 4;
  yield 5;
  return 6;
}

for (let v of foo()) {
  console.log(v);
}
// 1 2 3 4 5
```

这里需要注意，一旦`next`方法的返回对象的`done`属性为`true`，`for...of`循环就会中止，且不包含该返回对象，所以上面代码的`return`语句返回的`6`，不包括在`for...of`循环之中。







