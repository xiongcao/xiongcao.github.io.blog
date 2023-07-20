title: Fiber入门
author: 熊 超
tags:
  - React
categories:
  - React
date: 2022-07-07 13:15:00
---
<!--more-->

### 你是如何理解fiber的?

React Fiber 是一种基于浏览器的**单线程调度算法**。

React 16之前 ，`reconcilation` 算法实际上是递归，想要中断递归是很困难的，React 16 开始使用了循环来代替之前的递归。

`Fiber`：**一种将 `recocilation` （递归 diff），拆分成无数个小任务的算法；它随时能够停止，恢复。停止恢复的时机取决于当前的一帧（16ms）内，还有没有足够的时间允许计算。**



#### 1）背景

`Fiber` 产生的根本原因，是**==大量的同步计算任务阻塞了浏览器的 UI 渲染==**。

默认情况下，JS 运算、页面布局和页面绘制都是运行在浏览器的主线程当中，他们之间是互斥的关系。如果 JS 运算持续占用主线程，页面就没法得到及时的更新。当我们调用`setState`更新页面的时候，React 会遍历应用的所有节点，计算出差异，然后再更新 UI。如果页面元素很多，整个过程占用的时机就可能超过 16 毫秒，就容易出现掉帧的现象。

#### 2）实现原理

- React 内部运转分三层：
  - Virtual DOM 层，描述页面长什么样。
  - Reconciler 层，负责调用组件生命周期方法，进行 Diff 运算等。
  - Renderer 层，根据不同的平台，渲染出相应的页面，比较常见的是 ReactDOM 和 ReactNative。

##### `Fiber 其实指的是一种数据结构，它可以用一个纯 JS 对象来表示`：

```js
const fiber = {
    stateNode,    // 节点实例
    child,        // 子节点
    sibling,      // 兄弟节点
    return,       // 父节点
}
```

- 为了实现不卡顿，就需要有一个调度器 (Scheduler) 来进行任务分配。优先级高的任务（如键盘输入）可以打断优先级低的任务（如Diff）的执行，从而更快的生效。**任务的优先级有六种**：
  - synchronous，与之前的Stack Reconciler操作一样，同步执行
  - task，在next tick之前执行
  - animation，下一帧之前执行
  - high，在不久的将来立即执行
  - low，稍微延迟执行也没关系
  - offscreen，下一次render时或scroll时才执行
- Fiber Reconciler（react ）执行过程分为2个阶段：
  - 阶段一，生成 Fiber 树，得出需要更新的节点信息。这一步是一个渐进的过程，可以被打断。阶段一可被打断的特性，让优先级更高的任务先执行，从框架层面大大降低了页面掉帧的概率。
  - 阶段二，将需要更新的节点一次过批量更新，这个过程不能被打断。
- Fiber树：React 在 render 第一次渲染时，会通过 React.createElement 创建一颗 Element 树，可以称之为 Virtual DOM Tree，由于要记录上下文信息，加入了 Fiber，每一个 Element 会对应一个 Fiber Node，将 Fiber Node 链接起来的结构成为 Fiber Tree。==Fiber Tree 一个重要的特点是链表结构，将**递归遍历** 变成 **循环遍历**，然后配合 requestIdleCallback API，实现任务拆分、中断与恢复。==



### Fiber架构相对于以前的递归更新组件有什么优势？

- 递归更新组件会让`JS`调用栈占用很长时间。

- 因为浏览器是单线程的，它将GUI渲染，事件处理，`JS`执行等等放在了一起，只有将它做完才能做下一件事，如果有足够的时间，浏览器是会对我们的代码进行编译优化（JIT）及进行热代码优化。

- Fiber架构正是利用这个原理将组件渲染分段执行，提高这样浏览器就有时间优化 `JS` 代码与修正 `reflow`！

  

#### 4.Fiber是将组件分段渲染，那第一段渲染之后，怎么知道下一段从哪个组件开始渲染呢？

- Fiber节点拥有`return`，`child`，`sibling` 三个属性，分别对应父节点， 第一个孩子， 它右边的兄弟， 有了它们就足够将一棵树变成一个链表， 实现深度优化遍历。



#### 5.怎么决定每次更新的数量？

- 将虚拟 DOM 转换为 Fiber 节点，首先它规定一个时间段内，然后在这个时间段能转换多少个FiberNode，就更新多少个。
- 因此我们需要将我们的更新逻辑分成两个阶段，第一个阶段是将虚拟DOM转换成Fiber, Fiber转换成组件实例或真实DOM（不插入DOM树，插入DOM树会reflow）。Fiber转换成后两者明显会耗时，需要计算还剩下多少时间。
- 比如，可以记录开始更新视图的时间**var now = new Date - 0**，假如我们更新试图自定义需要100毫秒，那么定义结束时间是**var deadline = new Date + 100** ,所以每次更新一部分视图，就去拿当前时间new Date<deadline做判断，如果没有超过deadline就更新视图，超过了，就进入下一个更新阶段。

