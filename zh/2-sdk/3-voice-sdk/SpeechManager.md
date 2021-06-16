### 一、概述
#### Rokid 在线语音识别服务
语音助手通过对接Rokid云平台，实现在线语音识别服务，为开发者提供语音ASR识别、TTS在线语音合成功能。

语音ASR识别可以通过用户说出的定向音频流识别出对应的文字，并自动判断声音结束，返回云平台优化过的ASR文字内容。

TTS在线语音合成可以根据开发者提供的文字合成高质量的音频，并以当前音量直接播放。

语音指令插件通过内部的SpeechUseManager来提供对语音助手内语音ASR识别、TTS在线语音合成功能的正常使用。

### 1.1 使用时注意事项

- 语音助手RokidAiSdk需要v2.7.1版本及以上；
- 语音指令插件（InstructSdk）需要1.6.0版本及以上；

## 二. 集成说明

### 2.1 添加三方依赖库

- 总工程build.gradle配置：

  ```groovy
  allprojects {
      repositories {
          google()
          maven {url('https://maven.rokid.com/repository/maven-public/')}
          jcenter()
      }
  }
  ```
  
- app应用 module中build.gradle配置：

  ```groovy
  dependencies {
      implementation fileTree(dir: 'libs', include: ['*.jar'])
      // 语音指令SDK
      implementation 'com.rokid.ai.glass:instructsdk:1.6.1'
  }
  ```
- Rokid Maven信息

  ```xml
  <dependency>
    <groupId>com.rokid.ai.glass</groupId>
    <artifactId>instructsdk</artifactId>
    <version>1.6.1</version>
    <type>pom</type>
  </dependency>
  ```

### 2.2 SpeechUserManager的初始化、回收

说明：SpeechUserManager作为使用在线asr、tts的主要工具类，需要正确的初始化和回收，以防止使用报错和内存泄露。

  ```java 
  /**
  * SpeechUserManager 初始化函数
  * @param context Context 实例
  * @param immediatelyBind true：SpeechUserManager初始化时立即绑定语音助手中Speech服务，
  * false：SpeechUserManager初始化不绑定语音助手中Speech服务，在后续asr、tts使用之前再进行服务绑定；
  */
   public SpeechUserManager(Context context, boolean immediatelyBind)


   /**
   * 回收，必须调用
   */
  public void onDestroy()
  ```

### 2.3 通过SpeechUserManager使用在线asr功能

说明：SpeechUserManager的doSpeechAsr()方法可以调用语音助手的在线asr功能，AsrCallBack作为结果的回调处理。

  ```java 

    public void callSpeechAsr() {
        if (mSpeechManager != null) {
            mSpeechManager.doSpeechAsr(mAsrCallBack);
        }
    }

    private AsrCallBack mAsrCallBack = new AsrCallBack() {
        @Override
        public void onStart(int id) throws RemoteException {
            Log.d(TAG, "AsrCallBack onStart id = " + id);
        }

        @Override
        public void onIntermediateResult(int id, String asr, String extra) throws RemoteException {
            Log.d(TAG, "AsrCallBack onIntermediateResult id = " + id+ ", asr = " + asr + ", extra = " + extra);
        }

        @Override
        public void onAsrComplete(int id, String asr) throws RemoteException {
            Log.d(TAG, "AsrCallBack onAsrComplete id = " + id + ", asr = " + asr);
        }

        @Override
        public void onComplete(int id, String nlp, String action) throws RemoteException {
            Log.d(TAG, "AsrCallBack onComplete id = " + id + ", nlp = " + nlp + ", action = " + action);
        }

        @Override
        public void onCancel(int id) throws RemoteException {
            Log.d(TAG, "AsrCallBack onCancel id = " + id);
        }

        @Override
        public void onError(int id, int err) throws RemoteException {
            Log.d(TAG, "AsrCallBack onError id = " + id);
        }
    };

  ```

### 2.4 通过SpeechUserManager使用在线tts功能

