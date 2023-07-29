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

### 函数柯里化

```javascript
function curry(fn) {
  return function cur(...arg) {
    if (arg.length >= fn.length) {
      return fn.call(this, ...arg);
    } else {
      return function (...arg2) {
        return cur.apply(this, [...arg, ...arg2]);
      };
    }
  };
}
```

### 数组扁平化

```javascript
function flat(arr) {
  if (!(arr instanceof Array)) throw new Error("请传数组");
  let newArr = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] instanceof Array) {
      newArr = [...newArr, ...flat(arr[i])];
    } else {
      newArr.push(arr[i]);
    }
  }
  return newArr;
}
```

### 实现 set

```javascript
window.Set =
  window.Set ||
  (function () {
    function Set(arr) {
      this.items = arr ? unique(arr) : [];
      this.size = this.items.length; // Array的大小
    }
    Set.prototype = {
      add: function (value) {
        // 添加元素,若元素已存在,则跳过，返回 Set 结构本身。
        if (!this.has(value)) {
          this.items.push(value);
          this.size++;
        }
        return this;
      },
      clear: function () {
        //清除所有成员，没有返回值。
        this.items = [];
        this.size = 0;
      },
      delete: function (value) {
        //删除某个值，返回一个布尔值，表示删除是否成功。
        return this.items.some((v, i) => {
          if (v === value) {
            this.items.splice(i, 1);
            return true;
          }
          return false;
        });
      },
      has: function (value) {
        //返回一个布尔值，表示该值是否为Set的成员。
        return this.items.some((v) => v === value);
      },
      values: function () {
        return this.items;
      },
    };

    return Set;
  })();
```

### 数组去重

```javascript
function unique(arr) {
  let obj = {};
  let arr1 = [];
  for (const item of arr) {
    if (typeof item == "object") {
      arr1.push(item);
    } else {
      obj[item] = item;
    }
  }
  return [...arr1, ...Object.values(obj)];
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

### 实现 apply

```javascript
Function.prototype.myApply = function (thisArg, arg = []) {
  let _thisArg = thisArg || window;
  _thisArg.fn = this;
  let result = _thisArg.fn(...arg);
  delete _thisArg.fn;
  return result;
};
```

### 排序两个已经排好序的数组

```javascript
function sport(arr1, arr2) {
  let i = 0;
  let j = 0;
  let newArr = [];
  while (i < arr1.length && j < arr2.length) {
    if (arr1[i] > arr2[j]) {
      newArr.push(arr2[j]);
      j++;
    } else {
      newArr.push(arr1[i]);
      i++;
    }
  }
  if (i !== arr1.length) {
    newArr = [...newArr, ...arr1.slice(i)];
  } else {
    newArr = [...newArr, ...arr2.slice(j)];
  }
  return newArr;
}
```

### 斐波那契

```javascript
function fibonacci(n) {
  if (n <= 2) {
    return 1;
  }
  return fibonacci(n - 1) + fibonacci(n - 2);
}
```

### three 获取鼠标点击位置经过的物体

```javascript
/**
 *
 * @param {Number} x 鼠标x
 * @param {Number} y 鼠标y
 * @param {Camera} camera 正在使用的相机
 * @param {Scene} scene 要被判断的场景
 * @returns
 */
const getIntersects = function (
  x: number,
  y: number,
  camera: THREE.PerspectiveCamera,
  scene: THREE.Scene
) {
  if (!camera || !scene) return { raycasterMesh: [] };
  let raycaster: THREE.Raycaster = new THREE.Raycaster();
  let mouse: THREE.Vector2 = new THREE.Vector2();
  x = (x / window.innerWidth) * 2 - 1;
  y = -(y / window.innerHeight) * 2 + 1;
  mouse.set(x, y);
  raycaster.setFromCamera(mouse, camera);
  let raycasterMesh: THREE.Intersection<THREE.Object3D<THREE.Event>>[] =
    raycaster.intersectObjects(scene.children); // 穿过的物体
  return {
    raycasterMesh,
  };
};
```

### 求最大公约数

- 除数 在 a 和 b 的范围内，如果同时 a 和 b 处以除数的余等于 0，就将此时的除数赋值给 res；除数自增，不断循环上面的计算，更新 res

```javascript
function greatestCommonDivisor(num1, num2) {
  if (num1 < 2 || num2 < 2) return 1;
  let commonDivisor = 1; // 公约数
  let index = 2;
  while (index <= num1 && index <= num2) {
    if (num1 % index === 0 && num2 % index === 0) {
      lastNum = index;
    }
    index++;
  }
  return commonDivisor;
}
```

### 判断是否是回文 12321

```javascript
function plalindrome(str) {
  let length = str % 2 == 0 ? str.length / 2 : (str.length - 1) / 2;
  let flag = true;
  for (let i = 0; i < length; i++) {
    if (str[i] !== str[str.length - i - 1]) {
      flag = false;
      break;
    }
  }
  return flag;
}
```

### 判断数组中是否有两数之和

```javascript
function sumFind(arr) {
  let index = 0;
  let num;
  let flag = false;
  while (arr.length > index) {
    num = arr[index];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length; j++) {
        if (j === i) continue;
        if (num == arr[i] + arr[j]) {
          flag = true;
          break;
        }
      }
    }
    if (flag) break;
    index++;
  }
  return flag;
}
```
