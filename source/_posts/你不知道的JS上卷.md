title: 《你不知道的JS上卷》
author: 熊 超
tags:
  - JS
categories:
  - JS
date: 2020-12-12 13:15:00
---
<!--more-->

## 第一部分：作用域和闭包



### 第1章：作用域

#### 1.1. 编译原理

> 所谓编译指的是：源代码执行之前进行的操作。

而对于 `JS` 而言，它的整个编译过程被粗略分为三大步：

1. 分词 - ==词法分析==
2. 解析 - ==语法分析==
3. ==代码生成==

首先对于 **词法分析** 而言，它的主要作用就是： **把一段 `JS` 代码，解析成多个词法单元（`token`）**。我们以 `var a = 2;` 为例，他会被解析成 `5` 个 `token`：`var、a、=、2、;`

其次是 **语法分析**，它的作用是： **把 `token` 流转化为 `AST （抽象语法树）` **。所谓抽象语法树就是一个 **树形结构的 `JS` 对象**

最后是 **代码生成**，它的作用是：**把 `AST` 解析成可执行的代码（机器指令）**



#### 1.2. 理解作用域

明确好了这三步基础的 `JS 编译原理` 之后，那么下面我们来尝试理解一下作用域。

作者告诉我们：“作用域的理解需要从一个故事开始~~”。

既然是故事嘛，那肯定得有演员。咱们这次出动了三个演员：

1. ==引擎==：负责整个 JavaScript 程序的==编译及执行==过程（核心）

2. ==编译器==：负责语法分析及代码生成等（编译三步）

3. ==作用域==：负责收集并维护由所有变量查询，并确定访问权限

   

明确好这些演员之后，接下来咱们来看这个故事：

> **引擎** 有一天看见了一段代码 `var a = 2; `，这段代码在引擎看来是两段完全不同的内容，所以引擎把这段代码拆成了两部分：
>
> 1. `var a`
> 2. `a = 2`
>
> 然后把第一段代码交给了 **编译器**，编译器就拿着这段代码问 **作用域**，你那有 `a` 这个变量吗？作用域如果说有，那么编译器就会忽略掉这段声明。否则，则进行 `a` 变量声明。
>
> 接下来，**编译器** 会为 **引擎** 生成运行时所需的代码，这些代码被用来处理 `a = 2` 这个赋值操作。
>
> **引擎** 会首先询问 **作用域**：在当前的作用域集合中是否存在一个叫作 `a` 的 变量。如果是，**引擎** 就会使用这个变量。否则，**引擎** 会继续查找该变量（这就涉及到另外一个概念 **作用域嵌套**）。

在这样的一个故事中，会涉及到两个关键术语：==LHS== 和 ==RHS==。

- `LHS`：赋值操作的左侧查询。这并不意味着 `LHS` 就是赋值符号左侧的操作。大家可以用这句话进行理解 **找到变量，对其赋值**
- `RHS`：赋值操作的右侧查询。同样的道理，它也并不是赋值符号的右侧操作。大家可以用这句话进行理解 **取得某变量的值**



如果只是这么说，可能大多数同学依然听不懂，咱们下面通过一个例子来看一下。

> function foo(a) { 
>
> ​	console.log( a ); // 2 
>
> }
>
> foo( 2 ); 

让我们把上面这段代码的处理过程想象成一段对话，这段对话可能是下面这样的。 

> 引擎：我说作用域，我需要为foo进行RHS引用。你见过它吗？ 
>
> 作用域：别说，我还真见过，编译器那小子刚刚声明了它。它是一个函数，给你。 
>
> 引擎：哥们太够意思了！好吧，我来执行一下foo。 
>
> 引擎：作用域，还有个事儿。我需要为a进行LHS引用，这个你见过吗？ 
>
> 作用域：这个也见过，编译器最近把它声名为foo的一个形式参数了，拿去吧。 
>
> 引擎：大恩不言谢，你总是这么棒。现在我要把2赋值给a。 
>
> 引擎：哥们，不好意思又来打扰你。我要为console进行RHS引用，你见过它吗？ 
>
> 作用域：咱俩谁跟谁啊，再说我就是干这个的。这个我也有，console是个内置对象。给你。 
>
> 引擎：么么哒。我得看看这里面是不是有log(..)。太好了，找到了，是一个函数。 
>
> 引擎：哥们，能帮我再找一下对a的RHS引用吗？虽然我记得它，但想再确认一次。 
>
> 作用域：放心吧，这个变量没有变动过，拿走，不谢。 
>
> 引擎：真棒。我来把a的值，也就是2，传递进log(..)。 
>
> 
>
> 查询步骤为：
>
> 1. RHS：foo(2)
> 2. LHS：a = 2
> 3. RHS：console
> 4. RHS：xxx.log(a)



