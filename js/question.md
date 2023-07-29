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
