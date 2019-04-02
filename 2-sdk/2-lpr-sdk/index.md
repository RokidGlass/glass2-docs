**Version: lpr_sdk 2.0.0**

***

# lpr_sdk


## 1.  概述

RokidLprSDK提供车牌检测和车牌识别接口。

## 2. 集成说明

### 2.1 添加三方依赖库
在project的build.gradle中添加

```
allprojects {
    repositories {
        google()
        jcenter()
        maven {url "http://mvnrepo.rokid-inc.com/nexus/content/repositories/snapshots/"}
        maven {url "http://mvnrepo.rokid-inc.com/nexus/content/repositories/releases/"}
    }
}
```

在app的build.gradle中添加依赖

```
dependencies {
    implementation 'com.rokid:facelib:2.1.0.1-SNAPSHOT'
}
```	

### 2.2 需要如下权限

相机权限：

```
<uses-permission android:name="android.permission.CAMERA" />
<uses-feature android:name="android.hardware.camera" />
<uses-feature android:name="android.hardware.camera.autofocus" />
```

## 3. 接口说明

* 初始化

```
public long init(Context context)
```

* 相机预览识别

```
public int[] detect(byte[] data, int w, int h, int method, long  object)
返回值为车牌位置[x, y, width, height]，当有多个车牌时可能有多组数据

public String recogAll(byte[] data, int w, int h, int method, int[] rects, long  object)
返回值为车牌号
```

* BGR数据输入识别

```
public String recognizationBGR(byte[] data, int w, int h, int method, long  object)
```

* 模型更新

```
public String updateModel(Context context)

会将assets下的Citrus文件夹中的文件拷贝到应用程序的内部存储路径/data/data/<application package>/files/Citrus下
```
## 4. sample说明
### 4.1 android_sample

	可运行在普通安卓手机上，对预览界面内车牌进行自动识别。

### 4.2 glass_sample

	运行在glass上，对固定视线区域内车牌进行自动识别。

	
