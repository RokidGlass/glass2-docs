# Glass UI SDK
**Version: 1.5.4**

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

**5. IMU View （to be released）**
头控接口

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
implementation 'com.rokid.glass:ui:1.5.4'
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
Alignment概念：
Camera预览界面通过Glass显示屏幕进入人眼睛的映射过程.

在手机上开发如下图：
<img width="500" src="images/alignment_phone.png">

在眼镜上开发如下图：
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

