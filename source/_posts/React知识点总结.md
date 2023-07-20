title: React 知识点总结
author: 熊 超
tags:
  - React
categories:
  - React
date: 2022-08-30 13:15:00
---
<!--more-->

![image-20230422145757216](/Users/xiongchao/Library/Application Support/typora-user-images/image-20230422145757216.png)

**React 副作用**：是在组件渲染期间发生的任何操作，这些操作不仅仅是更新 DOM。副作用可能包括网络请求、访问本地存储、添加或删除事件监听器等。副作用是与 React 的声明式编程模型相对的



## 什么是React

1. `React` 是一个网页UI框架，通过组件化的方式解决视图层开发复用的问题，本质是一个组件化框架。
2. 它的核心设计思路有三点，分别是声明式、组件化与通用性。
3. **声明式**的优势在于直观与组合。
4. **组件化**的优势在于视图的拆分与模块复用，可以更容易做到高内聚低耦合。
5. **通用性**在于一次学习，随处编写。比如 `React Native`，`React 360` 等，这里主要靠虚拟 `DOM` 来保证实现。
6. 这使得 `React` 的适用范围变得足够广，无论是 `Web`、`Native`、`VR`，甚至 `Shell` 应用都可以进行开发。这也是 `React` 的优势。
7. 但作为一个视图层的框架，`React` 的劣势也十分明显。它并没有提供完整的一揽子解决方案，在开发大型前端应用时，需要向社区寻找并整合解决方案。虽然一定程度上促进了社区的繁荣，但也为开发者在技术选型和学习适用上造成了一定的成本。



## 什么是JSX

##### `React`本身并不强制使用`JSX`：

```jsx
class Hello extends React.Component{
  render() {
    return React.createElement(
    	'div',
      null,
      `hello ${this.props.toWhat}`
    );
  }
}

ReactDOM.render(
	React.createElement(Hello, {toWhat, 'World'}, null),
  document.getElementById('root')
)
```

React 需要将组件转化为虚拟 DOM 树；



**XML**在树结构的描述上天生具有可读性强的优势。

```jsx
class Hello extends React.Component{
  render() {
    return <div>Hello {this.props.toWath}</div>
  }
}

ReactDOM.render(
  <Hello toWhat="world"/>
  document.getElementById('root')
)
```

#### 模板

以`AngularJS` 为例

```html
<!doctype html>
<htmlng-app="docsBindExample">
	<head>
    <script src="http://code.angularjs.org/1.2.25/angular.min.js"></script>
    <script src="scriptjs"></script>
  </head>
  <body>
  <div ng-controller"Ctrl1"
    Hello <input ng-model='name'> <hr/>
    <span ng-bind="name"></span> <br/>
    <span ng:bind="name"></span> <br/>
    </div>
  </body>
</htmlgn-app>
```



#### 模板字符串

```js
var box = jsx`
	<${Box}>
	${
		shouldShowAnswer(user) ?
    jsx`<${Answer}></${Answer}>` :
		jsx`<${Box.Comment}>Text Content</${Box.Comment}>`
	}
	</${Box}>
`;
```



#### 总结

<img src="/Users/xiongchao/Library/Application Support/typora-user-images/image-20230422151324886.png" alt="image-20230422151324886" style="zoom:33%;" />

1. `JSX` 是一个 `JavaScript` 的语法扩展，结构类似于`XML`。

2. `JSX`主要用来声明`React`元素，但React并取强制要求是用`JSX`，即使使用了`JSX`，也会在构建的过程中通过`babel`插件转化为`React.CreateElement`，所以`JSX`更像是`React.CreateElement`的语法糖，可以看出`React`团队并不想引入`JavaScript`本身以外的开发体系，而是通过合理的关注点分离保持组件开发的纯粹性。

3. 对比
   1. 模板：引入模板语法和模板指令等概念是一种不佳的实现方案；
   2. 模板字符串：造成多次嵌套，使整个结构变的复杂，并且优化代码提示也会变的困难重重
   3. `JXON`：同样因为语法提示问题被`React`放弃

最后选用了`JSX`，因为`JSX`与其设计思想贴合，不需要引入过多新的概念，对代码编辑器的提示也极为友好。



