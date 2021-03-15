# 人脸识别离线SDK
**Version：facelib 4.16.3.3**

---

## 接口使用示例demo
https://github.com/Rokid/RokidFaceSDK/tree/master/sample

## 一. FaceSDK介绍

### 版本号说明：
前两位4.16表示算法版本号，后两位3.3表示sdk版本号
### 1.1 概述
RokidFaceSDK提供基础的人脸检测+人脸跟踪+人脸识别，能够高效进行多人识别。本SDK封装底层算法接口，提供：

1.图片人脸检测+图片人脸识别<br>
2.相机预览数据人脸检测，人脸跟踪，人脸识别。<br>
3.人脸数据库增删改查的接口<br>
4.能够获取人脸角度以及人脸质量等信息<br>
5.单帧图片人脸检测，支持bitmap、NV21格式数据人脸检测<br>

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
若使用该sdk的终端使用一般cpu计算平台，则：
```java
dependencies {
    implementation 'com.rokid.glass:facelib:4.16.3.3-cpu'
}
```
若使用该sdk的终端使用s905d3计算平台(rokid glass二代)，则：
```java
dependencies {
    implementation 'com.rokid.glass:facelib:4.16.3.3-npu-s905d3'
}
```
### 2.2 需要如下权限
网络权限：
```xml
<uses-permission android:name="android.permission.INTERNET"/>
```

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
### 3.0 人脸识别引擎初始化
在应用的Application的onCreate方法中初始化引擎：

**1. 人脸识别引擎初始化**

```java
RokidFace.Init(Context context);
```
参数|含义
------|---------
context | 上下文context

### 3.1 人脸数据库操作
#### 3.1.1 人脸数据库初始化
人脸数据库初始化需要下面几步操作:

**1. 创建人脸数据库Helper对象**

说明：数据库操作的实体类

```java
FaceDbHelper(Context context)
```

参数|含义
------|---------
context | 上下文context

**返回:**
`FaceDbHelper`

**2. 创建人脸数据库**

``` java
void createDb()
```

示例代码
```java
FaceDbHelper faceDbHelper = new FaceDbHelper(getApplicationContext());
faceDbHelper.createDb();
```

#### 3.1.2 人脸特征的添加
说明: 添加人脸特征到内存中
``` java
String add(Bitmap bm)
```

参数|含义
------|---------
bm | 传入的图片

**返回:**
图片人脸特征ID，表示对该图片人脸特征的唯一识别号，在人脸识别时会返回该特征ID；开发者可以以该ID为主键创建人脸信息数据库，当人脸识别返回该ID时，去查询人脸信息。

示例代码：
``` java
String featId = faceDbHelper.add(bm);
```

#### 3.1.3 人脸特征搜索引擎保存到本地
说明:
* 人脸特征搜索引擎文件为"SearchEngine.bin"；
* 使用人脸识别时需将这该文件拷贝至需要的设备中;
``` java
void save()
```

示例代码：
```java
faceDbHelper.save();
```
#### 3.1.4 清除人脸特征库搜索引擎
``` java
faceDbHelper.clearDb();
```

### 3.2 人脸检测参数配置
#### 3.2.1 人脸检测配置参数
**1. 设置数据源宽高**
``` java
DetectFaceConf setSize(int width,int height)
```
参数|含义
------|---------
width | 输入数据的宽
height | 输入数据的高

**返回:**

类型|含义
------|---------
DetectFaceConf| 人脸检测配置类 

**2. 设置算法检测区域**

``` java
DetectFaceConf setRoi(Rect rect)
```
参数|含义
------|---------
rect | 输入算法检测区域

**返回:**

类型|含义
------|---------
DetectFaceConf| 人脸检测配置类 


**3. 设置同时识别最大人脸数**
``` java
DetectFaceConf setPoolNum(int poolNum)
```
参数|含义
------|---------
poolNum | 同时识别最大人脸数

**返回:**

类型|含义
------|---------
DetectFaceConf| 人脸检测配置类 

**4. 设置识别的最大的人脸**

``` java
DetectFaceConf setMaxSize(float faceMaxSize)
```
参数|含义
------|---------
faceMaxSize | 识别的最大的人脸size 取值(0f-1f)。例：如果相机分辨率为1280*720，那能够识别的最大人脸的像素为 width：1280 * faceMaxSize height:720 * faceMaxSize

