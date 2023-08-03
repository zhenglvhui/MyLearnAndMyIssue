# js 问题

### 10 万条数据加载如何不卡顿

- 1.使用 requestAnimationFrame（该方法会在浏览器每次去重绘的时候执行） 动画帧 createDocumentFragment 虚拟节点
- 2.通过 requestAnimationFrame 重绘的时候，每次在虚拟节点中添加一定数量的数据，之后一次性渲染在页面中，如此反复递归循环，直至最后一条。
- 3.原理：requestAnimationFrame 方法时在每次重绘的时候去执行的，不会阻塞其他 js 代码块的执行。createDocumentFragment 一次性将部分节点在页面进行渲染，避免因为每次执行一条数据浏览器的性能损耗。

```javascript
let data = [];
for (let i = 0; i < 100000; i++) {
  data.push({
    text: "插入" + (i + 1),
  });
}

/**
 *
 * @param {number} arr 要被渲染到dom的数组
 * @param {number} pageSize  每次虚拟渲染的数量
 * @param {string} addEleName 插入元素的元素名
 * @param {element} addToEle  要插入到哪个元素
 * @param {string} key  用数组中哪个key作为内容
 */
function addTotal(
  arr = data,
  pageSize = 100,
  addEleName = "li",
  addToEle,
  key = "text"
) {
  const loopCount = Math.ceil(arr.length / pageSize); // 一共要插入的次数
  let pageNum = 0; // 当前插入的次数
  function addEle() {
    let forLength =
      loopCount > pageNum + 1 ? pageSize : arr.length - pageNum * pageSize;
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < forLength; i++) {
      const ele = document.createElement(addEleName);
      ele.innerText = data[pageSize * pageNum + i][key];
      fragment.appendChild(ele);
    }
    addToEle.appendChild(fragment);
  }
  return function () {
    addEle();
    pageNum++;
    return {
      isLoop: loopCount > pageNum, // 是否还要循环
    };
  };
}

let add = addTotal(data, 100, "li", document.getElementById("ul"), "text");

(function loop() {
  let { isLoop } = add();
  if (!isLoop) return;
  window.requestAnimationFrame(loop);
})();
```

### 长列表无限滚动，在大于 1 千或者 1 万条数据时出现短暂白屏，卡顿，甚至浏览器崩溃等问题，应该如何优化解决

- 先加载 100 条数据，然后大于 100 条数据，判断当页面向下滚动了比如 20 条的距离，那就删除掉最开始的 20 条数据，在末尾加 20 跳距，同时重新计算初始位置，反之亦然，目的：只要页面不要同时拥挤大量 dom 节点即可。

### 解决 click 事件在移动端操作延迟 300ms 问题和点击时穿透问题

- 在正常情况下，如果不进行特殊处理，移动端在触发点击事件时，会有 300ms 的延迟。换句话说，当我们在点击移动端页面后不会立即做出反应，而是会等待 300ms 才会触发 click 事件。在移动 web 兴起初期，用户对 300ms 的延迟没有太大的感觉，但随着用户对交互体验的要求的提高，如今，移动端的 300ms 延迟严重影响了用户的使用体验
- 07 年，苹果公司发布首款 Iphone 前夕，遇到一个问题：当时的网站都是为大屏设计，手机屏幕太小无法正常浏览，于是苹果工程师做了一些约定解决此类问题。
  这些约定当中，最为有名的是双击缩放（double tap to zoom）,这是产生 300ms 延迟的根源。
  用手指在屏幕上快速点击两次，iOS 自带的 Safari 浏览器会将网页缩放至原始比例。如果用户在 iOS Safari
  里边点击了一个链接。由于用户可以进行双击缩放或者双击滚动的操作，当用户一次点击屏幕之后，浏览器并不能立刻判断用户是确实要打开这个链接，还是想要进行双击操作。

- 解决方案：fastclick 插件， touchstart，禁用页面缩放
- 说完移动端点击 300ms 延迟的问题，还不得不提一下移动端点击穿透的问题。可能有人会想，既然 click 点击有 300ms 的延迟，那对于触摸屏，我们直接监听 touchstart 事件不就好了吗？
  - 使用 touchstart 去代替 click 事件有两个不好的地方。
  - 第一：touchstart 是手指触摸屏幕就触发，有时候用户只是想滑动屏幕，却触发了 touchstart 事件，这不是我们想要的结果；
  - 第二：使用 touchstart 事件在某些场景下可能会出现点击穿透的现象。

