# vue 的一些问题

### vue 首屏白屏优化

```javascript
/**
 * @param {number} maxFrameCount 最大帧数
 */
function useDefer(maxFrameCount = 100) {
  const frameCount = ref(0);
  let rafId;
  const refreshFrameCount = () => {
    rafId = requestAnimationFrame(() => {
      frameCount.value++; //计数帧数加一
      if (frameCount.value < maxFrameCount) {
        refreshFrameCount();
      }
    });
  };
  refreshFrameCount();
  onUnmounted(() => cancelAnimationFrame(refId)); //卸载的时候情况id
  return function (showInframeCoount) {
    return frameCount.value >= showInframeCoount; //判断当前渲染帧数又是否大于自定义n
  };
}

// 使用
const defer = userDefer(2);
<component1 v-if="defer(1)"></component1>
<component2 v-if="defer(2)"></component2>

```

### vue3 将函数挂在到 vue 实例上去

```javascript
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
const dracoLoader: DRACOLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");
const app = createApp(App);
app.config.globalProperties.$dracoLoader = dracoLoader;
```

### 递归组件

```vue
<!-- 父组件 -->
<template>
  <div class="list-detail">
    <List :list="list"></List>
  </div>
</template>
<script setup lang="ts">
import List from "./components/List";
import { reactive } from "vue";
interface listObj {
    id: number;
    name:string;
    children?:listObj[];
}
let list:listObj[] = reactive([
  {
    id:1
    name: "经济",
    children: [
      {
        id:11
        name: "如家",
      },
    ],
  },
]);
</script>

<!-- 子组件 -->
<template>
  <div>
    <div class="list-item" v-for="item in list" :key="item.id">
      <div class="item-name">
        <span>{{ item.name }}</span>
      </div>
      <div v-if="item.children" class="children-item">
        <List :list="item.children"></List>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import List from "./components/List";
import { defineProps } from "vue";
interface listObj {
  id: number;
  name: string;
  children?: listObj[];
}
const props = withDefaults(defineProps<{ list: listObj[] }>(), { list: [] });
</script>
```

### 创建异步组件的几种方式

- 全局

```javascript
Vue.component("MyAsyncComponent", import("@/components/MyAsyncComponent"));
```

- 局部

```javascript
components: {
'MyAsyncComponent': () => import('@/components/MyAsyncComponent'),
},
```

- 路由懒加载

```javascript
export default new Router({
  routes: [
    {
      path: "/myAsyncComponent",
      name: "myAsyncComponent",
      component: () => import("@/components/MyAsyncComponent"),
    },
  ],
});
```

- promise

```javascript
import MyAsyncComponent  from '@/components/MyAsyncComponent';
var promise = new Promise(function (resolve, reject) {
  setTimeout(function () {
    resolve(MyAsyncComponent)
  }, 1000)
})


components: {
    'MyAsyncComponent': function () {
        return MyAsyncComponent
    },
},

```

### vue 中的 diff 算法

- 1.什么时 diff 算法，第一次 render 在执行的时候会将第一次的虚拟 dom 做一次缓存，第二次渲染的时候会将新的虚拟 dom 和老的虚拟 dom 进行对比。这个对比的过程其实就是 diff 算法。
- 2.作用：通过算法，计算出哪些部分需要更新，避免全部 dom 更新造成资源浪费
- 3.原理：通过新老虚拟 dom 进行深度循环对比节点变化
- 4.为什么使用：频繁操作 dom 的代价是很昂贵的，有可能会造成一些性能问题

### vue3 生命周期

- setup 替代之前 beforeCreate Created (其实这两个生命周期还存在，vue 源码中依然会有对应的调用)
- onBeforeMount beforeMount
- onMounted mounted
- onBeforeUpdate beforeUpdate
- onUpdated Updated
- onBeforeUnMount beforeDestory
- onUnMountd destoryed
- onRenderTriggered onRenderTracked onErrorCaptured

### SPA 首屏加载速度慢的怎么解决？

- 首屏时间（First Contentful Paint），指的是浏览器从响应用户输入网址地址，到首屏内容渲染完成的时间，此时整个网页不一定要全部渲染完成，但需要展示当前视窗需要的内容；
- 产生原因：
- 1.网络延迟，带宽低
- 2.资源体积过大
- 3.资源重复请求
- 4.渲染堵塞
- 解决方案：
- 1.增加服务器带宽，网络稳定
- 2.合理压缩资源，精灵图等
- 3.ssr 服务端渲染
- 4.按需加载
- 5.减少入口文件体积
- 6.开启 Gzip
- 7.首屏 defer v-if 帧模式。 先去加载重要的内容。

### vue 中 data 的属性可以和 methods 中方法同名吗

- 可以同名，methods 的方法名会被 data 的属性覆盖；调试台也会出现报错信息，但是不影响执行；
- 原因：源码定义的 initState 函数内部执行的顺序：props>methods>data>computed>watch

### vue 父子组件生命周期

- 父 beforeCreate -> 父 created -> 父 beforeMount -> 子 beforeCreate -> 子 created -> 子 beforeMount -> 子 mounted -> 父 mounted->
- 父 beforeUpdate->子 beforeUpdate->子 updated->父 updated
- 父 beforeDestroy->子 beforeDestroy->子 destroyed->父 destroyed

## vue2 和 vue3 的区别 不熟

- vue2 通过 new 创建 vue 实例，并且一个只能挂在一个 vue 实例,可以通过在 vue 原型上挂在方法的方式来添加全局方法。如下：

  ```javascript
  Vue.prototype.xxx = xxx;
  ```

  vue3 需要通过 creatApp 工厂模式来创建一个 app 实例，可以创建多个，分别执行到不同 dom 上，挂在全局变量的方法如下：

  ```javascript
  const app = createApp(App);
  app.config.globalProperties.xxxx = xxxx;
  ```

- v-for 和 v-if 的优先级不一样，vue2 是 v-for 的优先级高，所有同时使用会导致多次没必要的循环，导致性能下降，vue3 是 v-if 优先级高，但是同时使用会报错。
- 生命周期不同
- 新增 hooks钩子函数，可以去处理创建一些纯函数，可以用双向绑定的数据，有生命周期等
- 双向绑定方式不同，vue2 Object.defineProperty, vue3 是 Proxy 
- vue3 完全支持 typescript，提高项目的可维护性
- template 可以作为根节点
- vue3 提供了组合式和选项式两种编程模式 vue2只有选项式
- setup
  - vue3 的 setup 中 data 优先级最高
  - setup 位于 beforeCreated 之前,用于代替 created 和 beforeCreated。由于 setup 函数执行的时候项目还没有进行初始化，所以不能访问 data 或 methods 中的数据，console.log(this)显示为 undefind。，所以会有很多系统自带的钩子来解决这个问题，比如 useRouter useStore  
- 支持多个 v-model 不用在使用.sync
- Teleport 在国内大部分都翻译成了瞬间移动组件，它可以把你写的组件挂载到任何你想挂载的 DOM 上 类似 model
- Suspense 异步请求组件
- vue3 v-for 可以进行解构了
- vue3 watch 可以监听多了来源组成的数组 watchEffect 可以用来简化代码（会根据响应式数据自动监听变化，并且可以停止监听）
- vue3 emit 可以声明，方便查找