**返回:**

类型|含义
------|---------
DetectFaceConf| 人脸检测配置类 

**5.设置识别的最小的人脸**
``` java
DetectFaceConf setMinSize(float faceMinSize)
```
参数|含义
------|---------
faceMinSize | 识别的最小的人脸size 取值(0f-1f)。例：如果相机分辨率为1280*720，那能够识别的最大人脸的像素为width：1280 * faceMinSize height:720 * faceMinSize

**返回:**

类型|含义
------|---------
DetectFaceConf| 人脸检测配置类 

**6. 设置单次detect的最大人脸数**
``` java
DetectFaceConf setDetectMaxFace(int detectMaxFace)
```
参数|含义
------|---------
detectMaxFace | 单次detect能检测到的最大人脸数

**返回:**

类型|含义
------|---------
DetectFaceConf| 人脸检测配置类 

**7. 设置识别相关配置**

``` java
RecogFaceConf setRecog（boolean recog,String dbName）
```
参数|含义
------|---------
recog | 是否打开人脸识别开关
dbName| 人脸数据库文件夹路径

**返回:**

类型|含义
------|---------
RecogFaceConf| 人脸识别配置类 

**8. 设置识别阈值**

``` java
RecogFaceConf setTargetScore(float targetScore);
```
参数|含义
------|---------
targetScore | 阈值(取值0-100)，小于阈值的识别结果将被过滤

**返回:**

类型|含义
------|---------
RecogFaceConf| 人脸识别配置类 

**9. 设置识别超时**

``` java
RecogFaceConf setOutTime(long ms);
```
参数|含义
------|---------
ms | 超时时间，超过该时间还没有超过阈值的识别结果，则返回超时

**返回:**

类型|含义
------|---------
RecogFaceConf| 人脸识别配置类 

**10. 设置识别间隔**

``` java
RecogFaceConf setRecogInterval(long ms);
```
参数|含义
------|---------
ms | 识别间隔，同一张人脸两次识别的时间间隔

**返回:**

类型|含义
------|---------
RecogFaceConf| 人脸识别配置类 
示例代码：
```java
DetectFaceConf conf = new DetectFaceConf();
conf.setSize(width, height); // 设置数据宽高
conf.setRoi(rect); // 设置检测roi区域
RecogFaceConf conf = new RecogFaceConf();
conf.setRecog(true, dbPath); //设置人脸识别搜索引擎的路径
conf.setTargetScore(80);//设置识别阈值
conf.setsetOutTime(2000);//设置超时时间
conf.setRecogInterval(5000);//设置识别间隔
```

### 3.3 相机/video人脸检测
#### 3.3.1 人脸sdk创建
**1. 动态参数配置**
``` java
VideoRokidFace create(Context context,DetectFaceConf dFaceConf)
```
参数|含义
------|---------
context | 上下文context
dFaceConf| 动态配置类

**返回:**
`VideoRokidFace` video人脸识别接口

**2. 静态参数配置**
``` java
sconfig(RecogFaceConf conf)
```
参数|含义
------|---------
conf | 静态配置类

示例代码：
```java
VideoRokidFace videoFace = VideoRokidFace.create(context,videoDFaceConf);
videoFace.sconfig(sFaceConf);
```
#### 3.3.2 设置相机预览数据
说明：将数据传入sdk
``` java
void setData(VideoInput videoInput)
```
参数|含义
------|---------
videoInput | video输入数据类

示例代码：
```java
videoFace.setData(new VideoInput(bytes));
```
#### 3.3.3 检测数据获取
说明：获取输入的数据
``` java
byte[] getBytes()
```
**返回:**
相机传入的数据

