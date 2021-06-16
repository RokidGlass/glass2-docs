### 1. Overview
#### Rokid online speech recognition service
The voice assistant realizes online voice recognition services by connecting to the Rokid cloud platform, and provides developers with voice ASR recognition and TTS online voice synthesis functions.

Voice ASR recognition can recognize the corresponding text through the directional audio stream spoken by the user, automatically determine the end of the voice, and return to the ASR text content optimized by the cloud platform.

TTS online speech synthesis can synthesize high-quality audio according to the text provided by the developer, and play it directly at the current volume.

The voice command plug-in provides the normal use of the voice ASR recognition and TTS online voice synthesis functions in the voice assistant through the internal SpeechUseManager.

### 1.1 Precautions when using

-Voice assistant RokidAiSdk requires v2.7.1 and above;
-Voice command plug-in (InstructSdk) requires version 1.6.0 and above;

## 2. Integration Instructions

### 2.1 Add a third-party dependency library

-Total project build.gradle configuration:

  ```groovy
  allprojects {
      repositories {
          google()
          maven {url('https://maven.rokid.com/repository/maven-public/')}
          jcenter()
      }
  }
  ```
  
-Build.gradle configuration in app application module:

  ```groovy
  dependencies {
      implementation fileTree(dir:'libs', include: ['*.jar'])
      // Voice Command SDK
      implementation'com.rokid.ai.glass:instructsdk:1.6.1'
  }
  ```
-Rokid Maven information

  ```xml
  <dependency>
    <groupId>com.rokid.ai.glass</groupId>
    <artifactId>instructsdk</artifactId>
    <version>1.6.1</version>
    <type>pom</type>
  </dependency>
  ```

### 2.2 Initialization and recycling of SpeechUserManager

Note: SpeechUserManager, as the main tool class for using online asr and tts, needs to be initialized and recycled correctly to prevent usage errors and memory leaks.

  ```java
  /**
  * SpeechUserManager initialization function
  * @param context Context instance
  * @param immediatelyBind true: When the SpeechUserManager is initialized, the Speech service in the voice assistant is immediately bound,
  * false: SpeechUserManager initialization does not bind the Speech service in the voice assistant, and the service binding is performed before the subsequent use of asr and tts;
  */
   public SpeechUserManager(Context context, boolean immediatelyBind)


   /**
   * Recycling, must be called
   */
  public void onDestroy()
  ```

### 2.3 Use the online asr function through SpeechUserManager

Description: The doSpeechAsr() method of SpeechUserManager can call the online asr function of the voice assistant, and AsrCallBack is used as the result of the callback processing.

  ```java

    public void callSpeechAsr() {
        if (mSpeechManager != null) {
            mSpeechManager.doSpeechAsr(mAsrCallBack);
        }
    }

    private AsrCallBack mAsrCallBack = new AsrCallBack() {
        @Override
        public void onStart(int id) throws RemoteException {
            Log.d(TAG, "AsrCallBack onStart id = "+ id);
        }

        @Override
        public void onIntermediateResult(int id, String asr, String extra) throws RemoteException {
            Log.d(TAG, "AsrCallBack onIntermediateResult id = "+ id+ ", asr =" + asr + ", extra = "+ extra);
        }

        @Override
        public void onAsrComplete(int id, String asr) throws RemoteException {
            Log.d(TAG, "AsrCallBack onAsrComplete id = "+ id + ", asr =" + asr);
        }

        @Override
        public void onComplete(int id, String nlp, String action) throws RemoteException {
            Log.d(TAG, "AsrCallBack onComplete id = "+ id + ", nlp =" + nlp + ", action = "+ action);
        }

        @Override
        public void onCancel(int id) throws RemoteException {
            Log.d(TAG, "AsrCallBack onCancel id = "+ id);
        }

        @Override
        public void onError(int id, int err) throws RemoteException {
            Log.d(TAG, "AsrCallBack onError id = "+ id);
        }
    };

  ```

