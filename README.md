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