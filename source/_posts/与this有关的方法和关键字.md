
title: 重写与this有关的方法和关键字
author: 熊 超
tags:
  - 原理
categories:
  - 源码
date: 2021-10-8 13:15:00
---
<!--more-->


## call/apply/bind/typeof/new/instanceof 的实现



### 1.call/apply/bind

#### 方法的调用：

```js
// call
fn.call(obj, param1, param2, ...param3)

// apply
fn.apply(obj, [param1, param2, ...param3])

// bind
fn.bind(obj, param1, param2)(...param3);
```



#### call方法的实现

##### 先看看call方法的具体调用案例

1. 第一个参数为`null/undefined`时， this 指向 `window`

```js
function test() {
  console.log(this) // window
}
test.call();
```

2. 第一个参数为`bool/number/string` 类型时，this 指向 对应的**包装类**

```js
function test() {
  console.log(this) // Number {1} 
}
test.call(1);

function test() {
  console.log(this) // String {'1'}
}
test.call('1');

function test() {
  console.log(this) // Boolean {false}
}
test.call(false);
```

3. 被调用的函数，会有一个返回值。并且内部的 `this` 指向第一个参数

```js
function test(a) {
  return a + this.name
}

const obj = {
  name: 'JS'
}
const res = test.call(obj, 'Hello ');
console.log(res) // 'Hello JS'
```



##### 实现思路：

1. 判断是否有第一个参数，有则使用对象进行包装，否则为`window`。
2. 原方法内部的 `this` 要指向 当前传入的 第一个参数。
   1. 特性：谁调用方法，方法内部的 `this` 就指向谁；this => 原方法
   1. 使用一个变量，保存this，以便后面调用它
3. 将重写 `call` 方法的 `arguments` 参数 传入到 原方法中，并执行该方法。
   1. 利用evel方法执行；
4. 最后将执行结果返回。



##### 最终代码：

```js
Function.prototype.myCall = function(ctx) {
  // 如果第一个参数为空，this指向window，否则指向该参数对象
  ctx = ctx ? Object(ctx) : window;
  // 依据：谁调用方法，方法内部的 this 就指向谁；
  // this 就是call 方法的调用者，赋值给一个变量，以便后面调用它
  ctx['originFn'] = this;
  
  const args = [] // => ['arguments[1]', 'arguments[2]']
  for (let i = 1; i < arguments.length; i++) {
    args.push('arguments[' + i + ']')
  }
  // 执行 ctx.fn，传入参数，并接收函数返回值
  // => ctx['originFn']('arguments[1]', 'arguments[2]')
  let res = eval("ctx.originFn(" + args + ")") 
  delete ctx.originFn;
  return res;
}
```



#### apply 方法的实现



##### 与call方法高度相似，但有一下几点区别：

1. 如果第二个参数为`object/function/null/undefined`，则`arguments.length = 0`
2. 第二个参数为`string/number/boolean`类型，会报错: `Uncaught TypeError: CreateListFromArrayLike called on non-object`
3. 只取第二个参数，且必须为数组



##### 实现思路：

1. 判断是否有第一个参数，有则使用对象进行包装，否则为`window`。
2. 原方法内部的 `this` 要指向 当前传入的 第一个参数。
   1. 特性：谁调用方法，方法内部的 `this` 就指向谁；this => 原方法
   2. 使用一个变量，保存this，以便后面调用它

3. 判断第二个参数的类型，如果不是数组则做一下处理：
   1. `string/number/boolean`，则抛出异常。
   2. `object/function/null/undefined`， 执行原始方法并返回结果，结束执行。
4. 将重写 `apply` 方法的 `arguments` 参数 传入到 原方法中，并执行该方法。
   1. 利用evel方法执行；
5. 利用evel方法执行；



##### 最终代码：

```js
function typeOf (value) {
  if(value) {
    const key = ({}).toString.call(value);
    const res = {
      '[object String]': 'String',
      '[object Number]': 'Number',
      '[object Boolean]': 'Boolean',
      '[object Object]': 'Object',
      '[object Array]': 'Array',
      '[object Function]': 'Function',
    }
    return res[key];
  } else {
    return typeof value;
  }
}

Function.prototype.myApply = function (ctx, args) {
  // 如果第一个参数为空，this指向window，否则指向该参数对象
  ctx = ctx ? Object(ctx) : window;
  
  // 依据：谁调用方法，方法内部的 this 就指向谁；
  // this 就是apply 方法的调用者，赋值给一个变量，以便后面调用它
  ctx.originFn = this;
	
  // 参数为字符串、数字、bool类型时报错
  if (
    	(typeof args === 'string') || 
      (typeof args === 'number') || 
      (typeof args === 'boolean')
     ) {
    throw TypeError('CreateListFromArrayLike called on non-object')
  }
  
  // 参数为空、或者不为Array类型时，直接执行方法并返回结果
  if (!args || typeOf(args) !== 'Array') {
    const res = ctx.originFn();
    delete ctx.originFn
    return res;
  }

  const tempArgs = []; // ['args1', 'args2']
  for (let i = 0; i < args.length; i++) {
    tempArgs.push('args[' + i + ']');
  }
  const res = eval('ctx.originFn(' + tempArgs + ')');
  delete ctx.originFn;
  return res;
}
```



