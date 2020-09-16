# FAQ

---------

## 一、常见开发问题

* **Q: 开发眼镜上应用时，使用硬件h264编码失败？**
	A: 系统硬件mediacodec编码有size的限制，要求输入流的width必须为16的倍数，hight必须为2的倍数，否则编码将报错。如遇到硬件h264编码失败或崩溃，请检查输入流的size是否满足要求。


* **Q: 开发眼镜上应用时，为什么无法设置自动曝光补偿的亮度？**
	A: 当前提供了扩展的相机曝光模式，借用自动曝光补偿接口，应用可参考以下接口：
		
	```java
	方案一：Camera API1
	int aeCompMode; //0 全局曝光，1 下三角曝光
	Camera.Parameters parameters = mCamera.getParameters();
	parameters.setExposureCompensation(aeCompMode);
	mCamera.setParameters(parameters);

	方案二：Camera API2
	int aeCompMode; //0 全局曝光，1 下三角曝光
	mPreviewBuilder.set(CaptureRequest.CONTROL_AE_EXPOSURE_COMPENSATION, aeCompMode);
	```	

## 二、眼镜系统版本OTA升级方法:

### Step 1:信息查询
设置-->本机信息-->版本号、SN号，若版本号较低，则需要手动OTA升级	 
<img width="280" src="images/image001.png">

### Step 2:OTA升级步骤	 

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



