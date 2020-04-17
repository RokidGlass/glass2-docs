
# ScreenRecord SDK

**Version：1.0.X-SNAPSHOT**

---
## 接口使用示例demo

https://github.com/RokidGlass/ScreenRecordDemo

## 一. ScreenRecord SDK概述

Rokid ScreenRecordLib 是实现了录制系统屏幕和系统声音的库。实现录屏数据（H264）+ 音频数据（AAC）回调输出。


## 二. 集成说明

### 2.1 添加三方依赖库

- 总工程build.gradle配置：

  ```groovy
  allprojects {
      repositories {
          google()
          jcenter()
          maven { url 'http://mvnrepo.rokid-inc.com/nexus/content/groups/public/' }
          maven { url "http://mvnrepo.rokid-inc.com/nexus/content/repositories/releases/"}
      }
  }
  ```
  
- app应用 module中build.gradle配置：

  ```groovy
  dependencies {
      implementation fileTree(dir: 'libs', include: ['*.jar'])
      // ScreenRecord SDK
      implementation 'com.rokid.glass:screenrecordlib:1.0.X-SNAPSHOT'

  }
  ```


### 2.2 需要如下权限
-   读写权限
    ```grovy
        <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    ```
-   网络权限
    ```grovy
        <uses-permission android:name="android.permission.INTERNET"/>
    ```
-   相机权限
    ```grovy
        <uses-permission android:name="android.permission.CAMERA" />
    ```
-   录音权限
    ```grovy
        <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
        <uses-permission android:name="android.permission.RECORD_AUDIO" />
        <uses-permission android:name="android.permission.CAPTURE_AUDIO_OUTPUT" />
    ```

## 三、接口说明及示例

### 3.1  ScreenRecord.getInstancec()
*   获取ScreenRecord单例。
   
### 3.2 ScreenRecord.init()
*   ScreenRecord初始化
  
### 3.3 ScreenRecord.setAudioCallback(MediaEncoder.DataCallback callback)
*   设置音频回调函数（必须实现）

### 3.4 ScreenRecord.setVideoCallback(MediaEncoder.DataCallback callback)
*   设置视频回调函数（必须实现）

### 3.5 ScreenRecord.cameraTrigger(boolean flag)
*   是否需要开始camera preview录制

### 3.6 ScreenRecord.start()
*   开始录制

### 3.7 ScreenRecord.stop()
*   停止录制

