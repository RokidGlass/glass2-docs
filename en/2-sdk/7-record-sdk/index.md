# Record SDK

**Version：1.0.X-SNAPSHOT**

---


## A demo of how to use the APIs

https://github.com/RokidGlass/RokidRecordDemo

## 1. Overview of record SDK

Rokid Recordlib implements Camera recording, system screen recording, MIC recording, and system voice recording. It implements the callback output of screen recording data (H264) and audio data (AAC).

## 2. Description of integration

### 2.1 Adding 3rd party dependencies

- Configuring the general project build.gradle:
  
  ```groovy
  allprojects {
      repositories {
          google()
          jcenter()
      }
  }
  ```

- Configuring build.gradle in the module of the app:
  
  ```groovy
  dependencies {
      implementation fileTree(dir: 'libs', include: ['*.jar'])
      // Record SDK
      implementation 'com.rokid.glass:recordlib:1.0.X-SNAPSHOT'
  
  }
  ```

### 2.2 Permissions that are required

- Read and write permissions
    ```grovy
      <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
  ```
- Camera permissions
    ```grovy
      <uses-permission android:name="android.permission.CAMERA" />
  ```
- Recording permission
    ```grovy
      <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
      <uses-permission android:name="android.permission.RECORD_AUDIO" />
      <uses-permission android:name="android.permission.CAPTURE_AUDIO_OUTPUT" />
  ```

## 3. Notes and sample usages of the APIs

### 3.1 Get record instance

Note: Get a single instance of ScreenRecord.

```
public static Record getInstance();
```

### 3.2 Initialize audio

Note: Initialize MIC or system recording parameters

```
public void initAudio(Context context,AudioOrder audioOrder, DataListener listener)
```

| Parameter| Meaning
|----------|----------
| context| Current context
| audioOrder| Refer to 3.9 for audio configuration profile
| listener| Interface of audio data callback

### 3.3 Initialize video

Note: Initialize camera or screen recording parameters

```
public void initAudio(Context context,AudioOrder audioOrder, DataListener listener)
```

| Parameter| Meaning
|----------|----------
| context| Current context
| videoOrder| Refer to 3.10 for video configuration profile
| listener| Interface of video data callback

### 3.4 Start recording

Note: Start recording

```
public void start()
```

### 3.5 Stop recording

Note: Stop recording

```
public void stop()
```

### 3.6 Release resources

Note: Release resources

```
public void release()
```

### 3.7 Get recording status

Note: Get the current recording status.

```
public boolean isRunning()
```

return value: Type\|Meaning ----\|--- boolean\|Whether it is recording or not

### 3.8 Data callback interface

Note: Data callback interface

```
public interface DataListener {

    void onOutputBufferAvailable(byte[] data);

    void onOutputBufferAvailable(ByteBuffer data, MediaCodec.BufferInfo info);

    void onOutputFormatChanged(MediaFormat format);

}
```

#### 3.8.1 Raw data callback

Note: Not used temporarily. It can be used when obtaining PCM data or YUV data in the future

```
void onOutputBufferAvailable(byte[] data);
```

| Parameter| Meaning
|----------|----------
| data| Raw data obtained

#### 3.8.2 Data callback after encoding

Note: Data callback after encoding

```
void onOutputBufferAvailable(ByteBuffer data, MediaCodec.BufferInfo info);
```

| Parameter| Meaning
|----------|----------
| data| Obtained encoded data
| info| MediaCodec encoding information

#### 3.8.3 Callback for encoding status change

Note: This callback will be called when the encoder starts.

```
void onOutputFormatChanged(MediaFormat format);
```

| Parameter| Meaning
|----------|----------
| format| The format of the current encoder

### 3.9 AudioOrder builder example

```
 public class AudioOrder {
    final String mimeType;          // MediaCodec data encoding format
    final int source;               // data source
    final int bitRate;              // bit rate
    final int sampleRate;           // sample rate
    final int channelCount;         // number of channels
    final int channelFormat;        // left and right channels
    final int profile;              // coding level
    final int bitWidth;             // data bit width
    
    
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
        /*Can be configured as SUBMIX or MIC*/
        .source(MediaRecorder.AudioSource.REMOTE_SUBMIX)             
        .build();
```

### 3.10 VideoOrder builder example

```
public class VideoOrder {
    final int width;                         // width
    final int height;                        // height
    final int bitrate;                       // bit rate
    final int frameRate;                     // frame rate
    final int iFrameInterval;                // I frame interval
    final String mimeType;                   // encoding type
    final MediaCodecInfo.CodecProfileLevel codecProfileLevel; //coding level
    final VideoRecordType videoRecordType;   // data source 
    
    
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
        /*Configure to SCREEN_RECORD or CAMERA_RECORD*/
        .videoRecordType(CAMERA_RECORD)
        .build();

```

### 3.11 Recording switch of camera preview

Description: Whether to enable camera preview in the screen recording state or not

```
public void cameraPreviewTrigger(boolean flag)
```

| Parameter| Meaning
|----------|----------
| flag| Whether to enable camera preview recording or not, and it is only available when using screen recording.

