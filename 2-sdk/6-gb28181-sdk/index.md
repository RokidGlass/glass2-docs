
# GB28181 SDK

## **Version：GB28181Engine 1.0.0**

## 接口使用示例demo
[Demo](https://github.com/RokidGlass/RokidGB28181Demo)


## 一. GB28181 SDK概述

Rokid GB28181SDK 提供SIP连接GB28181服务器加推送本地视频（YUV420P->H264->PS->RTP）流到远端服务器功能。


## 二. 集成说明

### 2.1 添加三方依赖库

- 总工程build.gradle配置：

  ```groovy
  allprojects {
      repositories {
          google()
          jcenter()
          maven { url 'http://mvnrepo.rokid-inc.com/nexus/content/groups/public/' }

      }
          // Snapshot 库时使用，强制取消缓存，并更新依赖库
      configurations.all {
          resolutionStrategy.cacheChangingModulesFor 1, 'seconds'
      }
  }
  ```

- app应用 module中build.gradle配置：

  ```groovy
  dependencies {
      implementation fileTree(dir: 'libs', include: ['*.jar'])
      implementation 'pub.devrel:easypermissions:1.0.1'
      implementation 'com.android.support:appcompat-v7:28.0.0'
      implementation 'com.rokid.glass:baselibrary:1.0.X-SNAPSHOT'
      implementation 'com.rokid.glass:sip:1.0.X-SNAPSHOT'
      implementation 'com.rokid.glass:gb28181lib:1.0.X-SNAPSHOT'
  }
  ```



### 2.2 需要如下权限
-   网络权限
-   相机权限
-   录音权限
    ```grovy
    private final String[] all_perms = {
            Manifest.permission.CAMERA,
            Manifest.permission.CHANGE_WIFI_STATE,
            Manifest.permission.WRITE_EXTERNAL_STORAGE,
            Manifest.permission.RECORD_AUDIO,
    }
    ```
## 三、接口说明及示例

### 3.1 GB28181 参数初始化
*   #### 3.1.1 SIP参数初始化

    **示例：**
    ```grovy
    mSipParam = new SipParam.Builder()
            .setLocalPort("5060")
            .setProtocol("UDP")
            .setServerID("34020000002000000001")
            .setDomain("34020000")
            .setServer("10.88.1.136")
            .setServerPort("5060")
            .setUserName("34020000001320000001")
            .setFromuser("34020000001320000001")
            .setPassword("")
            .setHeartbeat("60")
            .setMaxHeartbeatTimeout("3")
            .setValidofregistration("3600")
            .setWlan(true)
            .build();
    ```
    **参数说明：**

    | SIP参数 |  说明|
    | --- | --- |
    | localPort|本地SIP端口|
    | protocol|传输协议 |
    | serverID|sip 服务器ID |
    | domain|sip 服务器域 |
    | server|sip 服务器地址 |
    | serverPort|sip 服务器端口 |
    | userName|sip 用户名 |
    | fromUser|sip用户认证ID |
    | password|密码|
    | heartbeat|心跳周期 |
    | validOfRegistation|注册有效期 |
    | MaxHeartBeatTimeout|最大心跳超时次数 |
    | wlan|是否使用无线|



*   #### 3.1.12  媒体参数参数初始化
    **示例：**
    ```grovy
    mGBMediaParam =  new GBMediaParam.Builder()
        .setAudioBitRate(44100)
        .setAudioChannel(2)
        .setAudioChannelMode(AudioFormat.CHANNEL_IN_MONO)
        .setAudioFormat(AudioFormat.ENCODING_PCM_16BIT)
        .setAudioSampleRate(64000)
        .setVideoWidth(1280)
        .setVideoHeight(720)
        .setVideoBitRate(2*1000*1000)  //bps
        .setVideoFrameRate(15)
        .setVideoGOP(2)
        .build();

    ```
    **说明：**

    | 音视频参数 | 说明 |
    | --- | --- |
    |  audioBitRate|音频比特率 |
    |  audioChannel|音频声道数|
    |  audioChannelMode|音频模式|
    |  audioFormat|音频位宽|
    |  audioSampleRate|音频采样率 |
    |  videoWidth|视频长度 |
    |  videoHeight|视频宽度|
    |  videoBitRate|视频比特率|
    |  videoFrameRate|视频帧率|
    |  videoGOP|视频I帧间隔|

### 3.2 GB28181引擎操作


*   #### 3.2.1 创建GB28181引擎对象
    在Application的onCreate方法中创建引擎。
    **函数：**
    ```
    getInstance()
    ```
    **返回：**
        GB28181Engine 实例对象。

    **示例：**
    ```
    private GBMediaParam mGBMediaParam;
    ...
    ...
    mGB28181Engine = GB28281Engine.getInstance();
    ```


*   #### 3.2.2 GB28181 参数初始化

    **函数：**
    ```
    init(Context context, SipParam sipParam,GBMediaParam gbMediaParam)
    ```

    **参数说明：**

      参数|含义
    ------|----------
     context |  上下文context
     sipParam | GB28181 SIP参数
     gbMediaParam | GB28181 媒体参数
    **返回：**
    无

    **示例：**
    ```
    mGB28181Engine.init(mContext,mSipParam,mGBMediaParam);
    ```

*   #### 3.2.3 设置状态回调函数
    PS：sip状态变化会调用这个回调。
    **函数：**
    ```
    setSipStateCallback(Receiver.SipStateCallback callback)

    ```
    **参数说明：**

      参数|含义
    ------|----------
     context |  上下文context
     callback | 回调接口

    **返回：**
    无

    **示例：**
    ```
       mGB28181Engine.setSipStateCallback(new Receiver.SipStateCallback() {
            @Override
            public void changeStatus(Receiver.SipState state) {
                Logger.d("GB28181Engine","SipState" + state);
                switch (state){
                    case AVAILABLE:
                        //TODO
                        break;
                    case AWAY:
                        break;
                    case HOLD:
                        break;
                    case IN_CALL:
                        break;
                    case OFF_LINE:
                        break;
                    case IDLE:
                        break;
                    case UNKNOWN:
                    default:
                        Logger.d("GB28181Engine","unknow state");
                        break;
                }

            }
        });
    ```

*   #### 3.2.3 开始GB28181引擎
    **函数：**
    ```
    start()
    ```
    **返回：**
        无

    **示例：**
    ```
    mGB28181Engine.start();
    ```

*   #### 3.2.4 停止GB28181引擎
    **函数：**
    ```
    stop()
    ```
    **返回：**
    无

    **示例：**
    ```
    mGB28181Engine.stop();
    ```
