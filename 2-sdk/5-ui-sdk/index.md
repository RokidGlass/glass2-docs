# Glass UI SDK
**Version: 1.5.6**

## 一、UI SDK介绍
---
### 1.1 概述
提供一套在Rokid Glass上开发应用的基础UI库,目前已经提供以下支持：  

**1. GlassButton**   
Glass自定义的Button    

**2. GlassDialog**   
提供了一系列常用的对话框

**3. 屏幕适配**   
屏幕适配方案，可以在Rokid Glass上保持UI统一按比例显示

**4. GlassAlignment**   
由于AR 眼镜特有的屏幕显示特性，在开发眼镜上的识别类应用时，     
需要对marked UI做一次align，以保证人眼看到的marked UI和真实世界对齐。

**5. IMU View **   
提供了一个可通过头控横向自动滚动的列表控件

## 二、集成说明
---
在project的build.gradle中添加jcenter依赖：
``` gradle
allprojects {
    repositories {
        google()
        jcenter()
    }
}
```
### 2.1 Gradle依赖
``` gradle
implementation 'com.rokid.glass:ui:1.5.6'
```

### 2.2 Demo下载
[Glass UI Demo](https://github.com/rokid/glass-ui)

## 三、功能列表
---

### 3.1 GlassButton
Glass自定义的Button

`Focused`:  

<img width="280" src="images/highlight_button.png">

`Normal`

<img width="280" src="images/normal_button.png">

#### 3.1.1 用法
``` xml
 <com.rokid.glass.ui.button.GlassButton
    android:id="@+id/custom_dialog_btn"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="Custom Dialog"
    app:layout_constraintLeft_toLeftOf="parent"
    app:layout_constraintRight_toRightOf="parent"
    app:layout_constraintTop_toBottomOf="@id/dialog_btn" />
```
### 3.2 GlassDialog
提供了一系列常用的对话框,通过不同Builder 来构建不同类型的对话框。
目前提供的Builder:
#### 3.2.1 CommonDialogBuilder
通用的 DialogBuilder

<img width="280" src="images/common_dialog.png">

|方法|含义|备注
|---|---|---|
|setTitle|设置标题||
|setContent|设置内容|和自定义内容布局选其一|
|setConfirmText|设置确定按钮文字||
|setCancelText|设置取消按钮文字||
|setContentLayoutId|设置内容自定义布局id||
|setContentLayoutView|设置内容自定义布局View|和setContentLayoutId选其一|
|setConfirmListener|设置Confirm监听||
|setCancelListener|设置Cancel监听||

**示例代码**
``` java
new GlassDialog.CommonDialogBuilder(this)
        .setTitle("Title")
        .setContent("Content")
        .setConfirmText("Confirm")
        .setCancelText("Cancel")
        .setContentLayoutId(R.layout.layout_custom_dialog_content)
        .setConfirmListener(new GlassDialogListener() {
            @Override
            public void onClick(View view) {

            }
        })
        .setCancelListener(new GlassDialogListener() {
            @Override
            public void onClick(View view) {

            }
        })
        .show();
```
### 3.3 屏幕适配
在app的`AndroidManifest.xml`声明：
``` java
<manifest>
    <application>            
        <meta-data
            android:name="design_width_in_dp"
            android:value="640"/>
        <meta-data
            android:name="design_height_in_dp"
            android:value="360"/>           
     </application>           
</manifest>
```
这里的都是根据设计图的尺寸来，以宽或者高为基准，默认是宽。
#### 模拟器Preview设置
<img width="500" src="images/preview.jpg">

### 3.4 GlassAlignment
* Alignment概念：
    * Camera预览界面通过Glass显示屏幕进入人眼睛的映射过程.

* 在手机上开发如下图：    

<img width="500" src="images/alignment_phone.png">

* 在眼镜上开发如下图：    

<img width="500" src="images/alignment_glass.png">

1. 蓝色代表`相机预览`的画面  
2. 绿色代表`相机预览`中物体的坐标   
3. 橙色代表`LCD屏幕`在`相机预览`的映射区域,百分比表示真实世界在虚拟世界的比例
4. 白色代表物体映射到`LCD屏幕`的显示区域

#### 3.4.1 getAlignmentRect
说明：根据preview的rect，获取到映射到LCD屏幕的区域
```java
public static Rect getAlignmentRect(final int previewWidth, final int previewHeight, final Rect previewRect)
```
|参数|含义|默认值
|---|---|---|
|previewWidth|Camera preview宽||
|previewHeight|Camera preview高||
|previewRect|Camera preview的Rect||

示例代码：人脸识别后，在屏幕上画出人脸Rect   
``` java
public static final int PREVIEW_WIDTH = 1280;
public static final int PREVIEW_HEIGHT = 720;

//camera preview的人脸区域
Rect previewRect = faceDoCache.faceDo.toRect(getWidth(), getHeight());

//根据preview的人脸Rect，映射后，获取最终在屏幕上绘制的Rect
Rect rect = RokidSystem.getAlignmentRect(PREVIEW_WIDTH, PREVIEW_HEIGHT,previewRect);

...
//根据
canvas.save();
canvas.translate((rect.left + rect.right) / 2f, (rect.top + rect.bottom) / 2f);

drawRect(canvas, 0, rect.width(), rect.height(), paint, rectConfig);
drawRect2(canvas, 0, rect.width(), rect.height(), paint, rectConfig);
drawRect(canvas, 180, rect.width(), rect.height(), paint, rectConfig);
drawRect2(canvas, 180, rect.width(), rect.height(), paint, rectConfig);

canvas.restore();
...
```
#### 3.4.2 getWindowRect
说明：根据LCD屏幕的rect，获取到preview的区域rect
``` java
public static Rect getWindowRect(final int previewWidth, final int previewHeight, final Rect windowRect)
```
|参数|含义|默认值
|---|---|---|
|previewWidth|Camera preview宽||
|previewHeight|Camera preview高||
|windowRect|屏幕上的Rect||

示例代码: 根据屏幕上的roi区域，得到preview 上的roi区域
```java
Rect window = new Rect(0,0,1280,720);
roiRect = RokidSystem.getWindowRect2K(CameraParams.PREVIEW_WIDTH,CameraParams.PREVIEW_HEIGHT, window);
roiRect = FaceRectUtils.scaleRect(roiRect, CameraParams.PREVIEW_WIDTH,CameraParams.PREVIEW_HEIGHT, FaceParams.roiScale);
...

VideoDFaceConf config = new VideoDFaceConf();
config.setDataType(DataFormat.DATA_YUV420);
config.setSize(CameraParams.PREVIEW_WIDTH, CameraParams.PREVIEW_HEIGHT);
config.setRoi(roiRect);

```

#### 3.4.3 getProjectionMatrix_OpticalSeeThrough
说明：获取OpticalSeeThrough场景下，OpenGLES 3D 应用的投影矩阵（横屏状态），以便人眼看到的marked UI和真实世界对齐
``` java
public static float[] getProjectionMatrix_OpticalSeeThrough()
```

示例代码: 对于横屏应用，获取OpenGLES MVP矩阵的投影矩阵
```java
float projectionMatrix[] = RokidSystem.getProjectionMatrix_OpticalSeeThrough();
...

```

### 3.5 IMU View

#### 3.5.1 使用示例

<img width="400" src="images/imuview_simple.png">

#### 3.5.2 使用方法



```java
在Application中进行初始化：
IMUSdk.init(this);
具体使用：
getLifecycle().addObserver(mImuView);//生命周期绑定
mImuView.setSlow();//默认是快滑模式，设置此处可设置为慢滑模式
mImuView.setAdapter(mAdapter);
```

``` xml
<com.rokid.glass.imusdk.core.IMUView
        android:id="@+id/ui_recycler_view"
        imulabmarginleft="10"
        imulabmargintop="10"
        imutouchstyle="true"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        app:imuscale="1.1"
        app:imutouchstyle="true" />

```

|属性配置|含义|
|---|---|
|imuscale|配置选中Item的缩放比例|
|imupadding|配置item内填充的间距，用于预留缩放空间|
|imuspeed|配置匀速滑动模式的滑动速度|
|imuguide|配置是否显示顶部导航栏|
|imuunable|默认为false，设置为true将屏蔽imu头控功能|
|imutitlewidth|配置默认显示模板title的宽度|
|imulabmarginleft|配置左上角位置提示lab距离左边界的距离|
|imulabmargintop|配置左上角位置提示lab距离上边界的距离|
|imutouchstyle|提供两种滑动模式  true：模拟touch滑动模式 false：匀速滑动模式|
|imutouchinterval|配置模拟touch滑动模式的滑动速度|

```xml
<declare-styleable name="imuview">
    <attr name="imuscale" format="float"/>
    <attr name="imupadding" format="dimension" />
    <attr name="imuspeed" format="integer" />
    <attr name="imuguide" format="boolean" />
    <attr name="imuunable" format="boolean" />
    <attr name="imutitlewidth" format="dimension" />
    <attr name="imulabmarginleft" format="dimension" />
    <attr name="imulabmargintop" format="dimension" />
    <attr name="imutouchstyle" format="boolean" />
    <attr name="imutouchinterval" format="dimension" />
</declare-styleable>
```

#### 3.5.3 滑动模式选择

配置方式：通过imutouchstyle属性配置。
匀速滑动模式：列表进行匀速滑动，每个item不会有停顿效果，多用于内容多比较快速的滚动，类似图库。
模拟touch滑动模式：模拟手动touch滑动的效果，经过每个item会有停顿的效果，便于用户看清，是默认的滑动模式。

#### 3.5.4 自定义头控相关功能

可以注册SensorManager.getDefaultSensor(Sensor.TYPE_GAME_ROTATION_VECTOR)的旋转矢量传感器类型，在onSensorChanged(SensorEvent event)回调中获取实时的方位信息，根据其每次回调内容的差值判断当前头控的状态做对应的处理。