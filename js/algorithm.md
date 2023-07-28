# js 常见算法或者函数的实现

### 深拷贝

```javascript
function deepClone(value) {
  const cache = new WeakMap();
  function _deepclone(value) {
    if (value === null || typeof value !== "object") return value;
    if (value.constructor === Date) return new Date(value);
    if (value.constructor === RegExp) return new RegExp(value);
    if (typeof data === "function") {
      let tempFunc = value.bind(null);
      tempFunc.prototype = cloneDeep(data.prototype);
      return tempFunc;
    }
    if (cache.has(value)) return cache.get(value);
    let result = Array.isArray(value) ? [] : {};
    cache.set(value, result);
    for (let key in value) {
      if (value.hasOwnProperty(key)) {
        result[key] = _deepclone(value[key]);
      }
    }
    return result;
  }
  return _deepclone(value);
}
```

### 队列

```javascript
// 并发队列
class Queue {
  constructor(queNum = 2) {
    this.queNum = queNum; // 并发数量
    this.queList = []; // 待执行队列
    this.curQueList = []; // 当前执行的队列
  }

  add(promiseFn) {
    return new Promise((resolve, reject) => {
      this.queList.push({ promiseFn, resolve, reject });
      this.run();
    });
  }

  run() {
    while (this.queList.length > 0 && this.curQueList.length < this.queNum) {
      const { promiseFn, resolve, reject } = this.queList.shift();
      this.curQueList.push({ promiseFn, resolve, reject });
      promiseFn()
        .then(resolve, reject)
        .finally(() => {
          this.curQueList.shift();
          this.run();
        });
    }
  }
}

let queue = new Queue();
let addTask = (time, name) => {
  queue
    .add(() => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(name);
        }, time);
      });
    })
    .then((res) => {
      console.log(`任务${res}完成`);
    })
    .catch((res) => {
      console.log(`任务${res}出错`);
    });
};

addTask(10000, 1);
addTask(5000, 2);
addTask(3000, 3);
addTask(4000, 4);
addTask(5000, 5);
```

### ts 实现 防抖节流并保持类型定义
```javascript
// 防抖
const debounce = function <A extends any[], R>(fn: (...args: A) => R, delay: number = 1000): (...args: A) => void {
  let timer: number | null = null;
  return function (this: void, ...args: A): void {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};

// 节流
const throttle = function <A extends any[], R>(fn: (...args: A) => R, delay: number = 1000): (...args: A) => void {
  let flag: boolean = true;
  return function (this: void, ...args: A): void {
    if (!flag) return;
    flag = false;
    setTimeout(() => {
      fn.apply(this, args);
      flag = true;
    }, delay);
  };
}

```

### 实现 new

```javascript
function myNew(fn, ...arg) {
  let obj = {};
  obj.__proto__ == fn.prototype;
  fn.call(obj, ...arg);
  return Object.prototype.toString.call(obj) == "[object Object]" ? obj : {};
}
```

### three获取鼠标点击位置经过的物体
```javascript
/**
 *
 * @param {Number} x 鼠标x
 * @param {Number} y 鼠标y
 * @param {Camera} camera 正在使用的相机
 * @param {Scene} scene 要被判断的场景
 * @returns
 */
const getIntersects = function (x: number, y: number, camera: THREE.PerspectiveCamera, scene: THREE.Scene) {
  if (!camera || !scene) return { raycasterMesh: [] };
  let raycaster: THREE.Raycaster = new THREE.Raycaster();
  let mouse: THREE.Vector2 = new THREE.Vector2();
  x = (x / window.innerWidth) * 2 - 1;
  y = -(y / window.innerHeight) * 2 + 1;
  mouse.set(x, y);
  raycaster.setFromCamera(mouse, camera);
  let raycasterMesh: THREE.Intersection<THREE.Object3D<THREE.Event>>[] = raycaster.intersectObjects(scene.children); // 穿过的物体
  return {
    raycasterMesh,
  };
};
```
