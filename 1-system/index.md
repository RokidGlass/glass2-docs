**Version：V3.1**

<h2 id="1">1.设备按键键值以及intent事件定义</h2>

用户操作  | 简单功能描述 | 应用层键值或意图 | 注释
-------  | ----------- | ------------ | ---
Back-长  | 发送Intent  | Action为  com.rokid.glass.homekey.longpress | 注：被语音助手占用，有语音助手时不可自定义
Back-单  | 返回  | KEYCODE\_BACK = 4 | 
Back-双击  | 0.不处理<br>1.回到launcher<br>2.发送Intent  | Action为  com.rokid.glass.homekey.doubleback | 可由用户配置，配置方法参考下条
TP-右滑  | 连续收到多个<br>KEYCODE\_DPAD\_RIGHT键值  | KEYCODE\_DPAD\_RIGHT = 22 | 应用可接收“连续键值”
TP-左滑  | 连续收到多个<br>KEYCODE\_DPAD\_LEFT键值  | KEYCODE\_DPAD\_LEFT = 21 | 应用可接收“连续键值”
TP-快速右滑  | 快速右滑离开TP。同时收到多个<br>KEYCODE\_DPAD\_RIGHT键值和单个<br>KEYCODE\_DPAD\_DOWN键值  | KEYCODE\_DPAD\_DOWN = 20 | 应用可接收“单次键值”
TP-快速左滑  | 快速左滑离开TP。同时收到多个<br>KEYCODE\_DPAD\_LEFT键值和单个<br>KEYCODE\_DPAD\_UP键值  | KEYCODE\_DPAD\_UP = 19 | 应用可接收“单次键值”
TP-单击 | 确认 | KEYCODE\_DPAD\_CENTER = 23
TP-长按 |  | KEYCODE\_TV = 170 | 用户可自定义
TP-双击 |  | KEYCODE\_ENTER = 66 | 用户可自定义
Power | 电源键 | KEYCODE\_POWER = 26 |
Volume+  | 音量加 | KEYCODE\_VOLUME\_UP = 24 |
Volume- | 音量减 | KEYCODE\_VOLUME\_DOWN = 25 |

<h2 id="2">2. 双击back键配置方法</h2>

* 系统支持以下三种双击back键模式，允许应用开发者自定义双击back键。**模式切换需要重启**
  * 返回桌面模式：系统属性默认为1：双击back键回到launcher
  * 原生安卓模式：若应用设置系统属性为0：系统不做处理
  * 系统广播模式：若应用设置系统属性为2：系统接收到双击back键事件后，会发送广播（参考上面按键键值定义）

```
 adb shell setprop persist.rokid.backPanicBehavior 0 // 0.不处理  1.回到launcher  2.发送Intent
 adb reboot
```

<h2 id="3">3. 默认launcher配置方法</h2>

系统中允许预装多个launcher，通过prop属性配置选择默认launcher，不需要用户手动选择。

```
adb shell下使用setprop命令可以直接修改
setprop persist.boot.defaultlauncher your_launcher_packagename
setprop persist.boot.defaultactivity your_launcher_activityname
adb reboot
```

<h2 id="4">4. 系统应用黑名单配置</h2>
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
### 4.1 系统应用列表
名称      |  packageName 
-------  | ----------- 
相机      | com.rokid.glass.camera
相册      | com.rokid.glass.gallery
人脸识别   | com.rokid.camera.cameradeploy
突袭     |com.rokid.glass.Assault
翻译     |com.rokid.translate
远程协作  |com.rokid.remotecooperation
设置     |com.rokid.glass.settings


<h2 id="5">5.	语音指令配置方法：</h2>
系统支持使用语音指令控制app的行为以及系统的行为（如回到桌面）配置方法如下：
修改`/system/etc/local_order_config.json`，其中典型的一条配置如下

```
{
"name": "相册APP",
"packageName": "com.rokid.glass.gallery",
"order": [
   {
        "prefixWord": "打开",
        "entryWord": "相册",
        "useVague": false,
        "useRegular": false,
        "entryRegular": "",
        "target": {
            "type": "activity",
                "content":"com.rokid.glass.gallery.MainActivity",
            "param": "",
            "event": ""
         }
    }
]
},

```

* name：app的名字，仅标识用；
* packageName：需要语音指令控制的app的packagename；
* order：
	* prefixWord/entryWord/useVague:这三个配置项为一组，prefixWord和entryWord为具体的语音指令。useVague为是否开启模糊查询，ture表示开启，则语音中包含prefixWord和entryWord关键字即可命中；false表示关闭，则需要语音与prefixWord和entryWord完全一致才可以命中；
	* useRegular和entryRegular为一组，表示是否使用正则表达式。当useRegular配置为true时，则使用正则表达式，prefixWord和entryWord的配置将失效，使用entryRegular中的正则表达式来匹配语音指令。
* target：
	* basicOrder：由语音助手直接执行的全局指令，目前支持“go_launcher”，表示返回桌面；
	* type/content：type支持“activity”“service”等，content为具体的activity或者service，将由语音助手拉起；
	* param/event: 由语音助手发送的消息，由用户自定义，用于控制不同的行为。

<h2 id="5">6. 特别注意事项：</h2>
为节省功耗，保护屏幕，延长设备使用时间，app设计开发和眼镜使用时需注意以下几点：

* 如无必要，不要在app中加屏幕常亮锁，系统默认30s超时灭屏；
* 不要长时间在最高亮度下显示对比明显的图片；
* 尽量不要在固定位置一直显示固定图标；
* 眼镜摘下放置时，注意不要遮挡距离感应传感器（距离感应传感器位于显示屏上方）；
* 眼镜放入收纳箱前应先关机。

