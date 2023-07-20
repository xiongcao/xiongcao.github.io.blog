title: Vue易错知识点
author: 熊 超
tags:
  - Vue
categories:
  - Vue
date: 2022-02-19 16:35:00
---
<!-- more -->


### 一、vue2 部分

#### 1. 父子组件的生命周期

挂载： 父beforeCreate -> 父created -> 父 beforeMount -> 

​			子beforeCreate ->  -> 子 created -> beforeMount -> 子 mounted -> 

​			父 mounted

更新：父 beforUpdate -> 子 beforUpdate -> 子 updated -> 父 updated

卸载：父beforeDestroy > 子beforeDestroy  > 子destroyed > 父destroyed



#### 2. mixin

##### 特点：

1.混入对象会合并到当前组件

2.混入的对象有同名选项时，以组件数据优先

3.当多个组件引入混入对象时，其中一个组件改变了混入中的某个属性值或者方法内部的做操时，其他组件不受影响。

##### 缺点

1.多个混入时，不清晰的数据来源；（不清楚调用的是哪个混入的属性或方法）

2.命名空间冲突

3.隐式的跨混入交流（混入之间的依赖）

##### 生命周期顺序：

**mixin**的生命周期钩子在组件的生命周期钩子**之前**执行

mixin beforeCreate > 父 beforeCreate > mixin created > 父created > mixin的beforeMount > 父beforeMount  > mixin的mounted >父mounted



#### 3. nextTick

**问题：**

1. nextTick是做什么的?
2. 为什么需要它呢?
3. 开发时何时使用它? 
4. 下面介绍一下如何使用nextTick
5. 原理解读，结合异步更新和nextTick生效方式，会显得你格外优秀

##### 1.nextTick是做什么的?

nextTick是等待下一次 DOM 更新刷新的工具方法。

##### 2.为什么需要它呢?

Vue有个异步更新策略，意思是如果数据变化，Vue不会立刻更新DOM，而是开启一个队列，把组件更新函数保存在队列中，在同一事件循环中发生的所有数据变更会异步的批量更新。这一策略导致我们对数据的修改不会立刻体现在DOM上，此时如果想要获取更新后的DOM状态，就需要使用nextTick。

##### 3.开发时何时使用它? 

- created中想要获取DOM时;
- 响应式数据变化后获取DOM更新后的状态，比如希望获取列表更新后的高度

##### 5.原理解读

将传入的回调函数包装成异步任务，异步任务又分微任务和宏任务，为了尽快执行所以优先选择微任务；

在内部会尝试使用原生的`Promise.then (IE不支持)`、`MutationObserver` 和 `setImmediate (高版本IE专享)`，如果执行环境还不支持的话，则会采用 `setTimeout(fn, 0)`

异步方法，异步渲染最后一步，与JS事件循环联系紧密。主要使用了宏任务微任务（`setTimeout`、`promise`那些），定义了一个异步方法，多次调用`nextTick`会将方法存入队列，通过异步方法清空当前队列。



forceUpdate



#### 4. 组件通信方式

- **`props / $emit`**：父子组件通信

- **`ref`**：**父子组件通信**

- **`$parent` / `$children` / `$root`：访问父 / 子实例 / 根实例**

- **`EventBus （$emit / $on）` 适用于 父子、隔代、兄弟组件通信**

  ```js
  // main.js
  Vue.prototype.$EventBus = new Vue()
  
  // A组件：向EventBus发送事件
  this.$EventBus.$emit("msg", '123');
  
  // B组件：接收事件
   this.$EventBus.$on("msg", (data) => {
     this.msg = data;
   });
  ```

- **`$attrs`/`$listeners` 适用于 隔代组件通信**

  -  `v-bind="$attrs"` 
  - `v-on="$listeners"`

- **`provide / inject` 适用于 隔代组件通信**

- **插槽**：`Vue3` 可以通过 `usesolt` 获取插槽数据。

- **`mitt.js` 适用于任意组件通信**

  （Vue3` 中移除了 `$on`，`$off`等方法，所以 `EventBus` 不再使用，相应的替换方案就是 `mitt.js）







### 二、Vue3 部分

#### 1. ref 和 reactive 的区别

ref 可以将一个==普通数据类型（如数字、字符串等）转换为一个响应式对象==，从而让这个数据在Vue的响应式系统中被追踪。ref返回一个对象，这个对象有一个.value属性，用来获取和设置这个响应式对象的值

```js
const count = ref(0);
console.log(count.value); // 0
count.value = 1;
console.log(count.value); // 1
```

