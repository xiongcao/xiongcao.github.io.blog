title: React VS Vue
author: 熊 超
tags:
  - React
categories:
  - React
date: 2022-06-24 13:15:00
---
<!--more-->


### 一、组件化

##### 共同点：

react和vue都推崇组件化，通过将页面拆分成一个一个小的可复用单元来提高代码的复用率和开发效率。

都有父子组件传参，都有数据状态管理，都有前端路由等。

##### 不同点：

- React推荐的做法是JSX
- Vue 推荐的做法是 template 的单文件组件格式



### 二、虚拟DOM

- 虚拟dom是一个js对象，存储在内存之中。
- 虚拟dom能够描述真实dom（存在一个对应关系）
- 当数据变化的时候，生成新的DOM，对比新旧虚拟DOM的差异，将差异更新到真实DOM上

##### 优点：

- 减少 DOM 操作：虚拟 DOM 可以将多次 DOM 操作合并为一次操作
- 研发效率的问题：数据驱动视图，使得前端开发能够基于函数式 UI 的编程方式实现高效的声明式编程。
- 跨平台的问题：同一套虚拟 DOM，可以对接不同平台的渲染逻辑，从而实现“一次编码，多端运行”。

##### 相同点：

不管是Vue的Template模板+options api 写法， 还是React的Class或者Function写法,最后都是生成render函数，而render函数执行返回VNode(虚拟DOM的数据结构，本质上是棵树)。

当每一次UI更新时，总会根据render重新生成最新的VNode，然后跟以前缓存起来老的VNode进行比对，再使用Diff算法（框架核心）去真正更新真实DOM

##### 差异：

更新策略不同：

按颗粒度分为tree diff, component diff, element diff. tree diff 比较同层级dom节点，进行增、删、移操作。如果遇到component， 就会重新tree diff流程。

在react中，当状态发生改变时，组件树就会自顶向下的全diff, 重新render页面， 重新生成新的虚拟dom tree, 新旧dom tree进行比较， 进行patch打补丁方式，局部更新dom。所以react为了避免父组件更新而引起不必要的子组件更新， 可以在shouldComponentUpdate做逻辑判断，减少没必要的render， 以及重新生成虚拟dom，做差量对比过程。

在vue中， 通过Object.defineProperty 把 data 属性全部转为 getter/setter。同时watcher实例对象会在组件渲染时，将属性记录为dep, 当dep 项中的 setter被调用时，通知watch重新计算，使得关联组件更新。



### 三、数据驱动视图

#### vue中的数据驱动视图

Vuejs的数据驱动是通过MVVM这种框架来实现的。MVVM框架主要包含3个部分:model、view和 viewModel。

首先，vuejs在实例化的过程中，会对遍历传给实例化对象选项中的data 选项，遍历其所有属性并使用 Object.defineProperty 把这些属性全部转为 getter/setter。

同时每一个实例对象都有一个watcher实例对象，他会在模板编译的过程中,用getter去访问data的属性，watcher此时就会把用到的data属性记为依赖，这样就建立了视图与数据之间的联系。当之后我们渲染视图的数据依赖发生改变（即数据的setter被调用）的时候，watcher会对比前后两个的数值是否发生变化，然后确定是否通知视图进行重新渲染。这样就实现了所谓的数据对于视图的驱动。



#### React的数据驱动视图：

首先了解一些列内容：

- pending：当前所有等待更新的**state队列**。
- isBatchingUpdates：React中用于标识当前是否处理批量更新状态，默认false。
- dirtyComponent：当前所有待更新state的**组件队列**。

React通过setState实现数据驱动视图，通过setState来引发一次组件的更新过程从而实现页面的重新渲染(除非shouldComponentUpdate返回false)。

- setState()首先将接收的第一个参数state存储在pending队列中；（state）
- 判断当前React是否处于批量更新状态，是的话就将需要更新state的组件添加到dirtyComponents中；（组件）
- 不是的话，它会遍历dirtyComponents的所有组件，调用updateComponent方法更新每个dirty组件（开启批量更新事务）