#### 1.3. 作用域嵌套

当一个块或函数嵌套在另一个块或函数中时，就发生了作用域的嵌套。因此，在当前作用域中无法 

找到某个变量时，引擎就会在外层嵌套的作用域中继续查找，直到找到该变量，或抵达最外层的作用域（也就是全局作用域）为止。 

考虑以下代码： 

> function foo(a) { 
>
> ​	console.log( a + b ); 
>
> }
>
> var b = 2; 
>
> foo( 2 ); // 4 

对b进行的RHS引用无法在函数foo内部完成，但可以在上一级作用域（在这个例子中就是全局作用域）中完成。 

遍历嵌套作用域链的规则很简单：引擎从当前的执行作用域开始查找变量，如果找不到，就向上一级继续查找。当抵达最外层的全局作用域时，无论找到还是没找到，查找过程都会停止。 



#### 1.4. 异常

在 **逐层向上** 的查找过程中，引擎会从变量当前作用域开始，一直查找到全局作用域。如果到全局作用域还如法查找到变量的话，那么就会抛出 `ReferenceError 异常` 。

`ReferenceError 异常` 表示 **RHS 查询在所有嵌套的作用域中遍寻不到所需的变量**。

而对于 `LHS 查询` 而言，如果在非严格模式下（例 `a = 2`），**编译器会在全局作用于下声明该变量，然后再为其赋值**。

而如果在严格模式下，同样会抛出 `ReferenceError 异常`





------

### 第2章：词法作用域

#### 2.1词法阶段 

简单地说，词法作用域就是定义在词法阶段的作用域。换句话说，词法作用域是由你在写代码时将 

变量和块作用域写在哪里来决定的，因此当词法分析器处理代码时会保持作用域不变（大部分情 

况下是这样的）

<img src="/Users/xiongchao/Library/Application Support/typora-user-images/image-20230407100836937.png" alt="image-20230407100836937" style="zoom:30%;" align="left"/>

在这段代码中，我们知道它包含了三级作用域：

- ① 包含着整个全局作用域，其中只有一个标识符：`foo`
- ② 包含着 `foo` 所创建的作用域，其中有三个标识符：`a`、`bar` 和 `b`
- ③ 包含着 `bar` 所创建的作用域，其中只有一个标识符：`c`

这三个作用域其实就是词法作用域的概念。



#### **2.2** 欺骗词法

如果词法作用域完全由写代码期间函数所声明的位置来定义，怎样才能在运行时来“修改”（也可以说欺骗）词法作用域呢？ 

JavaScript中有两种机制来实现这个目的。社区普遍认为在代码中使用这两种机制并不是什么好主意。但是关于它们的争论通常会忽略掉最重要的点：==欺骗词法作用域会导致性能下降==。

 `JS` 中为我们提供了两个 `API` 来 “欺骗” 作用域，也就是 **欺骗词法**。



##### eval

`eval()` 函数会将传入的字符串当做 `JavaScript` 代码进行执行。利用该语法我们可以把 **指定代码，指定在局部作用域下执行**：

> function foo(str, a) { 
>
> ​	eval( str ); // 欺骗！ 
>
> ​	console.log( a, b ); 
>
> }
>
> var b = 2; 
>
> foo( "var b = 3;", 1 ); // 1, 3 



##### with

它的作用是 **扩展一个语句的作用域链**。比如在如下代码中 `with` 内的代码，会自动指向 `obj` 对象：

![image-20230407102605990](/Users/xiongchao/Library/Application Support/typora-user-images/image-20230407102605990.png)

但是要注意，`with` 语法可能会导致内存泄漏：

```js
function foo(obj) {
  with(obj) {
    a = 2;
  }
}
foo({})
consle.log(a); // 2, a被泄漏到全局作用域上了！
```

并且 `with` 会让作用域变得混乱，所以 **它是一个不被推荐使用的语法**。

不光是 `with`，包括 `eval` ，它们两个都不应该是我们在日常开发时的首选项，因为它们改变作用域的特性，会导致 **引擎无法在编译时对作用域查找进行优化** ，所以我们应该尽量避免使用 `eval` 和 `with`。





------

### 第3章：函数作用域与块作用域

