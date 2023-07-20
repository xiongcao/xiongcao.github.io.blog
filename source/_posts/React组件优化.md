title: React 组件优化
author: 熊 超
tags:
  - React
categories:
  - React
date: 2022-05-30 13:15:00
---
<!--more-->

正常情况下，父组件状态发生变化重新渲染，会导致子组件也重新渲染，即使子组件依赖的属性在父组件中没有发生改变。

### 一、shouldComponentUpdate(nextProps, nextState)

此方法基本不使用。

可以通过子组件的props与nextProps进行对比，如果值相等，则不渲染

```js
class Child extends Component {

  shouldComponentUpdate(nextProps) {
    if (this.props.name === nextProps.name) {
      return false;
    }
    return true;
  }

  render() {
    console.log('child render')
    return (
      <h3>
        childComponent: {this.props.name}
      </h3>
    )
  }
}

export default class MemoComponent extends Component {

  state = { count: 1 }

  handleAdd = () => {
    this.setState({
      count: this.state.count + 1
    })
  }

  render() {
    console.log('render')
    const { count } = this.state;
    return (
      <div>
        Count: {count}
       <button onClick={this.handleAdd}>Add</button>
       <div>
          <Child name={'张三'}/>
       </div>
      </div>
    )
  }
}
```

### 二、PureComponent

class组件中shouldComponentUpdate方法的替代品

```js
class Child extends PureComponent {

  render() {
    console.log('child render')
    return (
      <h3>
        childComponent: {this.props.name}
      </h3>
    )
  }
}
```

只要父组件的name属性没发生改变，就不会重新渲染Child组件。

但是如果父组件传递的属性值是function或object，情况就有所不同

##### 情况一：子组件还是会重新渲染fn

```js
export default class MemoComponent extends Component {

  render() {
    return (
      <Child name={'张三'} fn={() => {}}/>
    )
  }
}
```

##### 情况二：子组件不会重新渲染fn

```js
export default class MemoComponent extends Component {

  callback = () => { }

  render() {
    return (
       <Child name={'张三'} fn={this.callback}/>
    )
  }
}
```

##### 情况三：子组件不会重新渲染object

```js
export default class MemoComponent extends Component {

  state = { 
    person: {
      name: 'xiaoming',
      age: 18
    }
  }

  changeAge = () => {
    this.setState({
      person: {
        name: 'xiaoming',
        age: this.state.person.age + 1
      }
    })
  }

  callback = () => { }

  render() {
    console.log('render')
    const { person } = this.state;

    return (
      <div>
        <Child name={person.name}/>
        <button onClick={this.changeAge}>Change</button>
      </div>
    )
  }
}


class Child extends PureComponent {

  render() {
    console.log('child render')
    return (
      <h3>
        childComponent: {this.props.name}
      </h3>
    )
  }
}
```

### 三、memo

用于**函数组件**。是class组件中PureComponent的替代品

```js
const Child = memo(({ name }) => {
  console.log('child render')
  return (
    <h3>
      childComponent: {name}
    </h3>
  )
})
```

### 四、useMemo 缓存一个值

```js
const CallBackAndMemo = () => {

  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);

  return (
    <>
      <Child count={count} flag={flag} />
      <button onClick={() => setCount(count + 1)}>Add</button>
      <button onClick={() => setFlag(!flag)}>Toggle</button>
    </>
  )
}


const convert = (flag) => {
  console.log('convert')
  return flag ? 'AAA' : 'BBB';
}

const Child = ({ count, flag }) => {
  const name = convert(flag);

  return (
    <>
      <p>count: {count}</p>
      <p>name: {name}</p>
    </>
  )
}
```

每次更改父组件的count或者flag属性时，都会重新调用convert方法。(上)

```js
const Child = ({ count, flag }) => {
    const name = useMemo(() => {
        return convert(flag)
    }, [flag]);

  return (
    <>
      <p>count: {count}</p>
      <p>name: {name}</p>
    </>
  )
}
```

使用useMemo(() =>{}, [])可以将name值缓存起来，或者传入依赖项，只有在依赖项发生变化时，才会重新调用convert方法。（上）

### 五、useCallback 缓存一个函数

```js
const Child = ({ count, flag }) => {

  const convert = useCallback(() => {
    // 使用useCallback缓存一个函数，函数每次都会被调用，但是参数flag的值不会发生改变
    // 只有当依赖项，传入flag时，才会变化
    console.log('convert', flag)
    return flag ? 'AAA' : 'BBB';
  }, [flag])

  const name = convert(flag);

  return (
    <>
      <p>count: {count}</p>
      <p>name: {name}</p>
    </>
  )
}
```

 useCallback 的功能完全可以由 useMemo 所取代。唯一的区别是：**==useCallback 不会执行第一个参数函数，而是将它返回给你，而 useMemo 会执行第一个函数并且将函数执行结果返回给你==**。



![](/Users/xiongchao/Library/Application%20Support/marktext/images/2023-02-23-21-53-36-image.png)