## 如何避免生命周期的坑

- 在不恰当的时机调用了不合适的代码
- 在需要调用时，却忘记了调用



#### 建立时机与操作的对应关系

<img src="/Users/xiongchao/Library/Application Support/typora-user-images/image-20230422160931659.png" alt="image-20230422160931659" style="zoom:33%;" />



<img src="/Users/xiongchao/Library/Application Support/typora-user-images/image-20230422154005672.png" alt="image-20230422154005672" style="zoom:33%;" />



#### 社区中去除 constructor 的原因

- `constructor` 中并不推荐去处理初始化以外的逻辑；
- `constructor` 不属于 `React` 的生命周期，只是 `Class` 的初始化函数；
- 通过移除 `constructor`，代码也会变得更简洁；



#### 挂载阶段

##### `getDerivedStateFromPorps`

本函数的作用是使组件在 `props` 变化时更新 `state`。

触发时机：（只要父级组件重新渲染时就会被调用）

- 当 `props` 被传入时；
- `state` 发生改变时；
- `forceUpdate` 被调用时；



==你可能不需要使用派生state==。两种反模式使用方式：

- 直接复制 `props` 到 `state`
- 在 `props` 变化后修改 `state`

这两种写法，==除了增加代码的维护成本外，没有任何好处==。





##### `UNSAFE_componentWillMount`

用于组件将加载前做某些操作，但目前被标记为弃用。因在 React 异步渲染机制下，该方法==可能被多次调用==。

常见的错误是：和服务器端同构渲染的时候，如果在该函数里面发起网络请求，会在服务端和客户端分别执行一次。



##### `render`

`render` 函数返回的 `JSX` 结构，用于描述具体的渲染内容。

不应该在`render` 函数里面产生任何副作用，比如使用`setState`或者`绑定事件`。

render函数在每次渲染时都会被调用，而`setState`会触发渲染，会造成死循环。绑定事件会被频繁调用注册。



#### 更新阶段

指外部 `props` 传入，或 `state` 发生变化时的阶段。



<img src="/Users/xiongchao/Library/Application Support/typora-user-images/image-20230422162105242.png" alt="image-20230422162105242" style="zoom: 50%;" />



`UNSAFE_componentWillReceiveProps`：在`getDerivedStateFromPorps`存在时，不会被调用。

`UNSAFE_componentWillUpdate`：因为在后续的React异步渲染设置中，可能会==出现暂停更新渲染==的情况；

`getSnapshotBeforeUpdate`： 返回值会作为 `componentDidUpdate` 的第三个参数使用。



#### 卸载阶段

`componentWillUnmount`

主要用于执行清理工作。一定要在该阶段解除事件绑定，取消定时器。

不然会导致定时器在组件销毁后一直在不停地执行；



#### 职责：

- 什么情况下会触发重新渲染？
- 渲染中发生报错后会怎样? 该如何处理?



##### 函数组件：

任何情况下都会重新渲染，没有生命周期，官方提供`React.memo`优化手段。

`React.memo`并不是阻断渲染，而是==跳过渲染组件的操作，并直接复用最后一次渲染的结果==



##### `React.Component`：

不实现 `shouldComponentUpdate` 函数，有两种情况触发重新渲染

1. 当 state 发生变化时
2. 当父级组件的 Props 传入时



##### `React.PureComponent`：

默认实现了 `shouldComponentUpdate` 函数
仅在 `props` 与 `state` 进行浅比较后，确认有变更时才会触发重新渲染。



#### 错误边界：

```js
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error) {
		// 更新state使下一次渲染能够显示降级后的UI
    return { hasError: true }
  }
  
	componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true });
    // You can also log the error to an error reporting service
    logErrorToMyService(error, info);
  }
}
```

`componentDidCatch`：捕获报错的具体类型，并将错误类型上传到服务端去。

用户执行某个操作时，触发了bug，引发了崩溃，页面会突然白屏，但渲染时的报错，只能通过 `componentDidCatch` 捕获。这是在做线上错误监控时，极其容易忽略的点。





## React 的请求应该放在哪里，为什么？

对于异步请求，应放在 `componentDidMount` 中操作从时间顺序看，除 `componentDidMount` 还可以有以下选择：