说明：SpeechUserManager的doSpeechTts()方法可以调用语音助手的在线tts功能，TtsCallBack作为结果的回调处理。

  ```java 

    public void callSpeechAsr() {
        if (mSpeechManager != null) {
            mSpeechManager.doSpeechTts("乌龙茶饮料很好喝", mTtsCallBack);
        }
    }

    private TtsCallBack mTtsCallBack = new TtsCallBack() {
        @Override
        public void onStart(int id) throws RemoteException {
            Log.d(TAG, "TtsCallBack onStart id = " + id);
        }

        @Override
        public void onVoicePlay(int id, String text) throws RemoteException {
            Log.d(TAG, "TtsCallBack onVoicePlay id = " + id);
        }

        @Override
        public void onCancel(int id) throws RemoteException {
            Log.d(TAG, "TtsCallBack onCancel id = " + id);
        }

        @Override
        public void onComplete(int id) throws RemoteException {
            Log.d(TAG, "TtsCallBack onComplete id = " + id);
        }

        @Override
        public void onError(int id, int err) throws RemoteException {
            Log.d(TAG, "TtsCallBack onError id = " + id);
        }
    };

  ```


## 三、API 参考
### 3.1 SpeechUserManager
#### 1）初始化

**接口说明**

SpeechUserManager初始化

**方法预览**

| 返回类型 | 方法                            | 备注                     |
| -------- | ------------------------------- | ------------------------ |
| void     | SpeechUserManager(Context context, boolean immediatelyBind) | SpeechUserManager初始化 |

**参数说明**

| 字段    | 类型           | 必须？ | 描述                             |
| ------- | -------------- | ------ | -------------------------------- |
| context | Context | 必须   | 如果当成全局功能，希望使用Application级别 |
| immediatelyBind | boolean | 必须   | true，立即进行绑定，false，功能使用前再绑定 |


#### 2）SpeechUserManager 回收

**接口说明**

SpeechUserManager 回收

**方法预览**

| 返回类型 | 方法      | 备注           |
| -------- | --------- | -------------- |
| void     | onDestroy() | SpeechUserManager 回收 |


#### 3）在线ASR识别

**接口说明**

Rokid 语音识别服务根据用户所说的声音数据，返回对应文字内容

**方法预览**

| 返回类型 | 方法    | 备注                                                  |
| -------- | ------- | ----------------------------------------------------- |
| void     | doSpeechAsr | 发起在线ASR识别，AsrCallBack 作为回调实体 |

**参数说明**

| 字段    | 类型           | 必须？ | 描述                 |
| -------- | -------------- | ------------------ | ---- |
| callBack | AsrCallBack | 必须   | 结果回调 |



#### 4）取消在线ASR识别

**接口说明**

当用户调用了doSpeechAsr请求之后，如果想取消语音识别，可调用此方法

**方法预览**

| 返回类型 | 方法           | 备注                 |
| -------- | -------------- | -------------------- |
| void     | cancelAsr(int id) | 取消指定的doSpeechAsr请求 |

**参数说明**

| 字段 | 类型 | 必须？ | 描述      |
| ---- | ---- | ------ | --------- |
| id   | int  | 是     | AsrCallBack中返回的 id |

**示例代码**

```java
mSpeechUserManager.cancel(asrId);
```

#### 5）在线TTS语音合成

**接口说明**

Rokid 语音语音合成根据用户的文字内容，转换成声音数据，以设备当前音量进行播放

**方法预览**

| 返回类型 | 方法    | 备注                                         |
| -------- | ------- | ------------------------------------------- |
| void     | doSpeechTts | 发起在线tts合成播放，TtsCallBack 作为回调实体 |

**参数说明**

| 字段    | 类型           | 必须？ | 描述                 |
| -------- | -------------- | ------------------ | ---- |
| tts | String | 必须   | 文字内容 |
| callBack | TtsCallBack | 可选   | 结果回调 |



#### 6）取消在线TTS语音合成

**接口说明**

当用户调用了doSpeechTts请求之后，如果想取消tts功能，可调用此方法

**方法预览**

| 返回类型 | 方法           | 备注                 | 
| -------- | -------------- | -------------------- |
| void     | cancelTts(int id) | 取消指定的doSpeechTts请求 |

**参数说明**