reactive 可以将一个==普通的Javascript对象转换为一个响应式对象==。它会递归地将这个对象的所有属性都转换为响应式对象，从而让整个对象在Vue的响应式系统中被追踪。reactive返回一个Proxy对象，用来代理原始对象的访问和修改。

```js
const state = reactive({
  count: 0,
  message: 'hello'
});

console.log(state.count); // 0
state.count = 1;
console.log(state.count); // 1
```

ref：如果是基本类型，会使用包装类变成对象，然后使用defineProperty劫持，如果是对象，则使用reactive（Proxy）处理；

reactive：解构会丧失响应式

#### 2. ref 可以大量的替换成 reactive 吗

不能直接把ref替换成reactive。

ref主要用于将基本数据类型（如字符串、数字等）转换为响应式数据，并提供一个.value属性用于访问和修改该数据。而reactive则用于将一个普通的JavaScript对象转换为响应式对象，并使用Proxy来拦截对该对象的访问和修改，以实现响应式更新。

因此，如果你需要使用响应式数据来存储基本数据类型，或者你只需要响应式地跟踪一个值的变化，那么ref仍然是更合适的选择。而如果你需要管理一个对象的多个属性，并希望这些属性可以响应式地更新，那么reactive会更加合适



#### Pinia解决了什么问题

1. 简化状态管理：Pinia 提供了一个简洁的 API。使得我们可以更容易地定义和管理状态，并在整个应用程序中共享它们。
2. 更好的类型支持：Pinia 提供了一个类型安全的 API，可以让我们更容易地编写类型安全的代码，并减少错误。
3. 更好的可测试性：Pinia 的状态管理使得我们可以更容易地对 Vue 3 组件进行单元测试，从而提高代码的可测试性。
4. 更好的性能：Pinia 的状态管理实现了基于 Proxy 的响应式系统，从而提高了性能并减少了不必要的重渲染





### 三、区别

### 1. 响应式原理的区别

1. Object.defineProperty 无法监控到数组方法，导致通过数组添加元素，不能实时响应;
2. Object.defineProperty 只能劫持对象的属性，从而需要对每个对象，每个属性进行遍历。如果，属性值是对象，还需要深度遍历。Proxy可以劫持整个对象，并返回一个新的对象。
3. Proxy不仅可以代理对象，还可以代理数组。还可以代理动态增加的属性。

##### 数组问题：

```js
const arrayMethods = Array.prototype;
//先克隆一份Array的原型出来
const arrayProto = Object.create(arrayMethods);
const methodsToPatch = [
  'push', 
  'pop', 
  'shift', 
  'unshif',
  'splice',
  'sort', 
  'reverse'
]
methodsToPatch.forEach(method => {
  arrayProto[method] = function () {
    //执行原始操作
    arrayMethods[method].apply(this,arguments)
    console.log('监听赋值成功', method)
  }
})

if (Array.isArray(obj)) {
  //如果是数组，重写原型
  obj.__proto__ = arrayProto;
  // 传入数据可能是多维度的，需要执行响应式
  for(let i=0; i< obj.length; i++) {
    observer(obj[i]);
  }
} else {
  for(const key in obj) {
    // 给对象中的每一个方法都设置响应式
    defineProperty(obj, key, obj[key])
  }
}
```



### 性能优化的方式：

- 数据层级不易过深，合理设置响应式数据；
- 通过 obiect.freeze(方法冻结非响应式属性；
- 使用数据时缓存值的结果，不频繁取值；
- 合理设置 Key 属性；
- `v-show` 和 `v-if` 的选取；
- 控制组件粒度 -> Vue 采用组件级更新采用函数式组件 -> 函数式组件开销低；
- 采用异步组件 -> 借助webpack分包的能力；
- 使用`keep-alive`缓存组件 `v-once`；
- 分页、虚拟滚动、时间分片等策略..；



### 首屏加载慢的优化：

使用路由懒加载、异步组件，实现组件拆分，减少入口文件体积大小(优化体验骨架屏)

抽离公共代码，采用 splitChunks 进行代码分割。

组件加载采用按需加载的方式

静态资源缓存，采用 HTTP 缓存 (强制缓存、对比缓存) 、使用 localstorage 实现缓存资源.

图片资源的压缩，雪碧图、对小图片进行 base64 减少 http 请求

打包时开启 gzip 压缩处理 compression-webpack-plugin 插件

静态资源采用 CDN 提速。

终极的手段使用 SSR 对首屏做服务端渲染