#### bind 方法的实现

##### 特点：

1. fn.bind()方法返回一个新函数，且fn方法不执行；
2. bind方法接收一部分参数，返回的新函数接收一部分参数；
3. 返回的新函数 `newFn` 的 `this` 指向 `bind(obj) `传递的对象
4. 实例化返回的新函数，this 指向原函数fn构造出来的新实例
5. 实例应该继承fn构造函数函数上的原型



##### 最终代码：

```js
Function.prototype.myBind = function(thisObj) {
  let firstFn = this; // 保存test方法的实例
  let args = [].slice.call(arguments, 1); // 获取第一个方法的参数，去掉第0个位置的参数

  // 返回一个新的函数
  let newFn = function () {
    // 获取第二个方法的参数，并与第一个方法的参数合并
    let newArgs = [].slice.call(arguments);

    // 运行第一个函数。如果新函数经过实例化，this指向新函数的实例对象；否则this指向第一个方法传递的对象（thisObj）
    return firstFn.apply(this instanceof newFn ? this : thisObj, args.concat(newArgs));
  }

  // 将第一个方法的原型 复制 给实例化对象，_tmpFn相当原型的中介
  let _tmpFn = function () {}
  _tmpFn.prototype = this.prototype;
  newFn.prototype = new _tmpFn();

  return newFn;
}

function test(user, car) {
  console.log(user + '买了一辆' + car);
  console.log(this, arguments);
}

test.prototype.color = '红色'

console.log('=== myBind ===');
let T = test.myBind(obj2, '张三');
let newTest = new T('玛莎拉蒂');
console.log(newTest.color);
```



### 2.typeof 关键字

#### typeof的限制

总共只有6中，ES6之后有symbol

```js
typeof 'a' 					// 'string'
typeof 1						// 'number'
typeof true					// 'boolean'
typeof undefined		// 'undefined'
typeof {}						// 'object'
typeof null					// 'object'
typeof new RegExp()	// 'object'
typeof []						// 'object'
typeof function(){} // 'function'
```



#### 最终代码

```js
function typeOf (value) {
  if(value) {
    const key = ({}).toString.call(value);
    const res = {
      '[object String]': 'String',
      '[object Number]': 'Number',
      '[object Boolean]': 'Boolean',
      '[object Object]': 'Object',
      '[object Array]': 'Array',
      '[object Function]': 'Function',
      '[object Null]': 'Null',
      '[object Undefined]': 'Undefined',
      '[object RegExp]': 'RegExp',
      '[object Date]': 'Date',
    }
    return res[key];
  } else {
    return typeof value;
  }
}
```





### 3.new 关键字

##### 构造函数的特点：

1. 未实例化时，构造方法内部的this为 undefined（非严格模式为window）；
2. 实例化之后，构造方法内部的this 是一个空对象；
3. 实例化之后，构造方法内部的this的prototy 指向 构造函数的 prototype；
4. 实例化之后，会接收构造方法的返回值。

```js
// 1.未实例化时，构造方法内部的this为 undefined(非严格模式为window)
function Test() {
  console.log(this)
}
Test() // undefined

// 2.实例化之后，构造方法内部的this 是一个空对象 
new Test() // Test {}

```

```js
// 3.实例化之后，构造方法内部的this的proto 指向 构造函数的 prototype
Test.prototype.add = function () {
  return this.a + this.b;
}
function Test() {
  console.log(this)
}
new Test()
```

下图为上述的输出结果：

<img src="/Users/xiongchao/Library/Application Support/typora-user-images/image-20230316151921726.png" alt="image-20230316151921726" style="zoom:50%;" align="left"/>



##### 最终代码：

```js
function myNew () {
  // 第一个参数为构造函数
  const constructor = [].shift.call(arguments);
  // 实例化之后，构造方法内部的this 是一个空对象；
  const _this = {};

  // 构造方法内部的 this 的 proto 指向 构造函数的 prototype
  Object.setPrototypeOf(_this, constructor.prototype);
	
  //执行构造函数，并传入参数
  const res = constructor.apply(_this, arguments);

  return typeOf(res) === 'Object' ? res : _this;
}

const test = myNew(Test, 1, 2);
test.add();
```



### 4.instanceof

```js
target instanceof Type
```

#### 特点:

1. 判定 target 是否是 Type的实例
2. target 的原型 是否继承自 Type



#### 最终代码：

```js
function instanceOf(target, type) {
  type = type.prototype;
  // target = target.__proto__
  target = Object.getPrototypeOf(target)

  while (true) {
    if (target === null) return false;
    if (target === type) return true;
    target = Object.getPrototypeOf(target)
  }
}

[] instanceof Array 		// true
instanceOf([], Array)		// true

[] instanceof Object		// true
instanceOf([], Object)	// true

```