- `constructor`：可放，从设计言不推荐，主要用于初始化 `state` 与函数绑定，不承载业务逻辑且随着类属性流行，`constructor` 已很少用
- `componentWillMount`：已被标记废弃，在新的异步渲染架构下会触发多次渲染，易引发 Bug，不利未来 React 升级后的代码维护





## 类组件和函数组件的区别？

#### 相同点：

函数组件和类组件==使用方式==和==最终呈现效果==上是完全一致的。

很难从使用体验上区分两者，而且现代浏览器，闭包和类的性能是在极端场景下才会有区别。所以基本认为两者作为组件是完全一致的。



#### 不同点：

**基础认知**：本质上代表两种==不同设计思想==与心智模式

- 类组件的根基是 `OOP`，面向对象编程；
- 函数组件的根基是 `FP`，也就是函数式编程；

函数式编程：假定输入和输出，存在某种特定的映射关系时，那么输入一定的情况下，输出必然是确定的。

本质上，最大的不同：==相较于类组件，函数组件更纯粹、简单、易测试==。

**使用场景：**

- 在不使用 Recompose 或者 `Hooks` 的情况下如需使用生命周期，就用类组件，限定场景是固定的。
- 在 recompose 或 `Hooks` 的加持下，类组件与函数组件的能力边界完全相同，都可使用类似生命周期等能力

**设计模式：**

- 类组件可以实现继承
- 函数组件缺少继承能力

`React`不推荐使用继承，组合由于继承

**未来趋势：**

==函数组件==成为了社区未来主推的方案。

类组件不能适应未来趋势的原因：

- `this` 的模糊性
- 业务逻辑散落在生命周期中
- React组件，代码缺少标准的拆分方式

使用`Hooks`函数组件可以提供比原生更细腻的逻辑组织与复用，而且能更好的适应时间切片与并发模式。



## 如何设计React组件

- 把只作展示、独立运行、不额外增加功能的组件，称为哑组件或无状态组件、==展示组件==；
- 把处理业务逻辑与数据状态的组件称为有状态组件、==灵巧组件==。灵巧组件一定包含至少一个灵巧组件或展示组件。

#### 展示组件

展示组件受制于外部的 props 控制，具有极强的通用性，复用率很高

**代理组件**：常用于封装常用属性，减少重复代码。

即对UI库的二次封装，对于常用属性给默认值，如果需要修改属性，直接传入props覆盖默认值即可。

虽然这样的封装看起来多此一举，但是切断了外部组件的强依赖性。

两个问题：

- 如果当前组件库不能使用，是否能实现业务上的无痛切换；
- 如需批量修改基础组件的字段，如何解决?

==代理组件的设计模式==很好地解决了以上问题业务上看，代理组件隔绝 `Antd`，仅是一个组件 `Props API` 层的交互

**样式组件**：也是一种代理组件，只是又细分了处理样式领域，将当前的关注点分离到当前组件内

<img src="/Users/xiongchao/Library/Application Support/typora-user-images/image-20230422212924455.png" alt="image-20230422212924455" style="zoom: 33%;" />

复杂的样式管理对于Button是没有意义的，如果直接使用Button在属性上进行修改，对于工程代码而言，这是编写大量的面条代码。StyleButton的思路就是，样式判断逻辑附令到自身上来，面向未来改动的时候会更加友好。

**布局组件**基本设计与样式组件完全一样，基于自身特性做了一个小小的优化



### 灵巧组件

灵巧组件面向业务，功能更丰富、复杂性更高，复用度更低；

展示组件专注于组件本身特性，灵巧组件专注于组合组件。

#### 容器组件

几乎没有复用性，主要用在**拉取数据**与组合组件两个方面。（没有冗余的样式和逻辑处理）

#### **高阶组件**：

React 中复用组件逻辑的高级技术，是基于 React 的组合特性形成的设计模式；

高阶组件的参数是组件，返回值为新组件的函数。

作用：

- 逻辑复用
- 链式调用
- 渲染劫持

例子：登录态的判断。【数据埋点】

<img src="/Users/xiongchao/Library/Application Support/typora-user-images/image-20230422214100912.png" alt="image-20230422214100912" style="zoom:33%;" />



