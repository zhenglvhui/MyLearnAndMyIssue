# 微信小程序的一些问题

### 打开或者关闭页面触发的生命周期顺序

- 打开： onLaunch(app) -> onshow(app) -> onLoad(page) -> onShow(page) -> onReady(page)
- 再次打开 onLaunch(app) 如果小程序没有被销毁就不执行
- 切换到后台(关闭 app)： onHide(page) -> onHide(app)
- 切换到前台： onShow(app) -> onShow(page)
- 关闭当前页面进入下一个页面： onHide(page) -> onLoad(另一个 page)-> onShow (另一个 page) -> onReady(另一个 page)
- 返回上一个页面的时候： onUnload(page) -> -> onShow (另一个 page)

### 获取当前页面相关信息

```javascript
let pages = getCurrentPages(); //当前页面栈
//当前页面为页面栈的最后一个元素
let prevPage = pages[pages.length - 1]; //当前页面
or;
// pop() 方法用于删除并返回数组的最后一个元素
let prevPage = pages.pop(); //当前页面
console.log(prevPage.route); //举例：输出为‘pages/index/index’
```

### 小程序运行机制

- 热启动 ：假如用户已经打开了某个小程序，在一定时间(30 分钟内)内再次打开小程序的话，这个时候我们就不再需要重新启动了，这需要把我们的后台打开的小程序切换到前台来使用。
- 冷启动：用户首次打开小程序或被微信主动销毁再次打开的情况，此时小程序需要重新加载启动。

### 自定义 tabbar

- 第一步在 tabbar 中配置 custom: true
- 第二步 在子页面或者全局加 usingComponents
- 第三步 根目录新增 custom-tab-bar + 4 个 index wxss wxml js json 对 tabbar 进行编写

### 小程序的生命周期函数

- 应用生命周期
  onLauch（第一次打开小程序的时候，监听小程序初始化） onShow（页面打开，监听小程序启动或者切前台） onhide（页面隐藏，监听小程序关闭和切后台）

- 应用其他
  onPageNotfound(找不到页面) onError（报错的时候） onThemeChange (系统切换主题)

- 页面生命周期
  onload(加载页面的时候) onShow（页面显示的时候） onready（页面渲染完成） onhide（页面隐藏） onUnLoad（卸载的时候）
- 页面其他
  onPullDownRefresh 下拉刷新
  onResize 视口变化的时候
  onTabItemTap 切换 tab 页的时候
  onShareAppMessage 分享页面的时候触发
  onReachBottom 下拉到底部的时候
  onPageScroll 滚动的时候触发

- 组件的生命周期
  created (实例创建的时候) -> attached(组件初始化完毕，进入组件时触发) -> ready (当组件布局完成时触发) -> detached(离开组件时触发)
  moved(组件实例被移动到另外一个组件时触发) error(异常触发)

### 微信小程序获取用户信息的两种方式

- open-data 组件
- wx.getUserProfile

### 微信小程序接入微信支付实现过程详解

- 注册好的微信商户号，并在微信商户后台开启支付权限
- 设置证书和密钥、商户号等
- 点击申请 JSAPI 支付
- 开发配置中需要填写支付授权目录（后端服务器域名）
- 调后端接口拿到签名（时间戳，随机字符串，签名）和订单支付金额和签名的一系列等数据，在调用 wx.requestPayment 调起微信支付功能

### 如何辨别不过小程序或者公众号是否同一用户

1、通过 unionid 来判断，如果相同，表示同一用户。、
openId 公众号 小程序的 openId 是可能不同

### 微信授权流程

- 通过 bindgetUserInfo 判断用户是否授权
- 如果未授权，提示用户进行授权，如果用户不授权，就显示未授权页面，
- 如果同意授权，就跳转到授权后的页面 执行下面如何如何获取 openID 和 unionId 的操作

### 如何获取 openID 和 unionId

第一步： 通过 wx.login 获取用户凭证 获取到 code 有效期 5 分钟
第二步： 开发者调用开发者服务器接口（code + appid(应用 id) + secret(应用密钥)），服务器去调用微信的 auth.code2Session 获取到 openID 和 unionId （可能为空，需要注册开放平台）还有 session_key
为什么不直接前端去调用服务器接口呢，反正别人抓包到前端 appid 和 secret， 所以将这两个参数存储到后端，由后端去给微信服务器发送请求


### setStorage 和 setStorageSync 的区别

- wx.setStorage 是异步的：就是这个在执行中不会影响其他代码的执行
- wx.setStorageSync 是同步的：要等待这个代码执行完才会去执行其他的代码
- wx.setStorage 包含 suceess fail 和 complate 方法

### 坑

- 1、使用 wx-if 会导致，css 无法渗透到 vant 的类名上，导致 css 不生效，可以使用 hidden 代替 v-if。
- 2、setData 会触发更新，如果在循环的时候使用，会导致白屏事件过长，影响用户体验，可以定义变量，循环内处理，最后统一 setData。
- 3、ios 中弹出的 touch 会滑动到被盖住的主页面，解决方法 touchmove = 一个空方法
- 4、整个小程序所有分包大小不超过 20M
单个分包/主包大小不能超过 2M
这也导致了，只能放代码和部分小图片。时长遇到优化的问题。
图片只能放到服务器，引用完整链接
分包资源不能互用，只能使用主包资源
- 5、ios 和安卓时间计算不兼容问题 ios 只指出 2022/11/11 不支持 2022-11-11 所以要判断是否 ios 系统，然后进行 replace 替换
- 6、在手机相册中选择完图片后直接跳转会出现闪回的现象
原因：在选择完图片后，会重新执行一遍 page 的 onShow 生命周期
解决：在选择完图片后，做一个 sleep 延时 1 秒，再进行跳转
- 7、textarea 层级问题
问题：textarea 的 placeholder 会显示在弹窗的层级之上
解决：使用 wx:if 判断当没有值的时候用 view 代替 textarea 最好封装为组件 或者 弹出层使用 cover-view 组件，而不是 view，覆盖住所有原生组件。