首先针对函数作用于而言，它表示 **一个函数的作用域范围。属于这个函数的全部变量都可以在整个函数的范围内使用及复用**

我们之前很多次的说过 **函数是 js 世界的第一公民**。创建函数的目的，本质上其实就是为了 **把代码 “隐藏” 起来**。也就是 **最小特权原则**。

所谓 **最小特权原则**，指的是：**最小限度地暴露必要内容，而将其他内容都“隐藏”起来**。



#### 隐藏内部实现

但是在某些情况下，如果我们的代码不够完善的话，那么虽然创建了函数，但是依然不符合最小特权原则。比如下面这段代码：

![image-20230407103832164](/Users/xiongchao/Library/Application Support/typora-user-images/image-20230407103832164.png)

在这段代码中，我们声明了一个全局变量 `var b`。然后在函数中对 `b` 进行了操作。但是因为 `b` 是全局变量，所以我们可以在任意位置修改 `b` 的值，那么这样的一个操作就是 “非常危险” 的。此时的代码就不符合最小特权原则。

我们可以对当前代码进行下修改，把 `b` 的定义放到函数之后，以避免被全局访问 ：

![image-20230407103619173](/Users/xiongchao/Library/Application Support/typora-user-images/image-20230407103619173.png)

**规避冲突**

![image-20230407104059592](/Users/xiongchao/Library/Application Support/typora-user-images/image-20230407104059592.png)

`ECMAScript` 在 `ES6` 之后新增了 `let` 和 `const` 两个声明变量的关键字，这两个关键字具备块级作用域（`{}` 组成块级作用域），同时 `var` 也不再被推荐使用了。所以冲突问题倒是可以比较轻松的避免。





------

### 第4章：提升

#### 4.1 变量提升

所谓提升指的是 **变量提升** 的问题，什么是变量提升呢？咱们来看这两段代码：

![image-20230407105947634](/Users/xiongchao/Library/Application Support/typora-user-images/image-20230407105947634.png)

![image-20230407110000228](/Users/xiongchao/Library/Application Support/typora-user-images/image-20230407110000228.png)

大家可以猜一下这两段代码输出的内容是什么？

第一段代码的输出结果是 `2`。

第二段代码的输出结果是 `undefined`。

如果我们从一个标准的程序设计角度，这样的代码是肯定不能正常运行的。但是因为 `var` 存在变量提升的问题，所以我们得到了以上两个对应的输出结果。

那么这个变量提升到底是怎么提升的呢？此时啊，编译器就有话说了。

整个 `var a = 2;` 的代码编译器在处理会分成两部分：

1. 在 编译阶段，进行定义声明：`var a`
2. 在 执行阶段，进行赋值声明：`a = 2`

根据声明提升，第一段代码会被解析为以下代码：

![image-20230407110044411](/Users/xiongchao/Library/Application Support/typora-user-images/image-20230407110044411.png)

第二段代码会被解析为以下代码：

![image-20230407110104747](/Users/xiongchao/Library/Application Support/typora-user-images/image-20230407110104747.png)



#### 4.2 函数优先

而对于函数而言，同样存在变量提升的问题，同时 **当函数和变量同时需要提升时**，遵循 **函数优先原则**。例如，以下代码：

![image-20230407110408667](/Users/xiongchao/Library/Application Support/typora-user-images/image-20230407110408667.png)

被提升之后的内容为：

![image-20230407110449859](/Users/xiongchao/Library/Application Support/typora-user-images/image-20230407110449859.png)

注意，var foo尽管出现在function foo()...的声明之前，但它是重复的声明（因此被忽略了），因为 

函数声明会被提升到普通变量之前。 

尽管重复的var声明会被忽略掉，但出现在==后面的函数声明==还是可以==覆盖前面==的。 

![image-20230407110645895](/Users/xiongchao/Library/Application Support/typora-user-images/image-20230407110645895.png)





------

### 第5章：作用域闭包

到这里，对作用域咱们了解的其实就差不多了。作者分别从 **词法作用域、函数作用域、块作用域** 三个方面对作用域进行了解释。

那么什么是闭包呢？所为闭包一定是一个函数。通常情况下我们把 **能够访问其它函数作用域中变量的函数** 叫做闭包函数。

闭包函数在前端开发中是非常常见的，比如：

![image-20230407141834715](/Users/xiongchao/Library/Application Support/typora-user-images/image-20230407141834715.png)

![image-20230407141903755](/Users/xiongchao/Library/Application Support/typora-user-images/image-20230407141903755.png)