例子：渲染劫持

通过控制 `render` 函数修改输出内容，常见的场景是显示加载元素

<img src="/Users/xiongchao/Library/Application Support/typora-user-images/image-20230422214742426.png" alt="image-20230422214742426" style="zoom:33%;" />



##### 缺陷：

- 丢失静态函数
- refs属性不能透传

使用Storybook工具对basic组件进行组件管理



## setState 是同步更新还是异步更新



#### 合成事件：

1. React 给 document 挂上事件监听
2. DOM 事件触发后冒泡到 document
3. React 找到对应的组件造出一个合成事件出来
4. 并按组件树模拟一遍事件冒泡

##### React 17 之前的事件冒泡流程图：

事件委托挂载在document上

<img src="/Users/xiongchao/Library/Application Support/typora-user-images/image-20230509160751578.png" alt="image-20230509160751578" style="zoom:50%;" align="left"/>

##### React 17 之后的事件冒泡流程图：

事件委托不再挂载在document上，而是挂载在DOM容器上

<img src="/Users/xiongchao/Library/Application Support/typora-user-images/image-20230509160859820.png" alt="image-20230509160859820"  style="zoom:50%;" align="left"/>



```js
class Coun t extends Component{
  state = {
    count:0
  }
  	
  componentDidMount(){
    this.setState({
      count: this.state.count + 1
    }, () => {
      console.log(this.state.count) // 1
    })
	
    this.setState({
      count: this.state.count + 1
    }, () => {
      console.log(this.state.count) // 1
    })
  }
  
   componentDidMount(){
    this.setState(preState => {
      count: preState.count + 1
    }, () => {
      console.log(this.state.count) // 1
    })
	
    this.setState(preState => {
      count: preState.count + 1
    }, () => {
      console.log(this.state.count) // 2
    })
  }
  
}
```

**是否觉得 React 的 setState 执行像是一个队列?**
React 根据队列逐一执行，合并 state 数据完成后执行回调，根据结果更新虚拟 DOM触发渲染。

**异步更新（非真异步）**——原因：

- 保持内部的一致性（如果把setState改成同步了，但是props不是）
- 启用并发更新

在源码中，通过`isBatchingUpdates`判断`setStates`是先存进队列还是直接更新。true：执行异步操作，false：直接更新。

在 React 的生命周期事件和合成事件中可拿到`isBatchingUpdates` 控制权将状态放进队列，控制执行节奏。



#### setState 之后发生了什么

`React` 利用状态队列机制实现了 `setState` 的“异步”更新，避免频繁的重复更新 `state`。

首先将新的 `state` 合并到状态更新队列中，然后根据更新队列和 `shouldComponentUpdate` 的状态来判断是否需要更新组件。

在“异步”中，

如果对同一个值进行多次`setState`，`setState`的批量更新策略会对其进行覆盖，取最后一次的执行；

如果是同时`setState`多个不同的值，在更新时会对其进行合并批量更新。

```jsx
class Demo extends Component {

  state = {
    count: 1,
    number: 2
  }

  handleAdd = () => {
    this.setState({ count: 2 })
    this.setState({ count: 3 })
    this.setState({number: 100})
    this.setState({number: 200})
  }

  render() {
    const { count, number } = this.state;
    console.log(count, number); // 点击之后，只会打印一次
    return (
      <div>
        count: {count} - number: {number}
        <button onClick={this.handleAdd}>Add</button>
      </div>
    )
  }
}
```

`setState` 本身代码的执行肯定是同步的，这里的异步是指是多个 state 会合成到一起进行批量更新。 同步还是异步取决于它被调用的环境。

- 如果 `setState` 在 React 能够控制的范围被调用，它就是**异步**的；
- 如果 `setState` 在原生 JavaScript 控制的范围被调用，它就是**同步**的；

1.异步情况：在`合成事件处理函数`，`生命周期函数`

2.同步情况：在`原生事件处理函数`，`定时器回调函数`，`Ajax 回调函数`

