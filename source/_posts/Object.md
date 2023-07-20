title: ES6-Object的新增方法
author: 熊 超
tags:
  - ES6
categories:
  - ES6
date: 2020-09-12 13:15:00
---
<!--more-->


## 1、新增方法



### 1.1.Object.is();

等价于严格相等（===）

```js
+0 === -0 //true
NaN === NaN // false

Object.is(+0, -0) // false
Object.is(NaN, NaN) // true
```

### 1.2.Object.assign();

拷贝对象，浅拷贝

```js
const target = { a: 1 };

const source1 = { b: 2 };
const source2 = { c: 3 };

const res = Object.assign(target, source1, source2);
// target => {a:1, b:2, c:3}

res === target; // true
```

### 1.3.Object.getOwnPropertyDescriptors();

ES5 的`Object.getOwnPropertyDescriptor()`方法会返回某个对象属性的描述对象（descriptor）

ES6 的`Object.getOwnPropertyDescriptors()`方法，返回指定对象所有自身属性（非继承属性）的描述对象。

```js
// 实现拷贝 get/set方法
const source = {
  set foo(value) {
    console.log(value);
  }
};

const target2 = {};
Object.defineProperties(
    target2, 
    Object.getOwnPropertyDescriptors(source)
);
Object.getOwnPropertyDescriptor(target2, 'foo')

// { get: undefined,
//   set: [Function: set foo],
//   enumerable: true,
//   configurable: true }


// 实现继承
const obj = Object.create(
  prot,
  Object.getOwnPropertyDescriptors({
    foo: 123,
  })
);
```

### 1.4.Object.create();

一个对象继承另一个对象，另一个对象作为该对象的原型；

```js
// es5 的写法
const obj = {
  method: function() { ... }
};
obj.__proto__ = someOtherObj;

// es6 的写法
var obj = Object.create(someOtherObj);
obj.method = function() { ... };
```

### 1.5.Object.setPrototypeOf();

设置对象的原型

`Object.setPrototypeOf`方法的作用与`__proto__`相同，用来设置一个对象的原型对象（prototype），返回参数对象本身

```js
// 格式
Object.setPrototypeOf(object, prototype)

// 例子
let proto = {};
let obj = { x: 10 };
Object.setPrototypeOf(obj, proto);

proto.y = 20;
proto.z = 40;

obj.x // 10
obj.y // 20
obj.z // 40
```

### 1.6.Object.getPrototypeOf();

读取对象的原型对象

```js
Object.tetPrototypeOf(obj) === obj.__proto__

Object.getPrototypeOf(1) === Number.prototype // true
Object.getPrototypeOf('foo') === String.prototype // true
Object.getPrototypeOf(true) === Boolean.prototype // true
```

### 1.7.Object.keys();

### 1.8.Object.values();

### 1.9.Object.entries();

1.用途是遍历对象的属性

```js
let obj = { one: 1, two: 2 };
for (let [k, v] of Object.entries(obj)) {
  console.log(
    `${JSON.stringify(k)}: ${JSON.stringify(v)}`
  );
}
// "one": 1
// "two": 2
```

2.将对象转为真正的`Map`结构。

```js
const obj = { foo: 'bar', baz: 42 };
const map = new Map(Object.entries(obj));
map // Map { foo: "bar", baz: 42 }
```

### 1.10.Object.hasOwn();

对象实例有一个`hasOwnProperty()`方法，可以判断某个属性是否为原生属性。

ES2022 在`Object`对象上面新增了一个静态方法[`Object.hasOwn()`](https://github.com/tc39/proposal-accessible-object-hasownproperty)，也可以判断是否为自身的属性

```js
const foo = Object.create({ a: 123 });
foo.b = 456;

Object.hasOwn(foo, 'a') // false
Object.hasOwn(foo, 'b') // true
```

`Object.hasOwn()`的一个好处是，对于不继承`Object.prototype`的对象不会报错，而`hasOwnProperty()`是会报错的。

```js
const obj = Object.create(null);

obj.hasOwnProperty('foo') // 报错
Object.hasOwn(obj, 'foo') // false
```

### 1.11.Object.fromEntries();

`Object.fromEntries()`方法是`Object.entries()`的逆操作，用于将一个键值对数组转为对象。

```js
Object.fromEntries([
  ['foo', 'bar'],
  ['baz', 42]
])
// { foo: "bar", baz: 42 }
```

主要目的，是将键值对的数据结构还原为对象，因此特别适合将 Map 结构转为对象。

```js
const entries = new Map([
  ['foo', 'bar'],
  ['baz', 42]
]);
```

### 



## 2.preventExtensions、seal、freeze



### 2.1 Object.preventExtensions()

`Object.preventExtensions()`是防止对象新增属性，也防止对象的原型被重新赋值。

```js
const o1 = { a: 1 }

Object.preventExtensions(o1);
o1.a = 111;	// o1:{ a = 111 }
o1.b = 222; // o1:{ a = 111 }
delete o1.a;	// true o1:{ }
```



### 2.2 Object.seal()

`bject.seal`的效果相当于： 在`Object.defineProperty`时将`configurable`设置成`false`，同时对对象调用`Object.preventExtensions`。但是原有的属性值是可以修改的。

```js
const o1 = { a: 1 }

Object.seal(o1);

Object.getOwnPropertyDescriptors(o1); 
// a: {value: 1, writable: true, enumerable: true, configurable: false}

o1.a = 111;	// o1:{ a = 111 }
o1.b = 222; // o1:{ a = 111 }
delete o1.a;	// false o1:{ a = 111 }
```



### 2.3 Object.freeze()

`Object.freeze`是在`Object.seal`的基础上再防止属性值被修改，将属性都变成 只读型（Readonly）。

```js
const o1 = { a: 1 }

Object.freeze(o1);

Object.getOwnPropertyDescriptors(o1); 
// a: {value: 1, writable: false, enumerable: true, configurable: false}

o1.a = 111;	// o1:{ a = 1 }
o1.b = 222; // o1:{ a = 1 }
delete o1.a;	// false o1:{ a = 1 }
```



总结：

- ==`Object.preventExtensions()`：可以修改、删除，不能新增；==
- ==`Object.seal()`：可以修改，不能删除、新增；==
- ==`Object.freeze()`：不能修改、删除、新增；==