#### 循环和闭包 

要说明闭包，for循环是最常见的例子。 

![image-20230407142116582](/Users/xiongchao/Library/Application Support/typora-user-images/image-20230407142116582.png)

> 正常情况下，我们对这段代码行为的预期是分别输出数字1~5，每秒一次，每次一个。 
>
> 但实际上，这段代码在运行时会以每秒一次的频率输出五次6。 
>
> 首先解释6是从哪里来的。这个循环的终止条件是i不再<=5。条件首次成立时i的值是6。因此，输出显示的是循环结束时i的最终值。 
>
> 仔细想一下，这好像又是显而易见的，延迟函数的回调会在循环结束时才执行。事实上，当定时器运行时即使每个迭代中执行的是setTimeout(.., 0)，所有的回调函数依然是在循环结束后才会被执行，因此会每次输出一个6出来。 

我们需要更多的闭包作用域，特别是在循环的过程中每个迭代都需要一个闭包作用域.

第3章介绍过，IIFE会通过==声明并立即执行一个函数来创建作用域==。 

我们来试一下： 

![image-20230407142329128](/Users/xiongchao/Library/Application Support/typora-user-images/image-20230407142329128.png)

> 这样也不行。我们现在显然拥有更多的词法作用域了。的确每个延迟函数都会将IIFE在每次迭代中创建的作用域封闭起来。 
>
> 如果作用域是空的，那么仅仅将它们进行封闭是不够的。仔细看一下，我们的IIFE只是一个什么都没有的空作用域。它需要包含一点实质内容才能为我们所用。 

它需要有自己的变量，用来在每个迭代中储存i的值： 

![image-20230407142546985](/Users/xiongchao/Library/Application Support/typora-user-images/image-20230407142546985.png)

行了！它能正常工作了！。 

可以对这段代码进行一些改进：

![image-20230407142610723](/Users/xiongchao/Library/Application Support/typora-user-images/image-20230407142610723.png)



重返**块作用域** 

我们使用IIFE在每次迭代时都创建一个新的作用域。换句话说，每次迭代我们都需要一个块作用域。第3章介绍let声明，可以用来劫持块作用域，并且在这个块作用域中声明一个变量

本质上这是将一个块转换成一个可以被关闭的作用域。因此，下面这些看起来很酷的代码就可以正常运行了： 

![image-20230407143050841](/Users/xiongchao/Library/Application Support/typora-user-images/image-20230407143050841.png)

但是，这还不是全部！for循环头部的let声明还会有一个特殊的行为。这个行为指出变量在循环过程中不止被声明一次，每次迭代都会声明。随后的==每个迭代都会使用上一个迭代结束时的值==来初始化这个变量。 

![image-20230407143211762](/Users/xiongchao/Library/Application Support/typora-user-images/image-20230407143211762.png)





## 第二部分：this 和 对象原型



### 第1章：关于this

所谓 `this` ，大家首先需要知道 **它是在运行时进行绑定的，它的上下文取决于函数调用时的各种条件。** 也就是说， `this` 的值到底是什么，取决于它所在的函数被调用时的上下文，而和它所在的函数定义时没有关系。

同时大家要注意，以上这些描述 **仅针对于 `function` 声明的普通函数**，因为我们知道 **箭头函数是不会修改 `this` 指向的。**



### 第2章：this全面解析

#### 2.1 绑定规则

##### 2.1.1 默认绑定

```js
function foo() {
  // this 指向 window。即：this.a === window.a
  console.log(this.a);
}
var a = 2;
// foo() 等同于 window.foo()
foo(); // 2
```

如果使用严格模式（strict mode），那么全局对象将无法使用默认绑定，因此this会绑定到undefined： 

```js
function foo() { 
  "use strict";
	console.log( this.a );
}
var a = 2;
foo(); // TypeError: this is undefined
```



##### 2.1.2 隐式绑定 

以对象方法的形式进行的函数调用，此时 `this` 指向调用该函数的对象：

![image-20230407151233142](/Users/xiongchao/Library/Application Support/typora-user-images/image-20230407151233142.png)

对象属性引用链中只有最顶层或者说最后一层会影响调用位置。举例来说： 

![image-20230407151350054](/Users/xiongchao/Library/Application Support/typora-user-images/image-20230407151350054.png)

**隐式丢失** 

一个最常见的this绑定问题就是被隐式绑定的函数会丢失绑定对象，也就是说它会应用默认绑定，从而==把this绑定到全局对象==或者undefined上，取决于是否是严格模式。

