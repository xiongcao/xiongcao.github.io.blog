title: Vue原理解析
author: 熊 超
tags:
  - 原理
categories:
  - Vue
date: 2022-02-04 16:35:00
---
<!-- more -->


![image-20230313201943916](/Users/xiongchao/Library/Application Support/typora-user-images/image-20230313201943916.png)


### 一.实现一个指令解析器Compile

1. 获取页面元素，添加到文档碎片对象（DocumentFragment）中。
2. 编译指令：

- 将文档碎片中的元素，按节点类型分为元素节点和文本节点；
- 处理元素节点的指令和事件，同时为**每一个属性绑定观察者，将来数据发生变化，触发回调，进行更新**。

```js
// fnName: text、html、model
model(node, expr, vm) {
  const value = this.getVal(expr, vm);
  // 绑定观察者，将来数据发生变化，触发回调，进行更新
  // 绑定更新函数 数据 => 视图
  new Watcher(vm, expr, (newVal) => {
    this.updater.modelUpdater(node, newVal);
  });

  // 视图 => 数据 => 视图
  node.addEventListener('input', (e) => {
    this.setVal(expr, vm, e.target.value)
  }, false)
  this.updater.modelUpdater(node, value);
},
```

3. 将文档碎片对象追加到目标根元素（#app）;



### 二、实现一个数据观察者Observer，劫持监听所有属性

1. 递归遍历所有属性，使用defineProperty劫持所有属性；
2. get方法中，订阅数据变化时，往 Dep 中添加观察者；
3. set方法中，告诉Dep，通知变化；

```js
defineReactive(obj, key, value) {
  // 递归 遍历属性
  this.observer(value);
  const dep = new Dep();
  // 劫持并监听所有的属性
  Object.defineProperty(obj, key, {
    enumerable: true,
    get() {
      // 订阅数据变化时，往 Dep 中添加观察者
      // 往Dep中收集依赖（属性/观察者），一个属性对应一个观察者
      Dep.target && dep.addSub(Dep.target);
      return value;
    },
    set: newVal => {
      this.observer(newVal);
      if (newVal !== value) {
        value = newVal;
      }
      // 告诉Dep，通知变化
      dep.notify();
    }
  })
}
```



### 三、订阅器Dep

1. 收集依赖，即观察者Watcher（一个属性对应一个观察者）。
2. 通知观察者去更新。

```js
class Dep {
  constructor() {
    this.subs = [];
  }
  // 收集观察者
  addSub(watcher) {
    this.subs.push(watcher);
  }
  // 通知观察者去更新
  notify() {
    console.log('通知了观察者', this.subs);
    this.subs.forEach(w => {
      w.update()
    })
  }
}
```



### 四、观察者Watcher（也叫订阅者）

- 实例接收一个回调方法；
- 有一个更新函数，此函数在触发set()方法时，通知订阅器触发此方法，调用回调方法更新视图

```js
class Watcher {
  constructor(vm, expr, cb) {
    this.vm = vm;
    this.expr = expr;
    this.cb = cb;
    // 保存旧值
    this.oldVal = this.getOldVal();
  }
  update() {
    const newVal = compileUtil.getVal(this.expr, this.vm);
    if(newVal !== this.oldVal) {
      this.cb(newVal)
    }
  }
}
```



![image-20230313201943916](/Users/xiongchao/Library/Application Support/typora-user-images/image-20230313201943916.png)



采用数据劫持 配合 **发布者-订阅者模式** 的方式，通过**Object.defineProperty()** 来劫持各个属性的 **setter** 和 **getter**，在数据变动时，发布消息给依赖收集器，去通知观察者，更新视图。

**MVVM** 作为绑定的入口，整合 **Observer**，**Compile** 和 **Watcher**。三者通过 **Observer** 来监听 **model** 数据变化，通过 **Compile** 来解析编译模板指令，最终利用**Watcher** 搭起 **Observer**，**Compile** 之间的通信桥梁，达到 数据变化 -> 视图更新；视图交互变化 -> 数据model变更 的双向绑定效果。



