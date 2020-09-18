# 车牌识别SDK
**Version：3.7.1.1**

---

## 接口使用示例demo
https://github.com/Rokid/RokidLprSDK

## 一. 概述

RokidLPRSDK提供车牌检测+车牌识别功能，根据camera输入数据，输出车牌字符串，车牌位置，识别质信度。

## 二. 集成说明
---
### 2.1 添加三方依赖库
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
    implementation 'com.rokid.glass:lpr:3.7.1.1'
}
```

### 2.2 需要如下权限
读取外部存储权限：
```xml
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE/>
```
相机权限：
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-feature android:name="android.hardware.camera" />
<uses-feature android:name="android.hardware.camera.autofocus" />
```

## 三. 接口说明及示例
---
### 3.0 车牌识别引擎初始化
在应用的Application的onCreate方法中初始化引擎：
```java
RokidLPR.Init(Context context,boolean npuMode);
```
参数|含义
------|---------
context | 上下文context
npuMode | 是否切换到npu模式（注意：设备必须支持npu才能将该值设为true）


### 3.1 参数配置
**1. 设置数据源宽高**
``` java
LPRConfig lprConfig = new LPRConfig();
lprConfig.width = PREVIEW_WIDTH;
lprConfig.height = PREVIEW_HEIGHT;
```
参数|含义
------|---------
width | 输入数据的宽
height | 输入数据的高


### 3.2 车牌识别
#### 1. 车牌sdk创建
``` java
RokidLPR rokidLPR = new RokidLPR();
```

**返回:**
`RokidLPR` 车牌识别接口

#### 2. 设置相机预览数据
说明：将相机数据传入sdk
``` java
void setData(byte[] data)
```
参数|含义
------|---------
data | camera数据 要求nv21格式

示例代码：
```java
rokidLPR.setData(data);
```
#### 3. 车牌识别结果获取
说明：检测结果会统一以LPRModel数据结构返回
``` java
void startLPR(RokidLPRCallback rokidLPRCallback)
```
参数|含义
------|---------
rokidLPRCallback | 车牌识别结果统一回调接口

示例代码：
```java
rokidLPR.startLPR(new RokidLPRCallback(){
            @Override
            public void onLPRCallback(LPRModel model) {
            
            }
        });
```
#### 4. 车牌识别接口的销毁
说明：车牌识别接口的内存回收
```java
rokidLPR.destroy();
```

### 3.3 车牌实体类

```java
public class LPRModel {
    public int width;
    public int height;
    public List<LPRDO> lps = new ArrayList();//车牌数据model，包含LPRDOlist

    public LPRModel() {
    }
}

public class LPRDO {
    public RectF position;//车牌在camera中的位置
    public String licensePlate;//车牌字符串
    public float score;//车牌识别质性度

    public LPRDO() {
    }
}
```