![image-20230407151604958](/Users/xiongchao/Library/Application Support/typora-user-images/image-20230407151604958.png)

虽然bar是obj.foo的一个引用，但是实际上，它引用的是foo函数本身，因此此时的bar()其实是一个不带任何修饰的函数调用，因此应用了默认绑定。



一种更微妙、更常见并且更出乎意料的情况发生在传入回调函数时： 

![image-20230407153502347](/Users/xiongchao/Library/Application Support/typora-user-images/image-20230407153502347.png)

==参数传递==其实就是一种==隐式赋值==，因此我们传入函数时也会被隐式赋值，所以结果和上一个例子一样。

JavaScript环境中内置的setTimeout()函数实现和下面的伪代码类似： 

![image-20230407153651576](/Users/xiongchao/Library/Application Support/typora-user-images/image-20230407153651576.png)



##### 2.1.3 显式绑定  

- call (obj, p1, p2, ...)
- apply (obj, [ p1, p2, ...])
- bind(obj)(p1, p2, ...)



##### 2.1.4 new绑定

主要针对构造函数。在这种情况下 `this` 指向构造生成的实例对象

![image-20230407154658360](/Users/xiongchao/Library/Application Support/typora-user-images/image-20230407154658360.png)



#### 2.2 绑定例外

##### 2.2.1 被忽略的 this

如果你把null或者undefined作为this的绑定对象传入call、apply或者bind，这些值在调用时会被 忽略，实际应用的是==默认绑定规则==

![image-20230407155143182](/Users/xiongchao/Library/Application Support/typora-user-images/image-20230407155143182.png)



##### 2.2.2  间接引用 

间接引用最容易在赋值时发生

![image-20230407155523469](/Users/xiongchao/Library/Application Support/typora-user-images/image-20230407155523469.png)

赋值表达式p.foo = o.foo的返回值是目标函数的引用，因此==调用位置是foo()==而不是p.foo()或 者o.foo()。根据我们之前说过的，这里会应用==默认绑定==。 





------

### 第3章：对象

#### 3.1 类型

基础类型：`stirng`, `number`, `boolean`, `undefined`, `null`  ES6新增了两种，`symbol`, `bigint`

引用类型：`object`

typeof的值：`stirng`, `number`, `boolean`, `undefined`, `object`, `function`, `symbol`



#### 3.2 复制对象

##### 3.2.1 浅拷贝：

浅拷贝表示多个变量引用了同一块内存地址。

操作方式也比较简单，可以直接通过 `= 赋值符` 或 `Object.assgin` 进行实现。



##### 3.2.2 深拷贝：

- 浅层的深拷贝：`JSON.parse( JSON.stringify( obj ) )`
- 深层的深拷贝:  递归。（如：Lodash.cloneDeep()）



#### 3.3 属性描述符

对象中每个属性，都存在属性描述符。可以通过 [Object.getOwnPropertyDescriptor()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor) 方法来获取对应的属性描述符。不同的属性描述符代表了不同的作用：

![image-20230407163515085](/Users/xiongchao/Library/Application Support/typora-user-images/image-20230407163515085.png)

1. **`value`**：该属性的值 (仅针对数据属性描述符有效)
2. **`writable`**：当且仅当属性的值可以被改变时为 `true`。
3. **`configurable`**：当且仅当指定对象的属性描述可以被改变或者属性可被删除时，为 `true`。
4. **`enumerable`**：当且仅当指定对象的属性可以被枚举出时，为 `true`。



也可以通过 [Object.defineProperty()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) 方法修改指定属性的属性描述符。

![image-20230407163456199](/Users/xiongchao/Library/Application Support/typora-user-images/image-20230407163456199.png)



#### 3.4 不变性

对象属性不可变的方法：

1. 对象常量：结合 `writable:false` 和 `configurable:false` 就可以创建一个真正的常量属性
2. 禁止扩展：`Object.preventExtensions(..)`。（不允许添加属性）
3. 密封：`Object.seal`。（调用preventExtensions，并标记为configurable: false。不能添加、配置、删除）
4. 冻结：`Object.freeze()`。（调用Object.seal，标记为writable: false。全都不能）



#### 3.5 遍历

`for...in`: 遍历的是所有==可枚举==的属性（包括原型）。

`for...of`：遍历==可迭代==对象的==属性值==



### 第4章：类的机制

### 第5章：原型

### 第6章：行为委托













