**Version: lpr_sdk 2.0.0**

***

# 车牌识别

* [https://github.com/Rokid/RokidLprSDK](https://github.com/Rokid/RokidLprSDK)

## 1.  概述

RokidLprSDK提供车牌检测和车牌识别接口。

## 2. 集成说明

### 2.1 添加第三方依赖库
在project的build.gradle中添加jcenter依赖

```java
allprojects {
    repositories {
        google()
        jcenter()
    }
}
```

在app的build.gradle中添加依赖

```java
dependencies {
    implementation 'com.rokid.glass:lpr:2.0.0'
}
```

### 2.2 需要如下权限

相机权限：

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-feature android:name="android.hardware.camera" />
<uses-feature android:name="android.hardware.camera.autofocus" />
```

## 3. 接口说明

### 3.1 初始化

```java
public long init(Context context)
```

参数|含义
------|---------
context | 上下文context

**返回:**  

`Pipeline句柄`

### 3.2 相机预览识别

#### 3.2.1 车牌检测

```java
public int[] detect(byte[] data, int w, int h, int method, long  object)
```

参数|含义
------|---------
data | 相机预览数据
w | 预览图片的宽
h | 预览图片的高
method | 检测方法
object | 初始化时拿到的Pipeline句柄

**返回：**

`图片中车牌的位置[x, y, width, height]，当有多个车牌时可能有多组数据`

#### 3.2.2 车牌识别

```java
public String recogAll(byte[] data, int w, int h, int method, int[] rects, long  object)
```

参数|含义
------|---------
data | 相机预览数据
w | 预览图片的宽
h | 预览图片的高
method | 检测方法
rects | 车牌位置
object | 初始化时拿到的Pipeline句柄

**返回：**

`车牌号`

### 3.3 图片输入识别

```java
public String recognizationBGR(byte[] data, int w, int h, int method, long  object)
```

参数|含义
------|---------
data | RGB格式图片数据
w | 图片的宽
h | 图片的高
method | 检测方法
object | 初始化时拿到的Pipeline句柄

**返回：**

`车牌号`

### 3.4 模型更新

会将assets下的Citrus文件夹中的文件拷贝到应用程序的内部存储路径/data/data/<application package>/files/Citrus下。

```java
public String updateModel(Context context)
```

参数|含义
------|---------
context | 上下文context


**返回：**

`模型文件的位置`

## 4. sample说明

### 4.1 android_sample

	可运行在普通安卓手机上，对预览界面内车牌进行自动识别。

### 4.2 glass_sample

	运行在glass上，对固定视线区域内车牌进行自动识别。

	
