## 关于材质遇到的一些问题

### 在一个物体的上面希望显示对应的名字，并且文字还要跟随视角移动。

- three.js 提供了一种点精灵材质，该材质会始终看向相机的位置。配合着 canvas 的屏幕，可以实现类似跟随移动的效果。

```javascript
// 创建精灵mesh
const createSpriteMesh = function (
  name: string,
  color: number = 0xffff00,
  font: string = "Bold 60px Arial",
  lineWidth: number = 2
): THREE.Sprite {
  //先用画布将文字画出
  let canvas: HTMLCanvasElement = document.createElement("canvas");
  canvas.width = 400;
  canvas.height = 200;
  let ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#fff";
    ctx.font = font;
    ctx.textAlign = "center";
    ctx.lineWidth = lineWidth;
    ctx.fillText(name, 200, 150);
  }
  let texture: THREE.Texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  //使用Sprite显示文字
  let material: THREE.SpriteMaterial = new THREE.SpriteMaterial({
    map: texture,
    color: 0xffff00,
  });
  let sprite: THREE.Sprite = new THREE.Sprite(material);
  return sprite;
};

// 创建文字精灵物体
let text: string = child.userData.name.split("-")[2].split("_")[0];
let spriteMesh: THREE.Sprite = createSpriteMesh(text);
spriteMesh.scale.set(spriteInitScale.x, spriteInitScale.y, 1);
spriteMesh.position.set(
  child.position.x,
  child.position.y + 3,
  child.position.z
);
spriteMesh.name = ENUM_MESH_TYPE.text + "-" + child.userData.name.split("-")[1];
spriteMesh.visible = false;
spriteMeshList.push(spriteMesh);
modelScene.add(spriteMesh);
```

### 想要一个物体的跟随灯光方向，产生阴影

- 1、render 开启阴影模式

```javascript
renderer.shadowMap.enabled = true;
```

- 2、要产生阴影的灯光开启阴影模式。

```javascript
light.castShadow = isCastShadow;
```

- 3、要被透射阴影的物体开启阴影模式、

```javascript
mesh.castShadow = true;
mesh.material.side = THREE.DoubleSide;
mesh.material.shadowSide = THREE.BackSide;
mesh.receiveShadow = true;
```
