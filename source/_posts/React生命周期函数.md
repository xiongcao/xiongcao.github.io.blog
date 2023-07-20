title: React 生命周期函数
author: 熊 超
tags:
  - React
categories:
  - React
date: 2022-05-02 13:15:00
---
<!--more-->


```js
	// unsafe, 组件将要挂载时，render之前
  componentWillMount() {
    console.log('componentWillMount')
  }

  // unsafe, 父组件更改当前组件的属性时，会触发此方法
  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps', nextProps)
  }

  // 组件被挂载后，render之后
  componentDidMount() {
    console.log('componentDidMount')
  }

  // unsafe 组价更新之前
  componentWillUpdate(nextProps, nextState) {
    console.log('componentWillUpdate', nextProps, nextState);
  }

  // 组件更新之后，render之后（初次加载不触发）
  componentDidUpdate(prevProps, prevState) {
    console.log('componentDidUpdate', prevProps, prevState)
  }

  static getDerivedStateFromProps = (props, state) => {
    // 挂载必须经历的生命周期，代替componentWillUpdate, componentWillReceiveProps, componentWillMount
    // 组件每次被rerender的时，包括在组件构建之后(虚拟dom之后，实际dom挂载之前)，每次获取新props或state之后；
    // 每次接收新的props之后都会返回一个对象作为新的state，返回null则说明不需要更新state
    // 此函数是一个静态函数，所以函数体内不能访问this，输出完全由输入决定
    console.log('static getDerivedStateFromProps(props, state)', props, state)
    return state
  }

  // 组件卸载时触发，解绑事件、计时器、异步请求等
  componentWillUnmount() { }
```



#### 挂在阶段：

```js
componentWillMount() {} // 没有挂载 Dom

render() {}

componentDidMount() {}	// 已经挂载 Dom
```

#### 更新阶段：

```js
// props 发生改变后，相应改变组件的一些 state。
// 在这个方法中改变 state 不会二次渲染，而是直接合并 state
componentWillReceiveProps(nextProps) {}

// 判断是否需要更新渲染组件，优化 react 应用的主要手段之一
// 返回 false 就不会再向下执行生命周期了，在这个阶段不可以 setState()，会导致循环调用。
shouldComponentUpdate(nextProps, nextState){
  return false;
}

// Dom 更新前。不可以 setState()，会导致循环调用。
componentWillUpdate(nextProps, nextState){}

render(){}

getSnapShotBeforeUpdate(){}

// 组件更新之后，render之后（初次加载不触发）
componentDidUpdate(prevProps, prevState) {}
```

#### 卸载阶段：

```js
componentWillUnmount() {}
```

#### 在 React 16 中官方已经建议删除以下三个方法，非要使用必须加前缀：`UNSAVE_` 

```js
componentWillMount(){}
componentWillReceivePorps() {}
componentWillUpdate(){}
```

#### 取代这两三个生命周期的以下两个新的：

```js
static getDerivedStateFromProps(nextProps, nextState) {
  // 1.挂载必须经历的生命周期,
  // 代替componentWillUpdate, componentWillReceiveProps, componentWillMount
  
  // 2.组件每次被rerender的时，
  // 包括在组件构建之后(虚拟dom之后，实际dom挂载之前)，每次获取新props或state之后；
  
  // 3.每次接收新的props之后都会返回一个对象作为新的state，返回null则说明不需要更新state
  
  // 4.此函数是一个静态函数，所以函数体内不能访问this，输出完全由输入决定
    console.log('static getDerivedStateFromProps(props, state)', props, state)
    return state
}

getSnapshotBeforeUpdate(prevProps,prevState) {
  
}
```

#### 为什么要废弃三个生命周期

- 被废弃的三个函数都是在render之前，因为fiber的出现，很可能因为高优先级任务的出现打断现有任务导致它们被执行多次。
- componentWillReceiveProps 和 componentWillUpdate 里滥用 setState 导致重复渲染**死循环**的。

1.componentWillMount

这个函数的功能完全可以使用`componentDidMount`和 `constructor`来代替。而如果抛去异步获取数据，其余的即是初始化而已，这些功能都可以在constructor中执行



