# 使用 threejs 中灯光遇到的问题以及解决方案

### 在我们使用别人导出自带灯光的三维模型文件后出现灯光过爆的问题。

- 1、问题 1 是三维软件等灯光单位和 threejs 中的灯光单位不同，所以会出现灯光过爆，完全用不了的问题。以 blender 三维软件为例，灯光的单位是 W，如果直接导出的话，对应成导出文件的灯光的强度为 对应瓦数 \* 瓦转换为数字的转换率。解决方法就是在把光照单位选择成无单位或者 raw。
- 2、问题 2 导出的时候是选择无单位还是 raw，这个要看 three.js 的灯光模式 physicallyCorrectLights 还是默认灯光模式，raw 对应 physicallyCorrectLights 模式，无单位对应默认灯光模式。
- 3、问题 3 就算解决了上面的两个问题，灯光依旧无法达到自己完全想要的效果，那是因为 threejs 依旧存在一些偏差，比如还放了环境光的情况，可以在获取模型的时候对灯光除以一个变量，通过自己的调整来达到一个自己比较想要的效果。如下:（输出高效，且可以封装公共文件来配置，可以封装组件）

```javascript
const intensityDivided = 1;
modelScene.traverse(function (child) {
  if (child.isLight) {
    child.intensity = child.intensity / intensityDivided;
  }
});
```

- 4、解决方法 2：可以让三维的同学，不输出灯光的，灯光都由自己通过 three 提供的 editor 工具自己去新建灯光和调节（适中）。
- 5、解决方法 3：可以让三维的同学，不输出灯光的，灯光都由自己通过 three 通过 js 自己创建灯光在通过 gui 和 lightHelper 去调节（最准确，效率最低）。

### 如果不想打灯，又不想让在三维上输出的灯光的方式。

可以通过把点光源，达到摄像机的方式来实现，类似于显示生活中，举着手电看物体的效果。这种方式只适合照相机远近不变，或者变化不大的情况去使用。否则会出现太远之后物体过暗，或者过近物体过爆的问题。当然也可以通过距离的变化来调整灯光的强度来实现，当然这个比例在很多时候并不好把控。

```javascript
const pointLight: THREE.PointLight = new THREE.PointLight(0xffffff, 0.5);
scene.add(camera);
camera.add(pointLight);
```
