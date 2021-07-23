# FAQ

---------

## 一、常见开发问题

### **Q1: 开发眼镜上应用时，使用硬件h264编码失败？**

A: 系统硬件mediacodec编码有size的限制，要求输入流的width必须为16的倍数，hight必须为2的倍数，否则编码将报错。如遇到硬件h264编码失败或崩溃，请检查输入流的size是否满足要求。


### **Q2: 开发眼镜上应用时，如何在应用内完全禁用语音助手功能**

A: 请参考语音SDK使用说明[关闭全部语音指令说明](../2-sdk/3-voice-sdk/InstructSdk/InstructSdk.md### 2.7 关闭全部语音指令)


### **Q3: 应用获取眼镜传感器获取问题**
A: 由于系统硬件限制，默认支持 sensor list 如下，其中并不支持获取 raw data.

| sensor type       |  status    |
| ----------------------------------- | ---- |
| android.sensor.accelerometer | Fail |
| android.sensor.gyroscope            | Fail |
| android.sensor.magnetic_field       | Fail |
| android.sensor.game\_rotation\_vector | OK |
| android.sensor.rotation_vector      | OK |
| android.sensor.light                | OK |
| android.sensor.proximity            | OK |

	考虑到某些应用场景需要获取 raw data，我们提供刷机工具更新眼镜固件，以满足使用场景。更新后可以支持获取 raw data，但此时没有四元数数据。刷机工具可咨询工程师获取。

### **Q4: 4G网络不通，无法获取GPS？**
A: 序列号为082开头的设备，支持4G和GPS，081开头的设备，不支持4G和GPS；另外需注意，在主机通过调试口连接电脑时，4G和GPS将会断开，需要调试GSP或者4G功能时，需使用网络adb。

### **Q5: 录屏时录不到播放视频的画面？**
A: 如果使用SurfaceView播放视频，则录屏/投屏时是无法录到视频画面的，想要录屏/投屏捕捉到播放视频的画面，必须使用TextureView播放视频。

### **Q6: 眼镜系统是32位还是64位？**
A：眼镜系统是32位，如有第三方native库的依赖，必须提供arm-v7a的库。

### **Q7: 蓝牙搜索不到设备？**
A: 我们系统设置里的蓝牙功能，搜索时进行了设备类型的过滤，仅显示蓝牙耳机设备。如有配对其他蓝牙设备的需求，可自行开发蓝牙搜索配对功能。
## 二、Camera特性篇

### **Q1: 【glass2】camera对焦篇：系统版本1.5.3之后采用中心对焦方式？**

A：Camera固件采用中心对焦的方式，取中心九分之一做中心区域对焦。可以解决背景过大、前景过小的对焦不准问题。
经过系统级测试，改善了对焦速度、对焦精度和识别类应用的识别速度。这个不需要应用修改，默认支持。

### Q2: 【glass2】camera曝光篇：系统版本1.5.3之后支持多种曝光模式选择
A：目前支持全局曝光，下三角曝光和中心曝光三种方式，可以满足不同场景的需求。

  •  全局曝光：相机应用关注整体观感，可以采用全局曝光  
 
  •  下三角曝光：在部分逆光场景下，减少天空对曝光的影响可以采用下三角曝光
  
  •  中心曝光：二维码识别场景，中心有较亮的屏幕场景，使用中心曝光为宜。 应用接口如下：

```
方案一：Camera API1
	int aeCompMode; //0 全局曝光，1 下三角曝光，2 中心区域曝光
	Camera.Parameters parameters = mCamera.getParameters();
	parameters.setExposureCompensation(aeCompMode);
	mCamera.setParameters(parameters);

方案二：Camera API2
	int aeCompMode; //0 全局曝光，1 下三角曝光，2 中心区域曝光
	mPreviewBuilder.set(CaptureRequest.CONTROL_AE_EXPOSURE_COMPENSATION, aeCompMode);
```




### Q3: 【glass2】camera放大篇：系统版本1.5.3之后支持缩放模式
A：camera支持在1080和720P输出分辨率时候，可以支持多级放大模式。

• 放大模式：可以支持电子放大功能，可以增强图像的细节，对小物体和小图案的识别功能，有较大改善空间。
应用接口如下：

```
## Camera API1

Camera.Parameters parameters = mCamera.getParameters();

boolean isZoom = parameters.isZoomSupported();
int mMaxZoom = parameters.getMaxZoom();

if (isZoom && zoomLevel <= mMaxZoom) {
  parameters.setZoom(zoomLevel);
  mCamera.setParameters(parameters);
}
 
 
 
## Camera API2
Rect rect = mCameraCharacteristics.get(CameraCharacteristics.SENSOR_INFO_ACTIVE_ARRAY_SIZE);
float maxZoom = mCameraCharacteristics.get(CameraCharacteristics.SCALER_AVAILABLE_MAX_DIGITAL_ZOOM);
int zoomLevel = maxZoom;
float ratio = 1f / zoomLevel;
int croppedWidth = rect.width() - Math.round((float) rect.width() * ratio);
int croppedHeight = rect.height() - Math.round((float) rect.height() * ratio);

Rect mZoom = new Rect(croppedWidth / 2, croppedHeight / 2,
    rect.width() - croppedWidth / 2, rect.height() - croppedHeight / 2);
mPreviewRequestBuilder.set(CaptureRequest.SCALER_CROP_REGION,mZoom);
  
```




### Q4: 【glass2】camera对焦篇：系统支持自动对焦/定焦模式
A：camera默认定焦模式，可配置开启自动对焦使用。

• 自动对焦：默认定焦用于固定场景使用，自动定焦模式可动态调节清晰度。
应用接口如下：

```
## Camera API1

Camera.Parameters parameters = mCamera.getParameters();

// "auto" "fixed";
parameters.setFocusMode("auto");
mCamera.setParameters(parameters);
 
## Camera API2

mPreviewRequestBuilder.set(CaptureRequest.CONTROL_AF_MODE, CaptureRequest.CONTROL_AF_MODE_AUTO);
//或者
mPreviewRequestBuilder.set(CaptureRequest.CONTROL_AF_MODE, CaptureRequest.CONTROL_AF_MODE_CONTINUOUS_PICTURE);
  
```



## 三、眼镜系统版本OTA升级方法:

### Step 1: 信息查询
设置-->本机信息-->版本号、SN号，若版本号较低，则需要手动OTA升级	 
<img width="280" src="images/image001.png">

### Step 2: OTA升级步骤	 
设置-->系统升级-->检查更新	 
备注：	 
1. 如未检测到新版本，需找相关人员确认在SN是否在升级列表中；	 
2. 需保证充电状态或电量在 50%以上!	 
<img width="280" src="images/image002.png">

检测到新版本	 
<img width="280" src="images/image003.png">

点击“更新”开始下载	 
<img width="280" src="images/image004.png">

升级成功，重启后生效。 	 原来额外安装在眼镜端的应用，如物体识别、绘本识别不受影响。	 
<img width="280" src="images/image005.png">

## 四、Windows连接眼镜

### 概述

* 由于win7系统内置MTP设备驱动不能自动适配二代眼镜的Dock设备，因此如需在win7系统连接Dock进行文件管理，需要手动安装兼容MTP驱动后才可正常使用。
* 绝大部分win8和win10系统能够支持MTP驱动自动安装，如此Dock连接电脑后，等待驱动自动安装完毕，即可在“此电脑”中找到Glass设备。如自动安装出现问题，也可参考第二节“操作步骤”手动安装驱动。

### 操作步骤

1. 将二代眼镜的Dock通过USB线缆连接电脑，随后鼠标右键点击“计算机”，点击设备管理器（win7系统）：

    ![第1步](images2/1.png "第1步")

    ***注：此步骤截图为win7系统下，在win8和win10系统中，打开设备管理器需要右键点击“此电脑”，选择“管理”，并在弹出窗口左侧点选“系统工具”->“设备管理器”，右侧就会弹出“设备管理器”窗口，如下图：（后续的步骤2-13操作完全相同）***
    
    ![第1步](images2/2.png "第1步")

2. 此时弹出窗口内会看到：“其他设备”一栏中存在“MTP”设备，且有黄色叹号下标，说明眼镜设备已连接，但未成功识别：

    ![第2步](images2/3.png "第2步")

3. 鼠标在MTP菜单上点击右键，选择更新驱动程序软件：

    ![第3步](images2/4.png "第3步")

4. 在弹出界面点击选择“浏览计算机以查找驱动程序软件”，如下图红框所示：

    ![第4步](images2/5.png "第4步")

5. 在弹出的界面选择“从计算机的设备驱动程序列表中选择”，如下图红框所示：

    ![第5步](images2/6.png "第5步")

6. 拖动右侧导航按钮，找到便携设备，鼠标左键选中，然后点击“下一步”：

    ![第6步](images2/7.png "第6步")
    
7. 在弹出窗口左侧厂商栏，鼠标左键点选“标准MTP设备”，随后在右侧型号栏中鼠标左键点选“MTP USB设备”，然后点击“下一步”：

    ![第7步](images2/8.png "第7步")
    
8. 此时会弹出驱动兼容性警告，点击“是”按钮：

    ![第8步](images2/9.png "第8步")

9. 随后弹出安装进度条界面，等待片刻：

    ![第9步](images2/10.png "第9步")
    
10. 如果安装成功，则会弹出成功界面

    ![第10步](images2/11.png "第10步")
    
11. 此时设备管理器的异常MTP设备消失，出现“便携设备”，其下有“Glass”：

    ![第11步](images2/12.png "第11步")
    
12. 关闭设备管理器，点击进入“计算机”，可以看到多出一个名称为“Glass”的便携设备：

    ![第12步](images2/13.png "第12步")
    
13. 双击Glass设备进入，就可以和正常硬盘一样，进行文件读写等操作：

    ![第13步](images2/14.png "第13步")
    ![第13步](images2/15.png "第13步")
    
14. 在步骤9等待一段时间后，如果驱动安装失败，则会弹出如下界面，此时说明该系统内置驱动异常，请插拔Dock后重新操作1-9步骤。如果仍未安装成功，建议更换电脑使用，或联系技术支持人员进行协助。

    ![第14步](images2/16.png "第14步")


