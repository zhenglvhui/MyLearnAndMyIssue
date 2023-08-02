# ts 的问题

### 写一个发布订阅者模式

```typescript

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