```js
//setTimeout事件
import React,{ Component } from "react";
class Count extends Component{
    constructor(props){
        super(props);
        this.state = {
            count:0
        }
    }
  
   componentDidMount(){
        //自定义dom事件，也是同步修改
        document.querySelector('#btn').addEventListener('click',()=>{
            this.setState({
                count: this.state.count + 1
            });
            console.log(this.state.count); // 1
        });
    }
  
   btnAction = ()=>{
				// 如果在这里执行setState，则是异步的；
    		    
        setTimeout(()=>{
	          // 这里则是同步的
            this.setState({
                count: this.state.count + 1
            });
            console.log(this.state.count); // 1
        })
    }


    render(){
        return (
            <>
                <p>count:{this.state.count}</p>
                <button onClick={this.btnAction}>增加</button>
								<button id="btn">绑定点击事件</button>
            </>
        )
    }
}

export default Count;

```



笔试题：

```js
class Count extends Component{
  state = {
    count:0
  }
  	
  componentDidMount(){
    this.setState({ count: this.state.count + 1 }) // this.state.count是0
    console.log(this.state.count) // 0
	
    this.setState({ count: this.state.count + 1 }) // 这里的 this.state.count 还是0
    console.log(this.state.count) // 0
    
    setTimeout(() => {
      this.setState({ count: this.state.count + 1 }) // 这里的 this.state.count 是 1
    	console.log(this.state.count) // 2
      
      this.setState({ count: this.state.count + 1 })
    	console.log(this.state.count) // 3
	
    })
  }
}
```



## 如果面向组件跨层通信

<img src="/Users/xiongchao/Library/Application Support/typora-user-images/image-20230422222202723.png" alt="image-20230422222202723" style="zoom:38%;" />



`Context` 存储的变量难以追溯数据源以及确认变动点。当组件依赖`Context`时，会提升组件耦合度，不利于组件的复用与测试。





## Virtual DOM的工作原理是什么

Fackbook的初衷

- 简化前端开发
- 防止XSS。

==通过虚拟DOM来规避风险==。因为直接操作DOM会带来XSS的风险，也可能因为技术水平的限制，带来性能的问题。（如果你心爱的东西不喜欢有人去触碰，最好的办法是把它封起来，与使用者相隔离，因此有了我们今天看到的虚拟DOM）

1. `JSX` 所描述的结构，会转译成 `React.createElement` 函数：

```js
// JSX描述
<input type="button"/>
  
// Babel转义后
React.createElement('input', { type: 'button '})
```

2. React 会持有一颗虚拟 DOM 树。在状态变更后，会触发虚拟 DOM 树的修改，再以此为基础修改真实 DOM

`React.createElement` 返回的结果应是一个 `JavaScript` `obiect`

```js
{
  tag: 'input',
  props: {
		type: 'button'
  },
  children: []
}
```

**diff 函数**，去计算状态变更前后的虚拟 DOM 树差异；

**渲染函数**，渲染整个虚拟 DOM 树或者处理差异点；



### 优势

- 性能优越
- 规避XSS
- 可跨平台（RN，小程序）



#### 边界：

大量的直接操作 DOM 容易引起网页性能下降。这时 React 基于虚拟 DOM 的 diff 处理与批处理操作，可降低 DOM 的操作范围与频次，提升页面性能

**什么时候虚拟DOM慢呢？**

首次渲染或者微量操作的时候，虚拟DOM就会比真实的DOM更慢。



**虚拟 DOM 一定可以规避 XSS 吗?**

虚拟 DOM 内部确保字符转义，确实可做到这点，但 React 存在风险，因为 React 留有 `dangerouslySetlnnerHTML` API 绕过转义。



**跨平台的成本更低**

在 React Native 后，前端社区从虚拟 DOM 中体会到跨平台的无限前景，所以在后续发展中，都借鉴虚拟 DOM。



### 缺点

- 内存占用较高
- 无法进行极致优化

因为当前网页的虚拟DOM包含真实DOM的完整信息，而且由于是Object，内存占用肯定会有所上升。

虽然虚拟DOM足以应对绝大部分应用的性能要求，但在一些性能要求高的应用中无法进行针对性的优化。





## 与其他框架相比，React的diff有何不同

diff算法是指，生成更新补丁的方式。主要应用于虚拟DOM树变化，更新真实DOM。