示例代码：
```java
videoFace.getBytes();
```
#### 3.3.4 人脸检测+人脸跟踪
说明：检测结果会统一以[FaceModel](#352-人脸数据类)数据结构返回
``` java
void startTrack(RokidFaceCallback rokidFaceCallback)
```
参数|含义
------|---------
rokidFaceCallback | 人脸检测+人脸跟踪+人脸识别的统一回调接口

示例代码：
```java
videoFace.startTrack(new RokidFaceCallback() {
    @Override
    public void onFaceCallback(FaceModel model) {

    }
});
```
#### 3.3.5 人脸检测的销毁
说明：人脸识别接口的内存回收
```java
videoFace.destroy();
```
### 3.4 单张图片的人脸检测
#### 3.4.1 人脸检测创建
说明：创建图片识别接口
```java
IImageRokidFace imageFace = ImageRokidFace.create(context);
```
参数|含义
------|---------
context | context上下文

**返回:**
`IImageRokidFace` 图片识别的接口

示例代码：
```java
IImageRokidFace imageFace = ImageRokidFace.create(context);
```

#### 3.4.2 人脸检测初始化
说明：图片识别静态配置
```java
IImageRokidFace sconfig(RecogFaceConf sFaceConf)
```
参数|含义
------|---------
sFaceConf | 人脸识别配置

**返回:**
`IImageRokidFace` 图片识别的接口

示例代码：
```java
// 如果图片检测需要人脸识别，则sconfig
imageFace.sconfig(new RecogFaceConf().setRecog(true, dbPath));
```
#### 3.4.3 人脸检测接口
说明：图片识别的功能实现接口
```java
setImageFaceCallback(BitmapInput bitmapInput,ImageFaceCallBack callback)
```
参数|含义
------|---------
bitmapInput | 图片输入的数据结构；
callback | 图片人脸检测+人脸识别的统一回调接口

示例代码：
```java
imageFace.setImageFaceCallback(new BitmapInput(bitmap),
    new ImageRokidFace.ImageFaceCallBack() {
        @Override
        public void onFaceModel(FaceModel model) {

        }});
```
#### 3.4.4 人脸检测销毁
说明： 图片人脸识别接口的回收
```java
imageFace.destroy()
```

### 3.5 人脸实体类

#### 3.5.1 人脸数据类
```java
FaceModel {
   int width;
   int height;
   public byte[] data; //当前帧数据
   List<FaceDO> faces; //人脸检测数据model，包含FaceDO list
}

FaceDO {
    public RectF faceRectF; // 人脸rect
    public int trackId;  // trackId 人脸trackId，tracking中id不变
    public boolean goodQuality;//人脸质量是否合格
    public boolean goodPose;//人脸角度是否合格
    public float[] pose; //人脸角度
    public float userInfoScore; //搜索引擎中搜索出的人脸相似度(取值0-100)，取值越高表示该人脸与搜索结果的相似度越高。
    public float quality; //人脸质量（取值0-100），取值越高表示该人脸的质量越高。一般该值在0-30，认为人脸质量低；该值在30-60，认为人脸质量达标，可以去做人脸识别；该值大于60，认为人脸质量非常好。
    public boolean recogOutTime;//人脸是否超时
    public float faceScore;//该帧rect与人脸的相似度(取值0-100)，取值越高表示该帧rect是人脸的概率越高，一般该值大于75，可以认为是人脸。(请与userInfoScore区分)
    public int faceAlignTime;//该人脸做faceAlign算法的次数
    public int faceRecogTime;//该人脸做faceRecog算法的次数
    public String featid;//搜索引擎中查询出来的唯一识别号
    public Bitmap recogBitmap;//算法用于识别的图片
    public boolean qualityGoodEnough;//该人脸的quality是否已经大于60
}
```
## 四.关键步骤日志
### 4.1设置log等级
```java
FaceLogger.LOG_LEVEL = 0;//打印所有log
FaceLogger.LOG_LEVEL = 1;//打印error+warn+debug的log
FaceLogger.LOG_LEVEL = 2;//打印error+warn的log
FaceLogger.LOG_LEVEL = 3;//打印error的log
```
### 4.2识别结果log
```java
//当识别结果分数大于阈值时，打印识别的uuid和分数
FaceLogger.i(TAG, "------- recog result > targetScore-------- trackid:" + face.getTrackid() + " uuid:" + pairList.get(0).first + " score:" + pairList.get(0).second);
//当识别结果分数小于阈值时，打印识别的uuid和分数
FaceLogger.i(TAG, "------- recog result < targetScore-------- trackid:" + face.getTrackid() + " uuid:" + pairList.get(0).first + " score:" + pairList.get(0).second);
//当次识别没有识别结果时的打印log
FaceLogger.i(TAG, "--------------- pairList: null");
```
