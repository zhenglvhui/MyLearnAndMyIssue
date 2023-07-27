# react Hooks

## 为什么会出现 Hooks

在 hooks 出现之前，react 有两种创建组件的方式，一种是`类组件`，另外一种则是`函数式组件`。纯函数组件比起类组件多出了以下几种特点：

- 函数式组件没有状态
- 函数式组件没有生命周期
- 函数式组件没有 this
- 只能是纯函数

这就注定了之前函数式组件实现的功能比较局限，只能做 UI 展示相关的功能，涉及到状态切换或者其他比较复杂的功能，我们不得不通过类组件的方式来实现。这也会使得大型组件很难进行拆封，及时封装成多个组件，组件中的通讯也会比较的繁琐，也会因此出现大量的重复逻辑。
`所以为了解决上面提到的问题，React设计团队React Hooks来解决这个问题。`

## 什么是 Hooks

hooks 是钩子的意思，函数式组件是纯函数，所以如果我们需要`外部的功能或者副作用`就需要通过'钩子'将其'钩'进来,从而达到实现复杂功能的目的。React 为我们提供了默认的钩子，最常使用到的有 4 个钩子。

- useState()
- useEffect()
- useContext()
- useReducer()

不同的钩子可以引入外部不同的功能，对于钩子我们通常定义 `use 作为前缀来命名`。所以在我们自定义钩子的时候，最好也以相同的规范来定义。

## 4 种常用钩子的基本使用

### 一、useState() 状态钩子

我们都知道纯函数没有状态，所以 useState 是一个状态钩子，我们可以通过 useState 来引入状态，如下：计数器的实现

```javascript
import { useState } from "react";

function Counter(props) {
  let [count, setCount] = useState(0);
  const changeCount = (steps) => {
    setCount(count + steps);
  };
  return (
    <div>
      {count}数量
      <button onClick={() => changeCount(+1)}>+</button>
      <button onClick={() => changeCount(-1)}>-</button>
    </div>
  );
}

export default Counter;
```

这相对于 class 写法，代码会看起来更加的简洁易懂。在 useState 函数中的参数表示该变量的初始值，而数组中的第一项则表示变量，指向转态的当前值，相当于 this.state.count 的作用，第二项是一个函数，相当于 this.setState()函数的作用。这里不需要像 class 写法一样去解耦，看起来会更加简洁。

### 二、useEffect() 副作用钩子

useEffect 这个钩子，可以告诉 react 组件在渲染之后要执行的某些操作，如果你熟悉 React class 的生命周期函数，你可以把 useEffect Hook 看做 componentDidMount，componentDidUpdate 和 componentWillUnmount 这三个函数的组合。

useEffect 这个副作用钩子接受两个参数，第一个是触发了这个钩子之后的回调，第二个参数是一个数组，当监听到数组中的变量发生变化时，才会去触发这个钩子。当第二参数不填写时，就会在组件渲染时去执行。

```javascript
function TestUseEffect(props) {
  let [count, setCount] = useState(0);
  let [userEffectCount, setUserEffectCount] = useState(0);
  const changeCount = (steps) => {
    setCount(count + steps);
  };

  useEffect(() => {
    setUserEffectCount(userEffectCount + 1);
  }, [count]);
  return (
    <div>
      {count}数量
      <button onClick={() => changeCount(+1)}>+</button>
      <button onClick={() => changeCount(-1)}>-</button>
      <br />
      <div>userEffect执行次数：{userEffectCount}</div>
    </div>
  );
}

export default TestUseEffect;
```

在这个案例中，在点击了按钮让 count 发生变化之后，就会去执行 useEffect 钩子，让 userEffectCount 次数+1，在页面加载和关闭的时候也会分别去执行一次 useEffect 钩子。

### 三、useContext() 共享状态钩子

该钩子的作用就是创建一个 context 对象，并在其他的组件中，放回改 context 的当前值，主要是为了`解决多个组件之间props传参复杂又不想存储于reduce状态管理的场景。`

```javascript
function TestUseContext(params) {
  const AppContext = React.createContext({});
  let [count, setCount] = useState(0);
  const changeCount = (steps) => {
    setCount(count + steps);
  };

  function IncreaseCount(props) {
    const { count } = useContext(AppContext);
    return (
      <div>
        <span>IncreaseCount:{count}</span>
        <button onClick={() => props.changeCount(+1)}>+</button>
      </div>
    );
  }
  function DecreaseCount(props) {
    const { count } = useContext(AppContext);
    return (
      <div>
        <span>DecreaseCount:{count}</span>
        <button onClick={() => props.changeCount(-1)}>-</button>
      </div>
    );
  }
  return (
    <AppContext.Provider value={{ count }}>
      <IncreaseCount
        changeCount={(steps) => changeCount(steps)}
      ></IncreaseCount>
      <DecreaseCount
        changeCount={(steps) => changeCount(steps)}
      ></DecreaseCount>
    </AppContext.Provider>
  );
}

export default TestUseContext;
```

<img src="https://gitee.com/washhui/my-blog/raw/master/assets/hooks1.png" >

在上面案例中,我们可以看到 IncreaseCount 和 DecreaseCount 两个组件共享了 count 状态，可以解决多级组件通讯业务。

### 四、 useReducer():Action 钩子

在我们使用 react,我们一般用 redux 来作为全局的状态管理，React 本身并不提供这样的能力。而 useReducer 提供了类似 redux 的功能。

```javascript
function TestUseReducer(props) {
  const AppContext = React.createContext({});

  const TYPE = {
    CHANGE_COUNT: "changeCount",
  };
  const reducer = (state, action) => {
    switch (action.type) {
      case TYPE.CHANGE_COUNT:
        return {
          ...state,
          count: state.count + action.step,
        };
      default:
        return state;
    }
  };

  let [state, dispatch] = useReducer(reducer, { count: 0 });
  const changeCount = (step) => {
    dispatch({
      type: TYPE.CHANGE_COUNT,
      step,
    });
  };

  function IncreaseCount(props) {
    const { count } = useContext(AppContext);
    return (
      <div>
        <span>IncreaseCount:{count}</span>
        <button onClick={() => changeCount(+1)}>+</button>
      </div>
    );
  }
  function DecreaseCount(props) {
    const { count } = useContext(AppContext);
    return (
      <div>
        <span>DecreaseCount:{count}</span>
        <button onClick={() => changeCount(-1)}>-</button>
      </div>
    );
  }
  return (
    <AppContext.Provider value={{ count: state.count }}>
      <IncreaseCount></IncreaseCount>
      <DecreaseCount></DecreaseCount>
    </AppContext.Provider>
  );
}

export default TestUseReducer;
```

通过上面代码，我们可以看到 useReducer 替代了 redux 的部分功能，但是 useReducer 无法为我们提供中间件等功能，所以有 useReducer 实现不了的功能的时候，还是需要用 redux 来解决。
