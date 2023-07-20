title: React Refs的使用
author: 熊 超
tags:
  - React
categories:
  - React
date: 2022-06-09 13:15:00
---
<!--more-->

### Ref获取Dom元素的几种方式

```jsx
import React, { Component, createRef } from 'react'

export default class Refs extends Component {

  title3 = createRef();

  componentDidMount() {
    console.log(this.refs.title1)
    console.log(this.title2)
    console.log(this.title3.current)
  }

  render() {
    return (
      <div>
        <h2 ref="title1">111</h2>
        <h2 ref={x => this.title2 = x}>222</h2>
        <h2 ref={this.title3}>333</h2>
      </div>
    )
  }
}

```



### Ref获取组件实例

#### 获取 **`class组件`** 实例：

```js
class ChildClass extends Component {

  classTest() {
    console.log('ChildClass')
  }

  render() {
    return (
      <div>ChildClass</div>
    )
  }
}

export default class Refs extends Component {

  title1 = createRef();

  componentDidMount() {
    this.title1.current.classTest(); // print "ChildClass"
  }

  render() {
    return (
      <div>
        <ChildClass ref={this.title1}/>
      </div>
    )
  }
}
```

如果用上述方法获取函数组件实例，会报错：

```js
const ChildFn = function () {

  const fnTest = () => console.log('ChildClass')

  return <div>ChildFn</div>
}

export default class Refs extends Component {

  title1 = createRef();

  componentDidMount() {
    this.title2.current.fnTest()
  }

  render() {
    return (
      <div>
				<ChildFn ref={this.title2}/>
      </div>
    )
  }
}

```



#### 给 **`函数组件`** 设置 ref：

无法获取函数组件实例，但是可以使用**`forwardRef`** 实现 **`ref`** 转发，用于==获取组件内部的某个元素==；

```js
const ChildFn = forwardRef((props, ref) => {

  const fnTest = () => console.log('ChildClass')

  return <div ref={ref}>ChildFn</div>
})


export default class Refs extends Component {

  title1 = createRef();

  componentDidMount() {
    console.log(this.title2.current); // print "<div>ChildFn</div>"
  }

  render() {
    return (
      <div>
				<ChildFn ref={this.title2}/>
      </div>
    )
  }
}
```



### 获取 `函数组件` 的属性和方法

使用`forwardRef` 结合 `useImperativeHandle` 方法获取子组件的属性和方法：

```js
const ChildFn = forwardRef((props, ref) => {

  const fnTest = () => console.log('ChildClass')

  useImperativeHandle(ref, () => {
    return {
      fnTest // 对父组件暴露的属性和方法
    }
  })

  return <div ref={ref}>ChildFn</div>
})


export default class Refs extends Component {

  title1 = createRef();

  componentDidMount() {
    this.title2.current.fnTest() // print "ChildClass"
  }

  render() {
    return (
      <div>
				<ChildFn ref={this.title2}/>
      </div>
    )
  }
}
```



### 合成事件

![image-20230508141147710](/Users/xiongchao/Library/Application Support/typora-user-images/image-20230508141147710.png)

![image-20230508140851198](/Users/xiongchao/Library/Application Support/typora-user-images/image-20230508140851198.png)





<img src="/Users/xiongchao/Library/Application Support/typora-user-images/image-20230508124835057.png" alt="image-20230508124835057"/>