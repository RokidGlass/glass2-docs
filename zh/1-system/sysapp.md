**Version：V1.0**


<h2 id="2">1. 系统预装应用</h2>

系统中预装了扫一扫、相机、相册、我的文件、系统设置等应用。

其中扫一扫、相机、我的文件有一些功能可对外开放，用户可以便捷的调用系统应用实现拍照、录像、播放视频、文档等功能，具体方法如下：

<h2 id="3">2. 支持的功能及调用方法</h2>

### 2.1 扫一扫
扫一扫提供了接口供其他应用调用，以实现配网及返回配网结果的功能，示例代码如下：

```
Intent intent = new Intent();
ComponentName comp = new ComponentName("com.rokid.glass.scan2",
	"com.rokid.glass.scan2.ScanActivity");
intent.putExtra("scan_model","wifi_connect");
intent.setComponent(comp);
this.startActivityForResult(intent, REQUEST_CODE_QR_SCAN_WIFI);
```

### 2.2 相机

系统预装的相机应用是我们重新开发定制的适配AR形态的相机，仍然支持调用原生相机的方式进行拍照和录像，并返回相关结果。


### 2.3 我的文件

我的文件是系统内置的文件浏览器，支持常见格式的视频、图片及pdf文档的浏览。支持其他应用以传参方式打开指定的本地文件，调用方式如下：

```
ComponentName component = new ComponentName("com.rokid.glass.document2",
	"com.rokid.glass.document2.activity.MainActivity");
Intent intent = new Intent();
intent.setComponent(component);
intent.putExtra("file_name", fileName);//文件名称，带后缀名
intent.putExtra("file_path_floder", floder);//文件所在目录,仅支持本地文件，不支持网络URL
intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK);
startActivity(intent);
```

通常情况下，我的文件会默认展示`/sdcard/Documents`目录下支持的文件，也可以通过如下调用，展示自定义的文件目录下支持的文件：

```
ComponentName component = new ComponentName("com.rokid.glass.document2",
	"com.rokid.glass.document2.activity.MainActivity");
Intent intent = new Intent();
intent.setComponent(component);
intent.putExtra("file_path_floder", "文件目录");
intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK);
startActivity(intent);
```




