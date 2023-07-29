# 记录 react 

### react diff 的优化策略

- 1、tree 层级：dom 节点跨层级的移动操作特别少，可以将其忽略不计。dom 节点同级比对，跨级不对比处理。
  层级控制，diff 在树这一层仅仅比较当前同一层次节点。
  暴力删除，如果同层次比较的某个节点不存在，或者说整个树结构发生了大的变化，那该节点及其子节点都将被直接销毁
  跨层级比较会进行相应的创建节点和删除节点的操作。
- 2、component 层级：拥有相同类的两个组件会生成类似的树形结构，拥有不同类的两个组件将会生成不同的树形结构。
  如果是同一个类的组件，则会继续往下 diff 运算，更新节点属性；（所以这里要用 shouldComponentUpdate 进行优化处理）如果不是同一个类的组件，那么直接删除这个组件的所有子节点，创建新的组件。
- 3、element 层级：对于同一层级的一组子节点，可以通过唯一 key 进行区分。
  比较策略：先将所有列表遍历一遍，确定需要新增和删除的节点，再确定需要移动的节点。
  同一层级的节点，每个节点在对应的层级用唯一的 key 作为标识，diff 算法有 3 种节点的操作：
  （1）、插入（INSERT_MARKUP）：新的节点不在旧集合中，对新节点进行插入操作。
  （2）、移动（MOVE_EXISTING）：该节点存在于旧集合中且是可更新的类型，此时可复用之前的 node 节点，更新属性，执行移动操作。
  （3）、删除（REMOVE_NODE）：原节点不在新的集合中，或者在新的集合中不能直接复用或更新，对原节点执行删除操作。

### react 生命周期(16.+以前)

- 挂载阶段
- constructor 进行 react 数据初始化,逻辑本身的初始化
- componentWillMount 初始化虚拟 dom，方法的定义等（和 constructor 功能重复）
- componentDidMount 第一次渲染完成，可以获取到 dom

- 更新阶段
- componentWillReceiveProps (nextProp) 当 props 发生变化时会执行的生命周期（破坏单一数据源，增加重绘次数，故删除）
- shouldComponentUpdate(nextProp,nextState) return true 时会更新 判断是否要进行更新组件（主要在优化时去使用）
- componentWillUpdate 在组件更新前执行
- componentDidUpdate 在组件更新后执行
- render 每次渲染时都会执行的生命周期，将 jsx 转成虚拟 dom 并渲染真实节点，渲染阶段

- 卸载阶段
- componentWillUnMount 要把组件数据进行销毁之前执行

### react 生命周期(16.+以后)

- 废弃 componentWillMount componentWillReceiveProps componentWillUpdate(防止被滥用)
- 新增 getStateFromProps getSnapStopBeforeUpdate
- getDerivedStateFromProps 它是一个静态方法，在这里不能调用 this

### react 组件的划分业务组件技术组件？

- 根据组件的职责通常把组件分为 UI 组件和容器组件。
- UI 组件负责 UI 的呈现，容器组件负责管理数据和逻辑。
- 两者通过 React-Redux 提供 connect 方法联系起来

### redux 的三大基本原则是什么

- 单一数据源
- State 是只读的
- 使用纯函数来执行修改
  纯函数：不产生副作用

### 调用 setState 后发生了什么

- 将参数合并到 state 上
- 渲染到虚拟 dom 吗
- diff 对比新旧节点
- 渲染差异节点到真实 dom 上

### state 是同步的还是异步的

- 既是同步又是异步的
- 在 setTimeout 中是同步的
- 其他情况是异步

### state 是同步的还是异步的

- 既是同步又是异步的
- 在 setTimeout 中是同步的
- 其他情况是异步


### 函数式组件和类组件的区别

- 1. 语法上的区别：
     函数式组件是一个纯函数，它是需要接受 props 参数并且返回一个 React 元素就可以了。类组件是需要继承 React.Component 的，而且 class 组件需要创建 render 并且返回 React 元素，语法上来讲更复杂。
- 2. 调用方式
     函数式组件可以直接调用，返回一个新的 React 元素；类组件在调用时是需要创建一个实例的，然后通过调用实例里的 render 方法来返回一个 React 元素。
- 3. 状态管理
     函数式组件没有状态管理，类组件有状态管理。
- 4. 使用场景
     类组件没有具体的要求。函数式组件一般是用在大型项目中来分割大组件（函数式组件不用创建实例，所有更高效），一般情况下能用函数式组件就不用类组件，提升效率。