- 什么是点击穿透？
- 假如页面上有两个元素 A 和 B。B 元素在 A 元素之上。我们在 B 元素的 touchstart 事件上注册了一个回调函数，该回调函数的作用是隐藏 B 元素。我们发现，当我们点击 B 元素，B 元素被隐藏了，随后，A 元素触发了 click 事件。

- 这是因为在移动端浏览器，事件执行的顺序是 touchstart > touchend >
click。而 click 事件有 300ms 的延迟，当 touchstart 事件把 B 元素隐藏之后，隔了 300ms，浏览器触发了 click 事件，但是此时 B 元素不见了，所以该事件被派发到了 A 元素身上。如果 A 元素是一个链接，那此时页面就会意外地跳转。

- 解决方法：阻止默认事件


### 宏任务和微任务 eventLoop

- 同步任务：一个任务做完接着下一个任务去执行，程序的执行循序与任务的顺序一只
- 异步任务：js 是单线程的，分为宏任务和微任务，js 会把异步任务放到这两个池子里，再根据宏任务和微任务的执行规则去执行
- 执行规则：先判断同步任务还是异步任务，同步任务放到主线程中，异步任务放到事件池里，分为宏任务和微任务，先执行宏任务，待一个宏任务执行完，盘判断是否有微任务，在把所以的微任务全部执行完。之后经过浏览器渲染之后，在执行下一次的宏任务
- 宏任务：script（整体代码） setTimeout setInterval ajax UI 事件 requestAnimationFrame
- 微任务：process.nextTick Promise.then() await
- new Promise 是同步任务
- 1.事件循环（Event Loop）运行机制
  执行一个宏任务（栈中没有就从事件队列中获取）
  执行过程中如果遇到微任务，就将它添加到微任务的任务队列中
  宏任务执行完毕后，立即执行当前微任务队列中的所有微任务（依次执行）
  当前宏任务执行完毕，开始检查渲染，然后 GUI 线程接管渲染
  渲染完毕后，JS 线程继续接管，开始下一个宏任务（从事件队列中获取）

```javascript
Promise.resolve().then(() => {
  console.log("第一个回调函数：微任务1");
  setTimeout(() => {
    console.log("第三个回调函数：宏任务2");
  }, 0);
});
setTimeout(() => {
  console.log("第二个回调函数：宏任务1");
  Promise.resolve().then(() => {
    console.log("第四个回调函数：微任务2");
  });
});
```

### a.b.c.d 和 a['b']['c']['d']，哪个性能更高？

- a.b.c.d 比 a['b']['c']['d'] 性能高点，因为[ ]里面有可能是字符串，有可能是变量，至少多一次判断，而 a.b.c.d 是直接取用该字符串当作属性名的

### for 循环和 foreach 循环哪个更快

- 数量少时，foreach 效率更高
- 数量大时，for 循环效率高

### 垃圾回收机制

- 标记清除和引用计数
- 标记清除：垃圾收集器在运行时会给内存中的所有变量都加上一个标记，假设内存中所有对象都是垃圾，全标记为 0
  然后从各个根对象开始遍历，把不是垃圾的节点改成 1
  清理所有标记为 0 的垃圾，销毁并回收它们所占用的内存空间
  最后，把所有内存中对象标记修改为 0，等待下一轮垃圾回收
- 引用计数：这个策略是跟踪每个变量被使用的次数，当一个变量被定义时并赋值给其他变量时，定义为 1，又赋值给另一个变量时+1，如果之前赋值给的变量被其他的变量赋了新的值，这计数-1，当计数为 0 时，会在下次垃圾回收的时候，被清除掉。

### WeakMap 与 Map 类似，但有几点区别：

- WeakMap 只接受对象作为 key，如果设置其他类型的数据作为 key，会报错。
- WeakMap 的 key 所引用的对象都是弱引用，只要对象的其他引用被删除，垃圾回收机制就会释放该对象占用的内存，从而避免内存泄漏。
- 由于 WeakMap 的成员随时可能被垃圾回收机制回收，成员的数量不稳定，所以没有 size 属性。
- WeakMap 没有 clear()方法
- WeakMap 不能遍历
- WeakMap 成员都是弱引用，可以被垃圾回收机制回收，可以用来保存 DOM 节点，不容易造成内存泄漏。
