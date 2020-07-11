# Glass（二代）软件开发文档

[![Build Status](https://travis-ci.org/RokidGlass/glass2-docs.svg?branch=master)](https://travis-ci.org/github/RokidGlass/glass2-docs)

## 介绍
-   本文档面向Rokid Glass的开发者，介绍了开发者如何在Rokid Glass上开发应用。   
-   本文档包含了系统信息，Rokid Glass SDK使用文档及示例。

## 系统信息说明
### 基本信息
|名称|简介|
|---|---|
| AP | amlogicS905D3|
| RAM |2G|
| ROM |32G|
| IMU |9轴，支持ROTATION_VECTOR|
| Camera |拍照最大分辨率3264x2448，录像1080p@30fps|
| 屏幕 | 分辨率1280x720，横屏，320dpi|
| 基于Android9.0 |开发工具AndroidStudio|
| 交互方式 |[触摸板、按键](1-system/index.md)、语音、头控|

## 简要开发指南
* Glass无touch screen，部分类型的控件需要自定义焦点控制。
* 有preview -> 无preview：真实世界不需要preview。
* 相机映射[alignment](2-sdk/5-ui-sdk/index.md#三、功能列表)：相机世界需要映射到真实世界。
* Glass风格的UI：参考UI设计规范和[UI SDK](2-sdk/5-ui-sdk/index.md)。
* 如果需要使用系统内置的AR录屏功能，并需要叠加Camera预览作为录屏背景，需注意：
	* App使用Camera API2接口；
	* 需要叠加Camera预览的Activity，开启时需发送广播``android.intent.action.CAMERA_WALLPAPER_START_PREVIE``
	* 结束时发送广播``android.intent.action.CAMERA_WALLPAPER_STOP_PREVIE``


## SDK简介
### 基础SDK
|名称|简介|
|---|---|
| [Glass UI](2-sdk/5-ui-sdk/index.md) | 提供一套在Rokid Glass上开发应用的基础UI库<br>真实世界和 Preview 之间的关系<br>|
| [语音识别](2-sdk/3-voice-sdk/index.md)| 离线语音|

### 业务SDK
|名称|简介|
|---|---|
| [人脸离线识别](2-sdk/1-face-sdk/index.md) | |
| [人脸在线识别](2-sdk/1-face-online-sdk/index.md)| |
| [车牌识别](2-sdk/2-lpr-sdk/index.md)| |
| [流媒体国标](2-sdk/6-gb28181-sdk/index.md)| |