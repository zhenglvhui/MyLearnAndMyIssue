## 该文件是在使用 three.js 中 控制器遇到的问题

### 在使用 OrbitControls 控制器的时候，旋转的时候，默认是旋转着某一个物体（点）转的，但是现在有一个场景是需要，围绕着相机自身来去转动。该怎么解决？

- 起初的时候，复制了一份 OrbitControls 源文件，对源码进行修改，能够围绕着自生去旋转，但是放弃了旋转着某一个物体（点）转的，遇到都需要的时候，会在两个控制器之间来回切换，这个解决方案的实现并不是很友好。
- 于是经过了一些思考后，想到了如果我围绕旋转的位置，比我自身的位置到目标物体的位置中的 某一个离自己最近的点位，就可以实现类似相机自动转动的效果。

```javascript
let firstMeshPositionCopy: THREE.Vector3 = movePosition.clone(); // 相机位置
let targetMeshPositionCopy: THREE.Vector3 = targetPosition.clone(); // 目标位置
firstMeshPositionCopy.lerp(targetMeshPositionCopy, 0.05); // 要围绕某个点位旋转的位置
controls.target.set(
  firstMeshPositionCopy.x,
  targetMeshPositionCopy.y,
  firstMeshPositionCopy.z
);
```

### 移动到指定点位，同时有移动的过程动画并围绕自身旋转

```javascript
/**
 *
 * @param {Vector3} movePosition  要移动到的位置
 * @param {Vector3} targetPosition 要看向的位置
 * @param {Boolean} isInternal 是否内部浏览
 */
let globalTween: TWEEN.Tween<THREE.Vector3>;
let moveCameraTween = (
  movePosition: THREE.Vector3,
  targetPosition: THREE.Vector3,
  isInternal: boolean = true,
  callback = () => {}
) => {
  let toTargetPositionY = isInternal ? targetPosition.y : movePosition.y;
  if (globalTween) {
    globalTween.stop();
  }
  // 解决微任务bug
  setTimeout(() => {
    controls.enableRotate = false;
  }, 0);
  globalTween = new TWEEN.Tween(camera.position)
    .to(
      new THREE.Vector3(movePosition.x, toTargetPositionY, movePosition.z),
      3000
    )
    .easing(TWEEN.Easing.Sinusoidal.InOut)
    .start()
    .onUpdate((nowPosition, percentage) => {
      controls.target.set(
        targetPosition.x * percentage + nowPosition.x * (1 - percentage),
        targetPosition.y * percentage + nowPosition.y * (1 - percentage),
        targetPosition.z * percentage + nowPosition.z * (1 - percentage)
      );
      controls.update();
    })
    .onComplete(() => {
      callback();
      if (currentView.value != ENUM_VIEW_TYPE.vertical) {
        controls.enableRotate = true;
      }
      // 看向物体前方一点
      if (!isInternal) return;
      let firstMeshPositionCopy: THREE.Vector3 = movePosition.clone();
      let targetMeshPositionCopy: THREE.Vector3 = targetPosition.clone();
      firstMeshPositionCopy.lerp(targetMeshPositionCopy, 0.05);
      controls.target.set(
        firstMeshPositionCopy.x,
        targetMeshPositionCopy.y,
        firstMeshPositionCopy.z
      );
    });
};
```
