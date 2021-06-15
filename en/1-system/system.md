**Version：V1.2**


<h1>系统配置(System Environment)</h1>
<h2 id="2">1. 默认launcher配置方法</h2>

系统中允许预装多个launcher，通过prop属性配置选择默认launcher，不需要用户手动选择。
If more than one launchers deployed in the system, you can user prop property to set the default launcher.

```
adb shell下使用setprop命令可以直接修改
setprop persist.boot.defaultlauncher your_launcher_packagename
setprop persist.boot.defaultactivity your_launcher_activityname
adb reboot
```

<h2 id="3">2. 系统应用黑名单配置(Black List settings for System Apps)</h2>
黑名单配置，不显示系统的某些应用 (Hide the system apps in the launcher with Black List settings)
通过配置文件launcher.json 配置不显示的应用列表，文件配置路径/sdcard/rokid/，配置完成后，重启生效 (You can set the hidden app list in the configure file 'launcher.json" located in /sdcard/rokid/. The update configuration will be activate after rebooting the system. 
示例(Sample)：

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
### 2.1 系统应用列表(System App List)
名称(Name)      |  packageName 
-------  | ----------- 
相机(Camera)      | com.rokid.glass.camera
相册(Gallery)      | com.rokid.glass.gallery
我的文件(Document) | com.rokid.glass.document
应用管理(App Manager)| com.rokid.glass.appstroe
设置(Settings)     |com.rokid.glass.settings