#### 6.如何调度时间才能保证流畅？

- 使用浏览器自带的api - requestIdleCallback。
- 它的第一个参数是一个回调，回调有一个参数对象，对象有一个timeRemaining方法，就相当于new Date - deadline，并且它是一个高精度数据， 比毫秒更准确。
- 这个因为浏览器兼容性问题，react团队自己实现了requestIdleCallback。

#### 7.fiber带来的新的生命周期是什么？

#### 创建时：

- constructor ->
- getDerivedStateFromProps(参数nextProps, prevState,注意里面this不指向组件的实例)->
- render ->
- componentDidMount

#### 更新时：

- getDerivedStateFromProps(这个是props更新才调用，setState时不调用这个生命周期， 参数nextProps, prevState) ->
- shouldComponentUpdate(setState时调用参数nextProps, nextState)->
- render->
- getSnapsshotBeforeUpdate(替换 componentWillUpdate)
- componentDidUpdate(参数prevProps, prevState, snapshot)

### 8.请简单谈一下react的事件机制

- 当用户在为onClick添加函数时，React并没有将Click事件绑定在DOM上面。
- 而是在document处监听所有支持的事件，当事件发生并冒泡至document处时，React将事件内容封装交给中间层SyntheticEvent（负责所有事件合成）。
- 所以当事件触发的时候，对使用统一的分发函数dispatchEvent将指定函数执行。

### 9.为什么列表循环渲染的key最好不要用index

```js
变化前数组的值是[1,2,3,4]，key就是对应的下标：0，1，2，3
变化后数组的值是[4,3,2,1]，key对应的下标也是：0，1，2，3
```

- 那么diff算法在变化前的数组找到key = 0的值是1，在变化后数组里找到的key = 0的值是4;
- 因为子元素不一样就重新删除并更新;
- 但是如果加了唯一的key,如下

```js
变化前数组的值是[1,2,3,4]，key就是对应的下标：id0，id1，id2，id3
变化后数组的值是[4,3,2,1]，key对应的下标也是：id3，id2，id1，id0
```

- 那么diff算法在变化前的数组找到key = id0的值是1，在变化后数组里找到的key= id0的值也是1;
- 因为子元素相同，就不删除并更新，只做移动操作，这就提升了性能;



## fiber架构

**Fiber的可中断、可恢复怎么实现的**

**fiber**是协程，是比线程更小的单元，可以被人为中断和恢复，当react更新时间超过1帧时，会产生视觉卡顿的效果，因此我们可以通过fiber把浏览器渲染过程分段执行，每执行一会就让出主线程控制权，执行优先级更高的任务

==fiber是一个链表结构，它有三个指针，分别记录了当前节点的下一个兄弟节点，子节点，父节点。当遍历中断时，它是可以恢复的，只需要保留当前节点的索引，就能根据索引找到对应的节点==

**Fiber更新机制**

**初始化**

1. 创建fiberRoot（React根元素）和rootFiber(通过ReactDOM.render或者ReactDOM.createRoot创建出来的)
2. 进入beginWork

**workInProgress**: 正在内存中构建的fiber树叫workInProgress fiber，在第一次更新时，所有的更新都发生在workInProgress树，在第一次更新后，workInProgress树上的状态是最新状态，它会替换current树

**current**: 正在视图层渲染的树叫current fiber树

```ini
currentFiber.alternate = workInProgressFiber
workInProgressFiber.alternate = currentFiber
```

3. 深度调和子节点，渲染视图

在新建的alternate树上，完成整个子节点的遍历，包括fiber的创建，最后会以workInProgress树最为最新的渲染树，fiberRoot的current指针指向workInProgress使其变成current fiber，完成初始化流程

**更新**

1. 重新创建workInProgress树，复用当前current树上的alternate，作为新的workInProgress

渲染完成后，workInProgress树又变成current树

**双缓冲模式**

话剧演出中，演员需要切换不同的场景，以一个一小时话剧来说，在舞台中切换场景，时间来不及。一般是准备两个舞台，切换场景从左边舞台到右边舞台演出

在计算机图形领域，通过让图形硬件交替读取两套缓冲数据，可以实现画面的无缝切换，减少视觉的抖动甚至卡顿。

react的current树和workInProgress树使用双缓冲模式，可以减少fiber节点的开销，减少性能损耗



**React渲染流程**

如图，React用JSX描述页面，JSX经过babel编译为render function，执行后产生VDOM，VDOM不是直接渲染的，会先转换为fiber，再进行渲染。vdom转换为fiber的过程叫reconcile，转换过程会创建DOM，全部转换完成后会一次性commit到DOM，这个过程不是一次性的，而是可打断的，这就是fiber架构的渲染流程

![image-20230510160353449](/Users/xiongchao/Library/Application Support/typora-user-images/image-20230510160353449.png)

vdom（React Element对象）中只记录了子节点，没有记录兄弟节点，因此渲染不可打断

fiber（fiberNode对象）是一个链表，它记录了父节点、兄弟节点、子节点，因此是可以打断的