| 字段 | 类型 | 必须？ | 描述      |
| ---- | ---- | ------ | --------- |
| id   | int  | 是     | TtsCallBack中返回的 id |

**示例代码**

```java
mSpeechUserManager.cancelTts(ttsId);
```

### 3.2 AsrCallBack

语音asr服务回调实体

**方法预览**

| 返回类型 | 方法                                                         | 备注                       |
| -------- | ------------------------------------------------------------ | ----------------------- |
| void     | onStart(int id)                                              | asr开始拾音         |
| void     | onIntermediateResult(int id, String asr, String extra)       | asr中间结果，识别中实时返回 |
| void     | onAsrComplete(int id, String asr)                            | asr完整结果         |
| void     | onComplete(int id, String nlp, String action)                | speech最终结果（保留方法）|
| void     | onCancel(int id)                                             | asr被取消              |
| void     | onError(int id, int err)                                     | asr出错                |

**onStart(int id)**

**方式说明**

通知开发者，asr开始拾音。

**参数说明**

| 字段 | 类型 | 描述                |
| ---- | ---- | ------------------- |
| id   | int  | 当前asr 请求的id |

**onIntermediateResult(int id, String asr, String extra)**

**方法说明**

持续返回当前语音识别出的文字

**参数说明**

| 字段        | 类型   | 描述               |
| ----------- | ------ | ------------------ |
| id          | int    | asr id          |
| asr   | String | 语音转文字中间结果 |
| extra | String | 激活结果         |

**onAsrComplete(int id, String asr)**

**方法说明**

语音asr识别后返回完整的asr识别结果

**参数说明**

| 字段      | 类型   | 描述                |
| --------- | ------ | ------------------- |
| id        | int    | 当前Speech 请求的id |
| asr       | String | 语音转文字完整结果  |

**onComplete(int id, String nlp, String action)**

**方法说明**

根据识别结果返回Rokid 云平台上的skill信息

**参数说明**

| 字段      | 类型   | 描述                         |
| --------- | ------ | ---------------------------- |
| id        | int    | 当前Speech 请求的id          |
| nlp       | String | 自然语义解析结果             |
| action    | String | rokid speech skill返回的结果 |

**onCancel(int id)**

**方法说明**

语音是被取消

**参数说明**

| 字段 | 类型 | 描述                |
| ---- | ---- | ------------------- |
| id   | int  | 当前Speech 请求的id |

**onError(int id, int err)**

**方法说明**

语音识别发生错误

**参数说明**

| 字段    | 类型 | 描述                |
| ------- | ---- | ------------------- |
| id      | int  | 当前asr 请求的id |
| err     | int  | 错误码              |



### 3.3 TtsCallBack

语音tts服务回调实体

**方法预览**

| 返回类型 | 方法                        | 备注                       |
| -------- | --------------------------- | ----------------------- |
| void     | onStart(int id)              | 开始接收语音数据流并播放    |
| void     | onVoicePlay(int id, String text)  | 播放中，给出当前已经转成语音的文字 |
| void     | onCancel(int id)            | tts任务已经取消            |
| void     | onComplete(int id)          | tts任务结束，播放完成       |
| void     | onError(int id, int err)    | tts任务文字转语音出错       |

**onStart(int id)**

**参数说明**

| 字段 | 类型 | 描述                                       |
| ---- | ---- | ------------------------------------------ |
| id    | int  | 开始接收语音数据流并播放,TTS Speak返回的id |

**onVoicePlay(int id, String text)**

| 字段 | 类型   | 描述                   |
| ---- | ------ | ---------------------- |
| id    | int    | TTS Speak返回的id      |
| text    | String | 当前已经转成语音的文字 |


**onCancel(int id)**

| 字段 | 类型 | 描述              |
| ---- | ---- | ----------------- |
| id    | int  | TTS Speak返回的id |

**onComplete(int id)**

| 字段 | 类型 | 描述              |
| ---- | ---- | ----------------- |
| id    | int  | TTS Speak返回的id |

**onError(int id, int err)**

| 字段 | 类型 | 描述              |
| ---- | ---- | ----------------- |
| id   | int  | TTS Speak返回的id |
| err   | int  | 错误码            |