### 2.4 Use the online tts function through SpeechUserManager

Description: The doSpeechTts() method of SpeechUserManager can call the online tts function of the voice assistant, and TtsCallBack is used as the result of the callback processing.

  ```java

    public void callSpeechAsr() {
        if (mSpeechManager != null) {
            mSpeechManager.doSpeechTts("Oolong tea drink is delicious", mTtsCallBack);
        }
    }

    private TtsCallBack mTtsCallBack = new TtsCallBack() {
        @Override
        public void onStart(int id) throws RemoteException {
            Log.d(TAG, "TtsCallBack onStart id = "+ id);
        }

        @Override
        public void onVoicePlay(int id, String text) throws RemoteException {
            Log.d(TAG, "TtsCallBack onVoicePlay id = "+ id);
        }

        @Override
        public void onCancel(int id) throws RemoteException {
            Log.d(TAG, "TtsCallBack onCancel id = "+ id);
        }

        @Override
        public void onComplete(int id) throws RemoteException {
            Log.d(TAG, "TtsCallBack onComplete id = "+ id);
        }

        @Override
        public void onError(int id, int err) throws RemoteException {
            Log.d(TAG, "TtsCallBack onError id = "+ id);
        }
    };

  ```


## 3. API reference
### 3.1 SpeechUserManager
#### 1) Initialization

**Interface Description**

SpeechUserManager initialization

**Method Preview**

| Return Type | Method | Remarks |
| -------- | ------------------------------- | -------- ---------------- |
| void | SpeechUserManager(Context context, boolean immediatelyBind) | SpeechUserManager initialization |

**Parameter Description**

| Field | Type | Required? | Description |
| ------- | -------------- | ------ | ------------------- ------------- |
| context | Context | Required | If treated as a global function, hope to use the Application level |
| immediatelyBind | boolean | Required | true, bind immediately, false, bind before the function is used |


#### 2) SpeechUserManager recycling

**Interface Description**

SpeechUserManager recycling

**Method Preview**

| Return Type | Method | Remarks |
| -------- | --------- | -------------- |
| void | onDestroy() | SpeechUserManager recycling |


#### 3) Online ASR recognition

**Interface Description**

Rokid speech recognition service returns the corresponding text content based on the voice data spoken by the user

**Method Preview**

| Return Type | Method | Remarks |
| -------- | ------- | -------------------------------- --------------------- |
| void | doSpeechAsr | Initiate online ASR recognition, with AsrCallBack as the callback entity |

**Parameter Description**

| Field | Type | Required? | Description |
| -------- | -------------- | ------------------ | ---- |
| callBack | AsrCallBack | Required | Result Callback |



#### 4) Cancel online ASR recognition

**Interface Description**

After the user calls the doSpeechAsr request, if you want to cancel the speech recognition, you can call this method

**Method Preview**

| Return Type | Method | Remarks |
| -------- | -------------- | -------------------- |
| void | cancelAsr(int id) | Cancel the specified doSpeechAsr request |

**Parameter Description**

| Field | Type | Required? | Description |
| ---- | ---- | ------ | --------- |
| id | int | yes | id returned in AsrCallBack |

**Sample Code**

```java
mSpeechUserManager.cancel(asrId);
```

#### 5) Online TTS speech synthesis

**Interface Description**

Rokid speech synthesis is converted into sound data according to the user's text content, and played at the current volume of the device

**Method Preview**

| Return Type | Method | Remarks |
| -------- | ------- | -------------------------------- ----------- |
| void | doSpeechTts | Initiate online tts synthesis playback, TtsCallBack as the callback entity |

**Parameter Description**

| Field | Type | Required? | Description |
| -------- | -------------- | ------------------ | ---- |
| tts | String | Required | Text Content |
| callBack | TtsCallBack | Optional | Result callback |



#### 6) Cancel online TTS speech synthesis

**Interface Description**

After the user calls the doSpeechTts request, if you want to cancel the tts function, you can call this method

**Method Preview**