1. 真实的 DOM 首先会映射为虚拟 DOM；
2. 当虚拟 DOM 变化后，会根据差异计算生成 patch。patch 是结构化的数据，包含增加、更新、移除等；
3. 根据 patch 去更新真实的DOM，反馈到用户界面上



![image-20230423111726301](/Users/xiongchao/Library/Application Support/typora-user-images/image-20230423111726301.png)



diff算法：

- 更新时机——触发更新、进行差异对比的时机。（setState，hooks调用之后，此时树的节点发生变化，开始比对）
- 遍历算法——深度优先遍历
- 优化策略

> 深度优先遍历——从根节点出发，沿着左子树方向进行纵向遍历，直到找到叶子节点为止然后回溯前一个节点，进行右子树节点遍历，直到遍历完所有可达节点

虽然`深度优先遍历`保证了组件的生命周期时序不错乱，但传统的 diff 算法带来一个严重的性能瓶颈，复杂程度为 O(n3)，其中 n 表示树的节点总数。

React 用了一个非常经典的手法将复杂度降低为 O(n)就是分治，即通过`“分而治之”`这一巧妙的思想分解问题。

将单一节点比对，转化为了三种类型节点比对。React从==树、组件、元素==三个方面进行了优化。

##### 策略一：忽略节点跨层级操作场景，提升比对效率；

需进行==树比对==，即对树进行分层比较两棵树==只对同一层次节点进行比较==，如发现节点已不存在则该节点及其子节点会被完全删除，不会用于进一步比较提升了比对效率

##### 策略二：如果组件的 class 一致，则默认为相似的树结构，否则默认为不同的树结构

如果组件是同一类型则进行树比对，如果不是则直接放入补丁中。

只要父组件类型不同，就会被重新渲染，这就是`shouldComponentUpdate`/`PureComponent`/`React.memo`可以提高性能的原因

##### 策略三：同一层级子节点，可通过标记 key 的方式进行列表对比。

元素比对主要发生在同层级中，通过标记节点操作生成补丁。

节点操作包含了插入、移动、删除等。

其中节点排序，同时涉及插入、移动、删除三个操作，所以效率消耗最大，此时策略三起到了至关重要的作用。

通过标记 key 的方式，React 可以直接移动 DOM 节点，降低内耗



#### Fiber

react16引入了fiber机制，进行了优化。

1、Fiber 机制下节点与树分别采用 FiberNode 与 FiberTree 进行重构

- FiberNode使用了双链表的结构，可以直接找到兄弟节点和子节点，使得整个更行过程可以随时暂停、恢复。
- FiberTree是通过FiberNode构成的树。

2、Fiber 机制下整个更新过程由 current 与 worklnProgress 两株树，双缓冲完成

- 当worklnProgress更新完成后，通过修改current的相关指针指向的节点，直接抛弃老树。虽然非常简单粗暴，却非常合理。



#### 其他框架

PReact  diff 算法相较于React，整体设计思路相似。

最层次的元素采用真实DOM对比操作，并没有采用Fiber的设计。



Vue 2.0 使用了 **snabbdom**，整体思路与 React 相同。

但在元素对比时，如果新旧两元素是同一元素，且没有设置 key 时，snabbdom 在 diff 子元素中会一次性对比==旧节点==、==新节点==及它们的==首尾元素==四个节点，以及==验证列表==是否有变化。

Vue3.0 整体变化不大。



最后

React拥有完整的diff算法策略，且拥有随时中断更新的时间切片能力。在大批量更新的极端情况下，拥有更友好的交互体验。

PReact可以在一些对性能要求不高，仅需要渲染的简单场景下使用。

Vue的diff策略整体与React对齐，虽然缺乏时间切片能力，但并不意味这Vue的性能更差，因为在Vue3初期引入过，后来因为收益不高移除掉了。除了高帧率动画、其他场景几乎都可以防抖节流去提高乡音性能。



##### 如何根据React diff算法原理优化代码？

- 根据 diff 算法的设计原则，应尽量避免跨层级节点移动，
- 通过设置唯一 key 进行优化，尽量减少组件层级深度，因为过深的层级会加深遍历深度，带来性能问题
- 设置 shouldComponentUpdate 或者 React.pureComponet 减少 diff 次数





