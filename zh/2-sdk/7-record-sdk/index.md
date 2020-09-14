
# Record SDK

**Version：1.0.X-SNAPSHOT**

---
## 接口使用示例demo

https://github.com/RokidGlass/RokidRecordDemo

## 一. Record SDK概述

Rokid Recordlib 实现了Camera录制，系统录屏，MIC 录制，系统声音录制。实现录屏数据（H264）+ 音频数据（AAC）回调输出。


## 二. 集成说明

### 2.1 添加三方依赖库

- 总工程build.gradle配置：

  ```groovy
  allprojects {
      repositories {
          google()
          jcenter()
      }
  }
  ```
  
- app应用 module中build.gradle配置：

  ```groovy
  dependencies {
      implementation fileTree(dir: 'libs', include: ['*.jar'])
      // Record SDK
      implementation 'com.rokid.glass:recordlib:1.0.X-SNAPSHOT'

  }
  ```


### 2.2 需要如下权限
-   读写权限
    ```grovy
        <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
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

### 3.1 获取record实例  
说明：获取ScreenRecord单例。
```
public static Record getInstance();
```


### 3.2 初始化音频
说明：初始化MIC或者系统录制参数
```
public void initAudio(Context context,AudioOrder audioOrder, DataListener listener)
```


参数|含义
----|---
context|当前上下文
audioOrder|音频配置文件 参考3.9
listener|音频数据回调接口
  
### 3.3 初始化视频
说明：初始化摄像头或者屏幕录制参数
```
public void initAudio(Context context,AudioOrder audioOrder, DataListener listener)
```
参数|含义
----|---
context|当前上下文
videoOrder|视频配置文件 参考3.10
listener|视频数据回调接口

### 3.4 开始录制
说明：开始录制
```
public void start()
```

### 3.5 停止录制
说明：停止录制
```
public void stop()
```

### 3.6 释放资源
说明：释放资源

```
public void release()
```

### 3.7 获取录制状态
说明：获取当前是否正在录制状态。

```
public boolean isRunning()
```
返回值：
类型|含义
----|---
boolean|是否在录制状态

### 3.8 数据回调接口
说明：数据回调接口

```
public interface DataListener {

    void onOutputBufferAvailable(byte[] data);

    void onOutputBufferAvailable(ByteBuffer data, MediaCodec.BufferInfo info);

    void onOutputFormatChanged(MediaFormat format);

}
```

#### 3.8.1 原始数据回调
说明：暂时没有用到。以后获取PCM数据或者YUV数据时候可以用
```
void onOutputBufferAvailable(byte[] data);
```

参数|含义
----|---
 data|获取到的原始数据

#### 3.8.2 编码后数据回调
说明：编码后的数据回调
```
void onOutputBufferAvailable(ByteBuffer data, MediaCodec.BufferInfo info);
```

参数|含义
----|---
 data|获取到的编码数据
 info|MediaCodec 的编码信息
 
#### 3.8.3 编码状态改变回调
说明：编码器开始时候会调用此回调。
```
void onOutputFormatChanged(MediaFormat format);
```

参数|含义
----|---
 format |当前编码器的格式
 
 
 ### 3.9 AudioOrder builder示例
```
 public class AudioOrder {
    final String mimeType;          // MediaCodec 数据编码格式
    final int source;               // 数据来源
    final int bitRate;              // 比特率
    final int sampleRate;           // 采样率
    final int channelCount;         // 通道数
    final int channelFormat;        // 左右声道
    final int profile;              // 编码等级
    final int bitWidth;             // 数据位宽
    
    
    ...
    ...
}
```

```
mAudioOrder = new AudioOrder.Builder(MIMETYPE_AUDIO_AAC)
        .channelFormat(AudioFormat.CHANNEL_IN_STEREO)
        .sampleRate(44100)
        .bitWidth(AudioFormat.ENCODING_PCM_16BIT;)
        .bitRate(64000)
        .channelCount(2)
        .profile(MediaCodecInfo.CodecProfileLevel.AACObjectLC)
        /*可配置成SUBMIX或者MIC*/
        .source(MediaRecorder.AudioSource.REMOTE_SUBMIX)             
        .build();
```



### 3.10 VideoOrder builder示例

```
public class VideoOrder {
    final int width;                         // 宽
    final int height;                        // 高
    final int bitrate;                       // 比特率
    final int frameRate;                     // 帧率
    final int iFrameInterval;                // I帧间隔
    final String mimeType;                   // 编码类型
    final MediaCodecInfo.CodecProfileLevel codecProfileLevel; //编码等级
    final VideoRecordType videoRecordType;   // 数据来源 
    
    
    ...
    ...
}
```

```

mVideoOrder = new VideoOrder.Builder(MIMETYPE_VIDEO_AVC)
        .width(1280)
        .height(720)
        .bitrate(2*1024*1024)   //bps
        .frameRate(30)
        .iFrameInterval(2)
        /*配置成SCREEN_RECORD 或者 CAMERA_RECORD*/
        .videoRecordType(CAMERA_RECORD)
        .build();

```


### 3.11 Camera Preview 录制开关
说明：录屏状态下是否开启 CameraPreview
```
public void cameraPreviewTrigger(boolean flag)
```
参数|含义
----|---
 flag |是否开启Camera Preview录制 只在录屏下有用
