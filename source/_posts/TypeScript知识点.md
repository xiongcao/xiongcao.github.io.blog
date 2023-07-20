title: TypeScript知识点
author: 熊 超
tags:
  - JS
categories:
  - TS
date: 2021-12-17 16:35:00
---
<!-- more -->


### 访问修饰符有哪些？

`public`：公共的。类的所有成员，其子类以及该类的实例都可以访问；

`protected`： 受保护的。该类及其子类的所有成员都可以访问它们。 但是该类的==实例无法访问==。

`private`：私有的。只有类的成员可以访问它们。



### Declare关键字的作用

`TypeScript`声明文件。我们希望在`TypeScript`文件中使用它们时不会出现编译错误。为此，我们使用declare关键字

当使用第三方库时，我们需要引用它的声明文件，才能获得对应的代码补全、接口提示等功能。

- [`declare var`](https://ts.xcatliu.com/basics/declaration-files.html#declare-var) 声明全局变量
- [`declare function`](https://ts.xcatliu.com/basics/declaration-files.html#declare-function) 声明全局方法
- [`declare class`](https://ts.xcatliu.com/basics/declaration-files.html#declare-class) 声明全局类
- [`declare enum`](https://ts.xcatliu.com/basics/declaration-files.html#declare-enum) 声明全局枚举类型
- [`declare namespace`](https://ts.xcatliu.com/basics/declaration-files.html#declare-namespace) 声明（含有子属性的）全局对象
- [`interface` 和 `type`](https://ts.xcatliu.com/basics/declaration-files.html#interface-和-type) 声明全局类型

假如我们想使用第三方库 jQuery，但是在 ts 中，编译器并不知道 `$` 或 `jQuery` 是什么东西[1](https://github.com/xcatliu/typescript-tutorial/tree/master/examples/declaration-files/01-jquery)：

这时，我们需要使用 `declare var` 来定义它的类型：

```js
declare var jQuery: (selector: string) => any;

jQuery('#foo');
```



### TypeScript中的枚举

枚举是`TypeScipt`数据类型，它允许我们定义一组命名常量。它是相关值的集合，可以是数字值或字符串值。

```js
enum Gender {
  Male,
  Female,
  Other
}
console.log(Gender.Male); // Output: 0

console.log(Gender[1]); // Output: Female
```



### 装饰器

装饰器是一种==特殊类型的声明==，它能过被附加到类声明，方法，属性或者参数上，可以修改类的行为

通俗的来说就是一个方法，可以注入到类，方法，属性参数上来扩展类，属性，方法，参数的功能

**装饰器的分类**: 类装饰器、属性装饰器、方法装饰器、参数装饰器



### never和void的区别？

- void 表示没有任何类型（可以被赋值为 null 和 undefined）
- never 表示一个不包含值的类型，即表示永远不存在的值。
- 拥有 void 返回值类型的函数能正常运行。拥有 never 返回值类型的函数无法正常返回，无法终止，或会抛出异常。



### 类型断言是什么

用来==手动指定一个值具体的类型==，即允许变量从一种类型更改为另一种类型。

```ts
值 as 类型

// 或
<类型>值
```

- 联合类型可以被断言为其中一个类型
- 父类可以被断言为子类
- 任何类型都可以被断言为 any
- any 可以被断言为任何类型
- 要使得 `A` 能够被断言为 `B`，只需要 `A` 兼容 `B` 或 `B` 兼容 `A` 即可



### any和unknown的区别

主要区别：

 unknown 类型会更加严格：在对 unknown 类型的值执行大多数操作之前，我们必须进行某种形式的检查。

在对 any 类型的值执行操作之前，我们不必进行任何检查。

```js
let foo: any = 123;
console.log(foo.msg); // 符合TS的语法
let a_value1: unknown = foo;   // OK
let a_value2: any = foo;      // OK
let a_value3: string = foo;   // OK

let bar: unknown = 222; // OK 
console.log(bar.msg); // Error (不能通过TS语法检测)
let k_value1: unknown = bar;   // OK
let K_value2: any = bar;      // OK
let K_value3: string = bar;   // Error
```

 unknown 类型的值也不能将值赋给 any 和 unknown 之外的类型变量

**总结**: any 和 unknown 都是顶级类型，但是 unknown 更加严格，不像 any 那样不做类型检查，反而 unknown 因为未知性质，不允许访问属性，不允许赋值给其他有明确类型的变量。



### 判断传入参数是否是数组类型

```js
function isArray(x: unknown): boolean {
  if (Array.isArray(x)) {
    return true;
  }
  return false;
}
```



### 类类型接口

- 如果接口用于一个类的话，那么接口会表示“行为的抽象”
- 对类的约束，让类去实现接口，类可以实现多个接口
- 接口只能约束类的公有成员（实例属性/方法），无法约束私有成员、构造函数、静态属性/方法



### 方法重载

方法重载是指在一个类中定义多个同名的方法，但要求每个方法具有不同的参数的类型或参数的个数。

基本上，它在派生类或子类中重新定义了基类方法。

方法覆盖规则：

- 该方法必须与父类中的名称相同。
- 它必须具有与父类相同的参数。
- 必须存在IS-A关系或继承。



### 实现继承

继承是一种从另一个类获取一个类的属性和行为的机制。它是面向对象编程的一个重要方面，并且具有从现有类创建新类的能力，继承成员的类称为基类，继承这些成员的类称为派生类。

继承可以通过使用**extend**关键字来实现。

```js
class Shape {     
  Area:number     
  constructor(area:number) {     
     this.Area = area    
  }     
}     
class Circle extends Shape {     
  display():void {     
     console.log("圆的面积: "+this.Area)     
  }     
}    
var obj = new Circle(320);     
obj.display() 
```



### 泛型

### interface和type的区别

**相同点：**

1. 都可以描述一个对象或者函数
2. 都允许拓展（extends）

```ts
interface User {
  name: string
  age: number
}
interface (name: string, age: number): void;

type User = {
  name: string
  age: number
};
type SetUser = (name: string, age: number)=> void;
```

interface 和 type 都可以拓展，并且两者并不是相互独立的，也就是说 interface 可以 extends type, type 也可以 extends interface 。 虽然效果差不多，但是两者语法不同。



**不同点: **

- type 可以而 interface 不行

  - type 可以声明基本类型别名，联合类型，元组等类型

  - type 语句中还可以使用 typeof 获取实例的类型进行赋值

    ```ts
    // 当你想获取一个变量的类型时，使用 typeof
    let div = document.createElement('div');
    type B = typeof div
    ```

- interface 可以而 type 不行

  - interface 能够声明合并

    ```ts
    interface User {
      name: string
      age: number
    }
    
    interface User {
      sex: string
    }
    
    /*
    User 接口为 {
      name: string
      age: number
      sex: string 
    }
    */
    ```

    

### 检查TS中的null和undefiend

```js
if (x === null) {  
  console.log(name + ' === null');  
}  
if (typeof x === 'undefined') {  
  console.log(name + ' is undefined');  
}  
```



### const和readonly的区别

- const用于变量，readonly用于属性
- const在运行时检查，readonly在编译时检查
- 使用const变量保存的数组，可以使用push，pop等方法。但是如果使用Readonly Array声明的数组不能使用push，pop等方法

```js
class Greeter {
  readonly name: string = "world";
}
```



### Omit 类型有什么作用

Omit 以一个类型为基础支持剔除某些属性，然后返回一个新类型。

```ts
interface Todo {
  title: string
  description: string
  completed: boolean
  createdAt: number
}
type TodoPreview = Omit<Todo, "description">
```





