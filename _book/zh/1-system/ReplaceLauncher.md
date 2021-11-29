**Version：V1.0**

<h2 id="1">1. 替换默认桌面</h2>

开机自启方案，自启的应用可以退出，并回到系统默认桌面。如需求是仅运行自己的应用，不需要其他系统自带应用，我们也支持开发者将自己的应用作为默认桌面，替换掉系统自带的桌面，为了方便用户使用，我们对原生Android的逻辑进行了修改，需要遵循以下步骤进行替换：

1. 首先，应用必须具备HOME属性``android.intent.category.HOME``，
2. 通过adb安装要作为Launcher的应用，
3. 通过adb 设置两个系统属性，

	```
	adb shell setprop persist.boot.defaultlauncher 应用包名
	adb shell setprop persist.boot.defaultactivity 主Activity名
	```
4. 重启设备生效。





