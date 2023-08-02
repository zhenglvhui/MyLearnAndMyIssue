# ts 的问题

### 写一个发布订阅者模式

```typescript
interface ItEvent {
    on: (eventName: string, cb: (...args: any[]) => void) => void,
    emit: (eventName: string, ...args: any[]) => void,
    off: (eventName: string, cb: (...args: any[]) => void) => void,
    once: (eventName: string, cb: (...args: any[]) => void) => void,
}

type ItEventsList = Array<(...args: any[]) => void>;

interface ItEvents {
    [eventName: string]: ItEventsList;
}

class MyEvent implements ItEvent {
    private events: ItEvents;
    constructor() {
        this.events = {};
    }
    on(eventName: string, cb: (...args: any[]) => void): void {
        let eventList: ItEventsList = this.events[eventName] || [];
        this.events[eventName] = [...eventList, cb];
    };
    emit(eventName: string, ...args: any[]): void {
        let eventList: ItEventsList = this.events[eventName] || [];
        if (eventList.length === 0) console.error(`emit::Event ${eventName} 没有被监听`)
        eventList.forEach(cb => cb(...args));
    };
    off(eventName: string, cb: (...args: any[]) => void): void {
        let eventList: ItEventsList = this.events[eventName] || [];
        if (eventList.length === 0) console.error(`off::没有Event ${eventName} 可以取消监听`);
        // eventList.splice(eventList.findIndex(item => cb === item), 1); // 这里不能使用splice 配合 once使用，会导致数组下标改变，once之后的下一个函数不执行
        this.events[eventName] = eventList.filter(item => item !== cb);
    };
    once(eventName: string, cb: (...args: any[]) => void): void {
        let newCb = (...args: any[]) => {
            cb.apply(this, args);
            this.off(eventName, newCb);
        }
        this.on(eventName, newCb);
    };

}
let myEvent = new MyEvent();
let fn = (...args: any[]) => {
    console.log(22);
}
myEvent.once('aaa', (...args) => {
    console.log(33);
})
myEvent.once('aaa', (...args) => {
    console.log(11);
})
myEvent.on('aaa', fn)
myEvent.on('bb', (...args) => {
    console.log(44);
})
myEvent.emit('aaa', 1, 2, 3)
myEvent.emit('aaa', 1, 2, 3)
myEvent.emit('aaa', 1, 2, 3)
myEvent.off('aaa', fn)
myEvent.emit('aaa', 1, 2, 3)
myEvent.emit('bb', 1, 2, 3)
```

### 如果希望一个函数的参数，既可以用数组的形式传递，又可以对象的形式传递，可以用重载的方式

```typescript
interface ItDestroyModel<K extends keyof HTMLElementEventMap> {
  container: Ref<HTMLElement | null>,
  animationID: number,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
  modelScene: THREE.Group,
  scene: THREE.Scene,
  type?: K,
  throttleOnDocumentMouseMove?: (this: HTMLElement, event: HTMLElementEventMap[K]) => void
}

type ItKeyOfIfDestroyModel<K extends keyof HTMLElementEventMap> = [
  container: Ref<HTMLElement | null>,
  animationID: number,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
  modelScene: THREE.Group,
  scene: THREE.Scene,
  type?: K,
  throttleOnDocumentMouseMove?: (this: HTMLElement, event: HTMLElementEventMap[K]) => void
]

function destroyModel<K extends keyof HTMLElementEventMap>(args: ItDestroyModel<K>): void;
function destroyModel<K extends keyof HTMLElementEventMap>(...args: ItKeyOfIfDestroyModel<K>): void;
function destroyModel<K extends keyof HTMLElementEventMap>(...args: any[]): void {
  let fnArg: ItDestroyModel<K>;
  if (args.length === 1) {
    fnArg = args[0];
  } else {
    fnArg = { container: args[0], animationID: args[1], camera: args[2], renderer: args[3], modelScene: args[4], scene: args[5], type: args[6], throttleOnDocumentMouseMove: args[7] };
  }
  let { container, animationID, camera, renderer, modelScene, scene, type, throttleOnDocumentMouseMove } = fnArg;
  if (!container.value) return;
  window.removeEventListener("resize", onWindowResize(camera, renderer), false);
  if (throttleOnDocumentMouseMove && type) {
    container.value.removeEventListener(type, throttleOnDocumentMouseMove, false);
  }
  cancelAnimationFrame(animationID); // 去除animationFrame
  modelScene.traverse((child: any) => {
    if (child.isMesh) {
      child.geometry.dispose();
      child.material.dispose();
    }
    child = null;
  });
  scene.remove(modelScene);
  scene.clear();
  renderer.forceContextLoss();
  renderer.dispose();
  renderer.clear();
};

// 调用
destroyModel(container, animationID, camera, renderer, modelScene, scene, "mousemove", throttleOnDocumentMouseMove);
// 或则
destroyModel({
    container, animationID, camera, renderer, modelScene, scene, type:"mousemove", throttleOnDocumentMouseMove;
});
```

### switch case 使用枚举是，如何在新增枚举类型的时候，就抛出错误，使开发者快速找到(never 的妙用)

```typescript
enum ENUM_INFO {
  TYPE1 = 1,
  TYPE2 = 2,
}
function showMessage(info: ENUM_INFO) {
  switch (info) {
    case ENUM_INFO.TYPE1:
      console.log(info);
      break;
    case ENUM_INFO.TYPE2:
      console.log(info);
      break;
    default:
      const Check: never = info; //  这个时候如果枚举ENUM_INFO新增了类型，这里就会抛出异常
  }
}
```