## React的渲染异常会造成什么后果

“错误边界” 相关内容：如果渲染异常，在没有任何降级保护措施的情况下，页面会直接显示白屏。

通用方案：`getDerivedStateFromError`/`componentDidCatch`

`getDerviedStateFromError`和`componentDidCatch`的区别是前者展示降级UI，后者记录具体的错误信息，它只能用于class组件

```js
class ErrorBoundary extends React.Component{
  constructor(props){
    super(props)
    this.state={
      hasError:false
    }
  }
  staic getDerivedStateFromError(){
    return { hasError:true}
  }
  componentDidCatch(err,info){
    console.error(err,info)
  }
  render(){
    if(this.state.hasError){
      return <div>Oops,err</div>
    }
    return this.props.children
  }
}
```

==错误边界无法捕获自身的错误，也无法捕获事件处理、异步代码(setTimeout、requestAnimationFrame)、服务端渲染的错误==

#### 预防

在渲染层，render 中 return 后的 JSX，都是在进行数据的拼装与转换

- 如果在拼装的过程中出现错误，那直接会导致编译的失败
- 但如果在转换的过程中出现错误，就很不容易被发现

前端数据基本上都是通过后端业务接口获取，那么是数据否可靠，就成为了一个至关重要的问题。

这个问题被称为`null-safety`，也就是`空安全`，目前对于这个问题比较成熟的解决方案是使用`idx`

`idx` 在使用时需要配置 `Babel` 插件，再引入`idx` 库。然后通过 `idx` 函数包裹需要使用的 `object`，再在回调函数中取需要的值。

idx的代码既不优雅，也不简洁，还需要引入babel插件，所以使用者寥寥无几。

##### 优雅的解决方案：

Es202，可选链操作符



#### 兜底

应该限制崩溃的层级。错误边界加到哪里，崩溃就止步于哪里，其他组件还可正常使用；

所以只需给关键的 UI 组件添加错误边界，那就可应用==高阶组件（或者自定义hooks）==



需保障方案在项目中的覆盖量，统计兜底页面成功兜底次数，最后兜底页面展示时能及时完成线上报警。

每个公司至少会接入统计工具，如百度统计、Google 统计完成业务分析，只需在代码中，添加一行统计代码





## 如何提升React代码的可维护性



### 1、预防与兜底

预防：从上线前开始可对代码做哪些措施防止出现线上问题
兜底：上线后又可以做哪些方案加快线上故障的定位速度



#### 预防

通过使用人工或者工具审查的方式去实现。

**人工审查**代码的方式，标准称谓是 **Code Review**基于React 写法的易错点，团队内部会总结出一些实践准则。

**工具审查**的方式，标准称谓是**静态代码检查工具**（`ESLint`）



#### 兜底

在线环境的代码通常是经过 `UglifyJS` / `terser`混淆并压缩的，所以直接看报错信息不能得知对应的源码是什么样的，不利于排查问题。

最理想的情况莫过于改造编译流水线，在发布过程中上传 sourcemap 到报错收集平台。

在 Webpack 中添加 sourcemap 相关插件就可在编译过程，直接上传 sourcemap 到 Sentry 的报错平台

<img src="/Users/xiongchao/Library/Application Support/typora-user-images/image-20230423171320325.png" alt="image-20230423171320325" style="zoom:33%;" />

在使用 Sentry 捕获报错时，就能够直接查看对应的源码了：

<img src="/Users/xiongchao/Library/Application Support/typora-user-images/image-20230423171409595.png" alt="image-20230423171409595" style="zoom:33%;" />

使用 Mozilla 开源的工具 sourcemap，直接恢复对应的源代码信息。



### 2、可改变性

从代码层面来讲，可变性代表了**代码的可拓展能力**。

两个思路提升代码的可拓展性：

- 从组件的角度出发，通过分离容器组件与展示组件的方式分离模块。其中推荐了 Storybook 来沉淀展示组件。
- 框架状态管理框架中有相对成熟的设计模式，比如 Redux 中的action、reducer 等，它的边界很清楚很容易明白业务逻辑该如何拆解、如何放入模块中。



### 3、稳定性

在前端项目中，无论是单元测试还是集成测试，整体覆盖比例都很低。常常通过人工测试“点点点”的方式保证稳定性。