| Return Type | Method | Remarks |
| -------- | -------------- | -------------------- |
| void | cancelTts(int id) | Cancel the specified doSpeechTts request |

**Parameter Description**

| Field | Type | Required? | Description |
| ---- | ---- | ------ | --------- |
| id | int | yes | id returned in TtsCallBack |

**Sample Code**

```java
mSpeechUserManager.cancelTts(ttsId);
```

### 3.2 AsrCallBack

Voice asr service callback entity

**Method Preview**

| Return Type | Method | Remarks |
| -------- | ---------------------------------------- -------------------- | ----------------------- |
| void | onStart(int id) | asr starts to pick up the sound |
| void | onIntermediateResult(int id, String asr, String extra) | asr intermediate result, real-time return during recognition |
| void | onAsrComplete(int id, String asr) | asr complete result |
| void | onComplete(int id, String nlp, String action) | Final result of speech (retention method)|
| void | onCancel(int id) | asr is canceled |
| void | onError(int id, int err) | asr error |

**onStart(int id)**

**Method Description**

Notify the developer that asr starts to pick up the sound.

**Parameter Description**

| Field | Type | Description |
| ---- | ---- | ------------------- |
| id | int | The id of the current asr request |

**onIntermediateResult(int id, String asr, String extra)**

**Method Description**

Continue to return the text recognized by the current voice

**Parameter Description**

| Field | Type | Description |
| ----------- | ------ | ------------------ |
| id | int | asr id |
| asr | String | Intermediate result of speech to text |
| extra | String | Activation result |

**onAsrComplete(int id, String asr)**

**Method Description**

After voice asr recognition, the complete asr recognition result is returned

**Parameter Description**

| Field | Type | Description |
| --------- | ------ | ------------------- |
| id | int | The id of the current Speech request |
| asr | String | Complete speech-to-text result |

**onComplete(int id, String nlp, String action)**

**Method Description**

Return the skill information on the Rokid cloud platform according to the recognition result

**Parameter Description**

| Field | Type | Description |
| --------- | ------ | ---------------------------- |
| id | int | The id of the current Speech request |
| nlp | String | Natural semantic analysis result |
| action | String | Result returned by rokid speech skill |

**onCancel(int id)**

**Method Description**

Voice is cancelled

**Parameter Description**

| Field | Type | Description |
| ---- | ---- | ------------------- |
| id | int | The id of the current Speech request |

**onError(int id, int err)**

**Method Description**

Speech recognition error

**Parameter Description**

| Field | Type | Description |
| ------- | ---- | ------------------- |
| id | int | The id of the current asr request |
| err | int | Error code |



### 3.3 TtsCallBack

Voice tts service callback entity

**Method Preview**

| Return Type | Method | Remarks |
| -------- | --------------------------- | ------------ ----------- |
| void | onStart(int id) | Start receiving and playing voice data stream |
| void | onVoicePlay(int id, String text) | During playback, give the text that has been converted to voice |
| void | onCancel(int id) | tts task has been cancelled |
| void | onComplete(int id) | tts task ends, playback is complete |
| void | onError(int id, int err) | tts task text-to-speech error |

**onStart(int id)**

**Parameter Description**

| Field | Type | Description |
| ---- | ---- | --------------------------------------- --- |
| id | int | Start receiving and playing the voice data stream, the id returned by TTS Speak |

**onVoicePlay(int id, String text)**

| Field | Type | Description |
| ---- | ------ | ---------------------- |
| id | int | id returned by TTS Speak |
| text | String | The text currently converted to speech |


**onCancel(int id)**

| Field | Type | Description |
| ---- | ---- | ----------------- |
| id | int | id returned by TTS Speak |

**onComplete(int id)**

| Field | Type | Description |
| ---- | ---- | ----------------- |
| id | int | id returned by TTS Speak |

**onError(int id, int err)**

| Field | Type | Description |
| ---- | ---- | ----------------- |
| id | int | id returned by TTS Speak |
| err | int | Error code |
