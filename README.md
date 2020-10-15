# scriptable_widget

这是一个 ios 小组件，用于显示日期，天气，定位，倒计时，可自行根据需要修改代码。
如若是不懂代码的，想添加或修改显示内容，可找到 elements 变量，按照里面的格式添加或修改即可。

## 使用前需知:
1. 天气和定位使用的是高德地图的api,请自行申请api的key,并填写到代码里第一行的 API_KEY 常量中
   申请方法 [高德地图api](https://lbs.amap.com/api/webservice/guide/create-project/get-key)
2. 天气图片在 icon_weather 文件夹,在ios的文件里找到名为scriptable的文件夹，把该文件夹下载下来放到里面，并重命名为 images
3. 若要使widget背景透明，则需要自行选取背景图放到上面说到的 images文件夹里，并命名为 bg
4. 若图片没有生效，可能是文件类型不同，可自行在代码里修改图片名，现代码里背景名后缀是 jpg ，天气图片是 png

### 使用方法：
1. 在ios设备上下载 scriptable
2. 在 scriptable 里新建代码，把 index.js 的代码复制过去
3. 在手机桌面添加 scriptable 组件，长按选择新建的代码，并运行
