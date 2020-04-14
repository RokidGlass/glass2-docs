**Version：V1.1**

<h2 id="1">1. 设备按键键值以及intent事件定义</h2>

用户操作  | 简单功能描述 | 应用层键值或意图 | 注释
-------  | ----------- | ------------ | ---
Back-长  | 开启音量调节窗口  | 开启音量调节窗口 | 注：被系统占用
Back-单  | 返回  | KEYCODE\_BACK = 4 | 
Back-双击  |   |  | 开发者可自己定义
TP-右滑  | 连续收到多个<br>KEYCODE\_DPAD\_RIGHT键值  | KEYCODE\_DPAD\_RIGHT = 22 | 应用可接收“连续键值”
TP-左滑  | 连续收到多个<br>KEYCODE\_DPAD\_LEFT键值  | KEYCODE\_DPAD\_LEFT = 21 | 应用可接收“连续键值”
TP-快速右滑  | 快速右滑离开TP。同时收到多个<br>KEYCODE\_DPAD\_RIGHT键值和单个<br>KEYCODE\_DPAD\_DOWN键值  | KEYCODE\_DPAD\_DOWN = 20 | 应用可接收“单次键值”
TP-快速左滑  | 快速左滑离开TP。同时收到多个<br>KEYCODE\_DPAD\_LEFT键值和单个<br>KEYCODE\_DPAD\_UP键值  | KEYCODE\_DPAD\_UP = 19 | 应用可接收“单次键值”
TP-单击 | 确认 | KEYCODE\_DPAD\_CENTER = 23
TP-长按 |  | KEYCODE\_TV = 170 | 开发者可自定义
Power | 电源键 | KEYCODE\_POWER = 26 |



<h2 id="2">2. 默认launcher配置方法</h2>

系统中允许预装多个launcher，通过prop属性配置选择默认launcher，不需要用户手动选择。

```
adb shell下使用setprop命令可以直接修改
setprop persist.boot.defaultlauncher your_launcher_packagename
setprop persist.boot.defaultactivity your_launcher_activityname
adb reboot
```

<h2 id="3">3. 系统应用黑名单配置</h2>
黑名单配置，不显示系统的某些应用   
通过配置文件launcher.json 配置不显示的应用列表，文件配置路径/sdcard/rokid/，配置完成后，重启生效  
示例：

``` 
{
  "reset": false,
  "favorites": [
    {
      "packageName": "com.rokid.translate"
    },
    {
      "packageName": "com.rokid.glass.Assault"
    }
  ]
}
```
### 3.1 系统应用列表
名称      |  packageName 
-------  | ----------- 
相机      | com.rokid.glass.camera
相册      | com.rokid.glass.gallery
设置     |com.rokid.glass.settings


