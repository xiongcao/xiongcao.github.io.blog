title: ES6-Class解析
author: 熊 超
tags:
  - ES6
categories:
  - ES6
date: 2020-10-27 13:15:00
---
<!--more-->

### 1.实例和原型：

- ==实例属性现在除了可以定义在`constructor()`方法里面的`this`上面，也可以定义在`类内部的最顶层`。==
- ==类的方法，是定义在原型上的；==

```js
class Point {
 	count = 0;
  
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  
  increment() {
    this.count++;
  }

  toString() {
    return '(' + this.x + ', ' + this.y + ')';
  }
  
}

var point = new Point(2, 3);

point.toString() // (2, 3)

point.hasOwnProperty('x') // true
point.hasOwnProperty('y') // true
point.hasOwnProperty('count') // true
point.hasOwnProperty('toString') // false
point.__proto__.hasOwnProperty('toString') // true
```



### 2.getter和setter

与 ES5 一样，在“类”的内部可以使用`get`和`set`关键字，对某个属性设置存值函数和取值函数，拦截该属性的存取行为。

```javascript
class MyClass {
  constructor() {
    // ...
  }
  get prop() {
    return 'getter';
  }
  set prop(value) {
    console.log('setter: '+value);
  }
}

let inst = new MyClass();

inst.prop = 123;	// setter: 123
inst.prop; // 'getter'
```



### 3.静态方法和属性

#### 3.1 方法

类相当于实例的原型，所有在类中定义的方法，都会被实例继承。

如果在一个方法前，加上`static`关键字，就表示该方法==不会被实例继承==，而是直接通过==类来调用==，这就称为“静态方法”。

```javascript
class Foo {
  static classMethod() {
    return 'hello';
  }
}

Foo.classMethod() // 'hello'

var foo = new Foo();
foo.classMethod(); // TypeError: foo.classMethod is not a function
```

父类的静态方法，可以==被子类继承==。

```javascript
class Foo {
  static classMethod() {
    return 'hello';
  }
}

class Bar extends Foo {
}

Bar.classMethod() // 'hello'
```



#### 3.2 属性

静态属性指的是 Class 本身的属性，即`Class.propName`，而不是定义在实例对象（`this`）上的属性。

```javascript
// 老写法
class Foo {
  // ...
}
Foo.prop = 1;

// 新写法
class Foo {
  static prop = 1;
}
```



### 4.私有属性和方法

[ES2022](https://github.com/tc39/proposal-class-fields)正式为`class`添加了私有属性，方法是在属性名之前使用`#`表示。

```javascript
class IncreasingCounter {
  #count = 0;
  get value() {
    console.log('Getting the current value!');
    return this.#count;
  }
  #increment() {
    this.#count++;
  }
}

const counter = new IncreasingCounter();
counter.#count // 报错
counter.#count = 42 // 报错
```

私有属性，只能在类的内部使用（`this.#count`）。如果在类的外部使用，就会报错。



### 5.this指向

类的方法内部如果含有`this`，它==默认指向类的实例==。

但是，必须非常小心，一旦单独使用该方法，很可能报错。

```javascript
class Logger {
  printName(name = 'there') {
    this.print(`Hello ${name}`);
  }

  print(text) {
    console.log(text);
  }
}

const logger = new Logger();
const { printName } = logger;
printName(); // TypeError: Cannot read property 'print' of undefined
```

上面代码中，如果将`printName`方法提取出来单独使用，`this`会指向该方法运行时所在的环境（由于 class 内部是严格模式，所以 this 实际指向的是`undefined`），从而导致找不到`print`方法而报错。



一个比较简单的解决方法是，在==构造方法中绑定`this`==，这样就不会找不到`print`方法了。

```javascript
class Logger {
  constructor() {
    this.printName = this.printName.bind(this);
  }

  // ...
}
```

另一种解决方法是==使用箭头函数==。

```javascript
class Obj {
  constructor() {
    this.getThis = () => this;
  }
  
  // 或者
  getThis() => {
    return this;
  }
}

const myObj = new Obj();
myObj.getThis() === myObj // true
```

箭头函数内部的`this`总是指向定义时所在的对象。

上面代码中，箭头函数位于构造函数内部，它的定义生效的时候，是在构造函数执行的时候。这时，箭头函数所在的运行环境，肯定是实例对象，所以`this`会总是指向实例对象。
