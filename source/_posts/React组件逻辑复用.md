title: React 组件逻辑复用
author: 熊 超
tags:
  - React
categories:
  - React
date: 2022-05-17 13:15:00
---
<!--more-->

## 1、HOC 高阶组件

```js
export const withSize = (Component) => {

  return class toSize extends React.Component {
    state = {
      xPos: document.documentElement.clientWidth,
      yPos: document.documentElement.clientHeight
    };
  
    getPos = () => {
      this.setState({
        xPos: document.documentElement.clientWidth,
        yPos: document.documentElement.clientHeight
      })
    }
  
    componentDidMount() {
      window.addEventListener('resize', this.getPos);
    }
  
    componentWillUnmount() {
      window.removeEventListener('resize', this.getPos);
    }

    render() {
      return <Component {...this.state}/>
    }
  
  }
}
```

```js
const SubWithFoo = withSize(Foo)
const SubWithBar = withSize(Bar)

export default class HOCPage extends React.Component {

  render() {
    return <>
		  <SubWithFoo/>
      <SubWithBar/>
    </>
  }
}
```



### 具体实践

渲染劫持：可以根据部分参数去决定是否渲染组件。

```js
const HOC = (WrappedComponent) =>
  return class extends WrappedComponent {
    render() {
      if (this.props.isRender) {
        return super.render();
      } else {
        return <div>Loading...</div>;
      }
    }
  }
```



权限控制：

```js
function AuthWrapper(WrappedComponent) {
  return class AuthWrappedComponent extends React.Component {
    state = {
      permissionDenied: -1,
    };
        
    render() {
      const { permissionDenied } = this.state;
      if (permissionDenied === -1) {
        return null; // 鉴权接口请求未完成
      }
      if (permissionDenied) {
        return <div>功能即将上线，敬请期待~</div>;
      }
      return <WrappedComponent {...this.props} />;
    }
  }
}
```



登录态的判断：

```js
const isLogin = !!localStorage.getItem('token');
const checkLogin = (WrappedComponent) => {
  return (props) => {
    return (isLogin ? <WrappedComponent {...props}/> : <LoginPage/>)
  }
}

class RawUserPage extends Component {...}
const UserPage = checkLogin(RawUserPage);
```



##### 缺陷：

- 丢失静态函数
- refs属性不能透传



#### 丢失静态函数

当我们应用`HOC`去增强另一个组件时，我们实际使用的组件已经不是原组件了，所以我们拿不到原组件的任何静态属性，我们可以在`HOC`的结尾手动拷贝他们：

```js
function proxyHOC(WrappedComponent) {
  class HOCComponent extends Component {
    render() {
      return <WrappedComponent {...this.props} />;
    }
  }
  HOCComponent.staticMethod = WrappedComponent.staticMethod;
  // ... 
  return HOCComponent;
}
```

#### refs属性不能透传

使用高阶组件后，获取到的`ref`实际上是最外层的容器组件，而非原组件，但是很多情况下我们需要用到原组件的`ref`。

高阶组件并不能像透传`props`那样将`refs`透传，我们可以用一个回调函数来完成`ref`的传递：

```js
function hoc(WrappedComponent) {
  return class extends Component {
    getWrappedRef = () => this.wrappedRef;
    render() {
      return <WrappedComponent ref={ref => { this.wrappedRef = ref }} {...this.props} />;
    }
  }
}
@hoc
class Input extends Component {
  render() { return <input></input> }
}
class App extends Component {
  render() {
    return (
      <Input ref={ref => { this.inpitRef = ref.getWrappedRef() }} ></Input>
    );
  }
}
```



## 2、render props

```js
class MouseTracker extends React.Component {
  state = {
    x: 0,
    y: 0,
  }

  handleMouseMove = event => {
    this.setState({
      x: event.clientX,
      y: event.clientY,
    })
  }

  render() {
    return (
      <div onMouseMove={this.handleMouseMove} >
        {this.props.render(this.state)}
      </div>
    )
  }
}
```

```js
import MouseTracker from './MouseTracker'

function Tracker() {
  return (
    <MouseTracker
      render={props => (
        <div style={{ height: '100vh' }}>
          {props.x},{props.y}
        </div>
      )}
    />
  )
}
```



## 3、自定义Hooks

```js
export const useTracking = () => {
  const [tracking, setTracking] = useState({});

  useDeepEffect(
    () => {
      switch (tracking.eventType) {
        case 'pageview':
          gaPageView(tracking);
          gaFunnelStep(tracking.funnelStep, tracking.eventName);
          break;
        default:
          gaNewEvent(tracking);
          break;
      }
    },
    [tracking],
  );
  // Return enabled state and setter for tracking
  return [tracking, setTracking];
};
```

```js
const useError = () => {
  const { setError, cleanError, cleanToastBanner } = useContext(ErrorBoundaryContext);
  return { setError, cleanError, cleanToastBanner };
};
```



**好处:**

1. 跨组件复用: 其实 render props / HOC 也是为了复用，相比于它们，Hooks 作为官方的底层 API，最为轻量，而且改造成本小，不会影响原来的组件层次结构和传说中的嵌套地狱；
2. 类定义更为复杂

- 不同的生命周期会使逻辑变得分散且混乱，不易维护和管理；
- 时刻需要关注this的指向问题；
- 代码复用代价高，高阶组件的使用经常会使整个组件树变得臃肿；

3. 状态与 UI 隔离: 正是由于 Hooks 的特性，状态逻辑会变成更小的粒度，并且极容易被抽象成一个自定义 Hooks，组件中的状态和 UI 变得更为清晰和隔离。





