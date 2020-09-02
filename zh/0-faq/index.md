# FAQ

---------

## 一、常见开发问题

* **Q: 开发眼镜上应用时，使用硬件h264编码失败？**

	A: 系统硬件mediacodec编码有size的限制，要求输入流的width必须为16的倍数，hight必须为2的倍数，否则编码将报错。如遇到硬件h264编码失败或崩溃，请检查输入流的size是否满足要求。


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