前端测试并不好写。针对 UI 层不好写：

国内业务迭代模式都非常快，快到 UI层难以有稳定的测试代码，所以通常不会花太多时间去写组件的测试。基于实际情况，有条件写测试的话，也是尽量给**核心业务写测试**，更利于整体项目的稳定性。



### 4、依从性

遵循约定，提升代码可读性、减少人为因素，加强工具干预：

- 针对样式的Stylelint
- 针对JS的ESLint
- 针对代码提交的commitlint
- 针对编辑器风格的Editorconfig
- 针对代码风格的Prettier





## React Hooks使用限制有哪些？



#### 为什么使用Hooks

##### 1、组件之间难以复用状态逻辑

如果涉及场景更复杂，多级组件需共享状态，就需使用 Redux 或 Mobx 来解决了。

既然是每个人都遇到的问题，最好考虑从 React 层提供 API 来解决。（高阶组件）

##### 2、复杂的组件变得难以理解

主要指出生命周期函数没能提供最佳的代码编程实践范式

如 `componentDidMount`，在这里设置页面标题、拉取用户信息、拉取按钮权限信息。`ComponentDidMount` 函数内部逻辑随意堆砌，内容杂乱，缺乏专注性，往往还会对上下文产生依赖。

在componentDidMount中使用事件注册、订阅消息等，都需要在componentWillUnmount中去取消它。订阅与取消订阅并没有直接关联在一起，而是通过生命周期函数去使用这非常的反模式，也就导致组件难以分解，且到处都是状态逻辑。

##### 3、人和机器都容易混淆类

- `this` 首当其冲，值捕获的问题。
- 还有一个与 `this` 相关的问题，就是用 `bind` 函数包一下来绑定事件。虽然现在通过了类属性方案，也可使用Babel 插件提前开发，但整个提案仍是草案阶段。
- 在类中难以做编译优化，`React` 团队一直在做前端编译层的优化工作，如常数折叠、内联展开及死码删除。



#### 方案：

- 不要在 React 的循环、条件或嵌套函数中调用 Hook。
- 在React函数组件中调用Hook



#### 防范措施

因 React 的内在设计原理，所以不可能绕过限制规则，但可在代码中禁止错误的使用方式。

工程化的东西最终应落地到工具上，其实只需在 ESLint 中引入 eslint-plugin-react-hooks 完成自动化检查就可以了在处理代码编写方式问题时，应优先想到从 Lint 工具入手





## useEffect 与 useLayoutEffect的区别



#### 相同点

##### 使用方式上：

useLayoutEffect 的函数签名与 useEffect 相同，使用方式完全一致，甚至在一定程度上可以相互替换。

##### 运行效果：

useEffect 与 useLayoutEffect 两者都是用于处理副作用。这些副作用包括改变 DOM、设置订阅、操作定时器等



#### 不同点

##### 使用场景： 

大多数场景下可直接使用 useEffect，但代码引起页面闪烁，就推荐使用useLayoutEffect 处理

如有直接操作 DOM 样式或引起 DOM 样式更新的场景，更推荐使用 useLayoutEffect

##### 独有能力：

- Effect：异步处理副作用；
- LayoutEffect：同步处理副作用；



#### 设计原理

标记为 HookLayout 的 effect 会在所有的 DOM 变更之后同步调用，所以可以使用它来读取 DOM 布局并同步触发重渲染。

计算量较大的耗时任务必然会造成阻塞，所以就需根据实际情况酌情考虑。如果非必要情况下，使用标准的 useEffect 可以避免阻塞



### useEffect 依赖为空数组与 componentDidMount 区别

在 `render` 执行之后，`componentDidMount` 会执行，如果在这个生命周期中再一次 `setState` ，会导致再次 `render` ，返回了新的值，浏览器只会渲染第二次 `render` 返回的值，这样可以避免闪屏。

但是 `useEffect` 是在真实的 DOM 渲染之后才会去执行，这会造成两次 `render` ，有可能会闪屏。

实际上 `useLayoutEffect` 会更接近 `componentDidMount` 的表现，它们都同步执行且会阻碍真实的 DOM 渲染的。