> 对象内部通过 defineReactive 方法，使用 Object.defineProperty 将属性进行劫持（只会劫持已经存在的属性），数组则是通过重写数组方法来实现。当页面使用对应属性时，每个属性都拥有自己的 dep 属性，存放他所依赖的 watcher（依赖收集），当属性变化后会通知自己对应的 watcher 去更新(派发更新)。



### 底层实现原理

`vue.js`是采用数据劫持结合发布者-订阅者模式的方式，通过`Object.defineProperty()`来劫持各个属性的`setter`和`getter`，在数据变动时发布消息给订阅者，触发相应的监听回调。
 `Vue`是一个典型的`MVVM`框架，模型`（Model）`只是普通的`javascript`对象，修改它则视图（`View`）会自动更新。这种设计让状态管理变得非常简单而直观。

**Observer（数据监听器）** : `Observer`的核心是通过`Object.defineProprtty()`来监听数据的变动，这个函数内部可以定义`setter`和`getter`，每当数据发生变化，就会触发`setter`。这时候`Observer`就要通知订阅者，订阅者就是`Watcher`

**Watcher（订阅者）** : `Watcher`订阅者作为`Observer`和`Compile`之间通信的桥梁，主要做的事情是：

1. 在自身实例化时往属性订阅器(`dep`)里面添加自己
2. 自身必须有一个`update()`方法
3. 待属性变动`dep.notice()`通知时，能调用自身的`update()`方法，并触发`Compile`中绑定的回调

**Compile（指令解析器）** : `Compile`主要做的事情是解析模板指令，将模板中变量替换成数据，然后初始化渲染页面视图，并将每个指令对应的节点绑定更新函数，添加鉴定数据的订阅者，一旦数据有变动，收到通知，更新视图



![image-20230519090610718](/Users/xiongchao/Library/Application Support/typora-user-images/image-20230519090610718.png)





### 虚拟 `dom`

`Virtual DOM` 是 `DOM` 节点在 `JavaScript` 中的一种抽象数据结构，之所以需要虚拟 `DOM`，是因为浏览器中操作 `DOM` 的代价比较昂贵，频繁操作 `DOM` 会产生性能问题。

虚拟 `DOM` 的作用是在每一次响应式数据发生变化引起页面重渲染时，`Vue` 对比更新前后的虚拟 `DOM`，匹配找出尽可能少的需要更新的真实 `DOM`，从而达到提升性能的目的。

虚拟 `DOM` 的实现原理主要包括以下 **3** 部分：

- 用 `JavaScript` 对象模拟真实 `DOM` 树，对真实 `DOM` 进行抽象；
- `diff` 算法 — 比较两棵虚拟 `DOM` 树的差异；
- `patch` 算法 — 将两个虚拟 `DOM` 对象的差异应用到真正的 `DOM` 树。



## Vue3

**Vue3.x 响应式数据原理是什么？**

> 1. Object.defineProperty 无法监控到数组下标的变化，导致通过数组下标添加元素，不能实时响应
> 2. Object.defineProperty 只能劫持对象的属性，从而需要对每个对象，每个属性进行遍历，如果，属性值是对象，还需要深度遍历。Proxy 可以劫持整个对象，并返回一个新的对象。
> 3. Proxy 不仅可以代理对象，还可以代理数组。还可以代理动态增加的属性。
> 4. Proxy 有多达 13 种拦截方法
> 5. Proxy作为新标准将受到浏览器厂商重点持续的性能优化

**Proxy 只会代理对象的第一层，那么 Vue3 又是怎样处理这个问题的呢？**

判断当前 Reflect.get 的返回值是否为 Object，如果是则再通过 reactive 方法做代理， 这样就实现了深度观测。

**监测数组的时候可能触发多次 get/set，那么如何防止触发多次呢？**

我们可以判断 key 是否为当前被代理对象 target 自身属性，也可以判断旧值与新值是否相等，只有满足以上两个条件之一时，才有可能执行 trigger。
