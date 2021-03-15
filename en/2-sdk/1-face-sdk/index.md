# Offline facial recognition SDK

**Version：facelib 4.16.3.3**

---


## A demo of how to use the APIs

https://github.com/Rokid/RokidFaceSDK/tree/master/sample

## 1. Introduction to FaceSDK

### Description of the version number:

The first two parts (e.g. 4.16) represent version number of the algorithm, and last 2 parts (e.g. 3.3) represent version number of SDK.

### 1.1 Overview

Rokid FaceSDK provides basic facial detection, facial tracking, and facial recognition, and is capable of efficiently performing multi-person recognition. The underlying algorithm interface is packaged into this SDK, and this SDK provides:

1. Facial detection in images and facial recognition in images<br> 
2. Facial detection, facial tracking and facial recognition using camera preview data<br> 
3. APIs for creating, reading, updating and deleting records in the face database<br> 
4. Capability of obtaining information such as facial angles and facial quality<br> 
5. Facial detection in single-frame images (facial detection using data in bitmap and NV21 formats is supported)<br>

## 2. Description of integration

---


### 2.1 Adding 3rd party dependencies

Add the jcenter dependency to build.gradle in the project

```java
allprojects {
    repositories {
        google()
        jcenter()
    }
}
```

Add dependencies to build.gradle in the app. If the terminal using this SDK uses a general-purpose CPU computing platform, then:

```java
dependencies {
    implementation 'com.rokid.glass:facelib:4.16.3.3-cpu'
}
```

If the terminal using this SDK uses an s905d3 computing platform (Rokid Glass 2), then:

```java
dependencies {
    implementation 'com.rokid.glass:facelib:4.16.3.3-npu-s905d3'
}
```

### 2.2 Permissions that are required

Internet access permission:

```xml
<uses-permission android:name="android.permission.INTERNET"/>
```

Permission to read from external storage:

```xml
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE/>
```

Camera permissions:

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-feature android:name="android.hardware.camera" />
<uses-feature android:name="android.hardware.camera.autofocus" />
```

## 3. Description and sample usages of the APIs

---


### 3.0 Initializing the facial recognition engine

Initialize the engine in the onCreate method of the Application for the app:

**1. Initializing the facial recognition engine**

```java
RokidFace.Init(Context context);
```

Parameter| Meaning
----------|----------
context| The context

### 3.1 Operations on the face database

#### 3.1.1 Initializing the face database

The following steps are required to initialize the face database:

**1. Creating a Helper object for the face database**

Note: This is the entity class for database operations.

```java
FaceDbHelper(Context context)
```

Parameter| Meaning
----------|----------
context| The context

**Returns:** `FaceDbHelper`

**2. Creating the face database**

```java
void createDb()
```

Sample code

```java
FaceDbHelper faceDbHelper = new FaceDbHelper(getApplicationContext());
faceDbHelper.createDb();
```

#### 3.1.2 Adding the facial features

Note: This will add facial features to the memory.

```java
String add(Bitmap bm)
```

Parameter| Meaning
----------|----------
bm| The image to be passed in

**Returns:** ID of the facial feature for the image (unique identification number of the facial feature for the image). This ID is returned during facial recognition. A developer can use this ID as the primary key to create a face information database, and search for the face information when this ID is returned during facial recognition.

Sample code:

```java
String featId = faceDbHelper.add(bm);
```

#### 3.1.3 Saving the facial feature search engine locally

Note:

* The facial feature search engine file is "SearchEngine.bin".
* Before using facial recognition, you need to copy this file to the desired device.

```java
void save()
```

Sample code:

```java
faceDbHelper.save();
```

#### 3.1.4 Clearing data in the facial feature search engine

```java
faceDbHelper.clearDb();
```

### 3.2 Configuring parameters for facial detection

#### 3.2.1 Configuring parameters for facial detection

**1. Setting the width and the height of the data source**

```java
DetectFaceConf setSize(int width,int height)
```

Parameter| Meaning
----------|----------
width| The width of the input data
height| The height of the input data

**Returns:**

Type| Meaning
----------|----------
DetectFaceConf| The class for facial detection configuration

**2. Setting the algorithm's detection area**

```java
DetectFaceConf setRoi(Rect rect)
```

Parameter| Meaning
----------|----------
rect| The input algorithm's detection area

**Returns:**

Type| Meaning
----------|----------
DetectFaceConf| The class for facial detection configuration

**3. Setting the maximum number of faces recognized at a time**

```java
DetectFaceConf setPoolNum(int poolNum)
```

Parameter| Meaning
----------|----------
poolNum| The maximum number of faces recognized at a time

**Returns:**

Type| Meaning
----------|----------
DetectFaceConf| The class for facial detection configuration

**4. Setting the largest face that can be recognized**

```java
DetectFaceConf setMaxSize(float faceMaxSize)
```

Parameter| Meaning
----------|----------
faceMaxSize| The size of the largest face that can be recognized (Valid value range: 0f-1f). For example, if resolution of the camera is 1280x720, *then pixels of the largest face that can be recognized are width: 1280*\*faceMaxSize and height: 720\*faceMaxSize.

**Returns:**

Type| Meaning
----------|----------
DetectFaceConf| The class for facial detection configuration

**5. Setting the smallest face that can be recognized**

```java
DetectFaceConf setMinSize(float faceMinSize)
```

Parameter| Meaning
----------|----------
faceMinSize| The size of the smallest face that can be recognized (Valid value range: 0f-1f). For example, if resolution of the camera is 1280x720, then pixels of the smallest face that can be recognized are width: 1280\*faceMinSize and height: 720\*faceMinSize.

**Returns:**

| Type| Meaning
|----------|----------
| DetectFaceConf| The class for facial detection configuration

**6. Setting the maximum number of faces that can be detected at a time**

```java
DetectFaceConf setDetectMaxFace(int detectMaxFace)
```

Parameter| Meaning
----------|----------
detectMaxFace| The maximum number of faces that can be detected at a time

**Returns:**

Type| Meaning
----------|----------
DetectFaceConf| The class for facial detection configuration

**7. Setting recognition-related configuration**

```java
RecogFaceConf setRecog（boolean recog,String dbName）
```

Parameter| Meaning
----------|----------
recog| Whether to switch on facial recognition
dbName| The path to the face database folder

**Returns:**

Type| Meaning
----------|----------
RecogFaceConf| The class for facial recognition configuration

**8. Setting the recognition threshold**

```java
RecogFaceConf setTargetScore(float targetScore);
```

Parameter| Meaning
----------|----------
targetScore| The threshold (valid value range: 0-100). Recognition results below the threshold will be filtered out.

**Returns:**

Type| Meaning
----------|----------
RecogFaceConf| The class for facial recognition configuration

**9. Setting the recognition timeout period**

```java
RecogFaceConf setOutTime(long ms);
```

Parameter| Meaning
----------|----------
ms| The timeout period. If there is no recognition result above the threshold within this period, then a timeout is returned.

**Returns:**

Type| Meaning
----------|----------
RecogFaceConf| The class for facial recognition configuration

**10. Setting the recognition interval**

```java
RecogFaceConf setRecogInterval(long ms);
```

Parameter| Meaning
----------|----------
ms| The recognition interval, the period between two recognitions of the same face

**Returns:**

Type|Meaning 
------|--------- 
RecogFaceConf| The class for facial recognition configuration Sample code:

```java
DetectFaceConf conf = new DetectFaceConf();
conf.setSize(width, height); // set the width and the height of data
conf.setRoi(rect); // set the algorithm's detection area
RecogFaceConf conf = new RecogFaceConf();
conf.setRecog(true, dbPath); // set the path to the facial recognition search engine
conf.setTargetScore(80); // set the recognition threshold
conf.setsetOutTime(2000); // set the timeout period
conf.setRecogInterval(5000); // set the recognition interval
```

### 3.3 Facial detection using camera/video

#### 3.3.1 Creating the face SDK

**1. Configuring dynamic parameters**

```java
VideoRokidFace create(Context context,DetectFaceConf dFaceConf)
```

Parameter| Meaning
----------|----------
context| The context
dFaceConf| The class for dynamic configuration

**Returns:** `VideoRokidFace` The interface for facial recognition using video

**2. Configuring static parameters**

```java
sconfig(RecogFaceConf conf)
```

Parameter| Meaning
----------|----------
conf| The class for static configuration

Sample code:

```java
VideoRokidFace videoFace = VideoRokidFace.create(context,videoDFaceConf);
videoFace.sconfig(sFaceConf);
```

#### 3.3.2 Setting the preview data of camera

Note: This is to pass data into the SDK.

```java
void setData(VideoInput videoInput)
```

Parameter| Meaning
----------|----------
videoInput| The class for video input data

Sample code:

```java
videoFace.setData(new VideoInput(bytes));
```

#### 3.3.3 Obtaining the detected data

Note: This is to obtain the input data.

```java
byte[] getBytes()
```

**Returns:** The data transferred from the camera

Sample code:

```java
videoFace.getBytes();
```

#### 3.3.4 Facial detection and facial tracking

Note: The detection result will be returned together as a [FaceModel](#352-Face data classes) data structure.

```java
void startTrack(RokidFaceCallback rokidFaceCallback)
```

Parameter| Meaning
----------|----------
rokidFaceCallback| The unified callback interface for facial detection, facial tracking, and facial recognition

Sample code:

```java
videoFace.startTrack(new RokidFaceCallback() {
    @Override
    public void onFaceCallback(FaceModel model) {

    }
});
```

#### 3.3.5 Destroying facial detection

Note: This to recover the memory used by the facial recognition interface.

```java
videoFace.destroy();
```

### 3.4 Facial detection in a single image

#### 3.4.1 Creating facial detection

Note: This is to create the image recognition interface.

```java
IImageRokidFace imageFace = ImageRokidFace.create(context);
```

Parameter| Meaning
----------|----------
context| The context

**Returns:** `IImageRokidFace` The interface for image recognition

Sample code:

```java
IImageRokidFace imageFace = ImageRokidFace.create(context);
```

#### 3.4.2 Initializing facial detection

Note: This is to set the static configuration for image recognition.

```java
IImageRokidFace sconfig(RecogFaceConf sFaceConf)
```

Parameter| Meaning
----------|----------
sFaceConf| The facial recognition configuration

**Returns:** 
`IImageRokidFace` The interface for image recognition

Sample code:

```java
// If facial recognition is required during image detection, then use sconfig.
imageFace.sconfig(new RecogFaceConf().setRecog(true, dbPath));
```

#### 3.4.3 The facial detection interface

Note: This is the interface for implementing the function of image recognition.

```java
setImageFaceCallback(BitmapInput bitmapInput,ImageFaceCallBack callback)
```

Parameter| Meaning
----------|----------
bitmapInput| bitmapInput The data structure for the image input
callback| The unified callback interface for facial detection and facial recognition in an image

Sample code:

```java
imageFace.setImageFaceCallback(new BitmapInput(bitmap),
    new ImageRokidFace.ImageFaceCallBack() {
        @Override
        public void onFaceModel(FaceModel model) {

        }});
```

#### 3.4.4 Destroying facial detection

Note: This to recycle the interface for facial recognition in an image.

```java
imageFace.destroy()
```

### 3.5 Face entity classes

#### 3.5.1 Face data classes

```java
FaceModel {
   int width;
   int height;
   public byte[] data; // data of the current frame
   List<FaceDO> faces; // Facial detection data model, which contains a FaceDO list
}

FaceDO {
    public RectF faceRectF; // face rect
    public int trackId;  // trackId of the face. This id will not change during tracking.
    public boolean goodQuality; // whether the facial quality is good enough
    public boolean goodPose; // whether the facial angle is good enough
    public float[] pose; // facial angle
    public float userInfoScore; // degree of similarity of the face found in the search engine (value range: 0-100). The greater the value, the more similar the face is to the search result.
    public float quality; // facial quality (value range: 0-100). The greater the value, the higher the quality of the face. In general, if the value is 0-30, the facial quality is considered low. If the value is 30-60, the facial quality is considered good enough, and facial recognition can proceed. If the value is greater than 60, the facial quality is considered very good.
    public boolean recogOutTime; // whether facial recognition is timed out
    public float faceScore; // degree of similarity between this frame's rect and the face (value range: 0-100). The greater the value, the higher the probability that the frame's rect represents the face. In general, if the value is greater than 75, we can consider that the frame's rect represents the face. (Please distinguish this from userInfoScore)
    public int faceAlignTime; // the number of times the faceAlign algorithm is performed on the face
    public int faceRecogTime; // the number of times the faceRecog algorithm is performed on the face
    public String featid; // the unique identification number found in the search engine
    public Bitmap recogBitmap; // the image used by the algorithm to perform recognition
    public boolean qualityGoodEnough; // whether quality of the face is greater than 60
}
```

## 4. Logging key steps

### 4.1 Setting the log level

```java
FaceLogger.LOG_LEVEL = 0; // print all logs
FaceLogger.LOG_LEVEL = 1; // print the logs for errors, warnings, and debugging
FaceLogger.LOG_LEVEL = 2; // print the logs for errors and warnings
FaceLogger.LOG_LEVEL = 3; // print the logs for errors
```

### 4.2 Logging the recognition result

```java
// When score of the recognition result is above the threshold, print the UUID and the score for the recognition.
FaceLogger.i(TAG, "------- recog result > targetScore-------- trackid:" + face.getTrackid() + " uuid:" + pairList.get(0).first + " score:" + pairList.get(0).second);
// When score of the recognition result is below the threshold, print the UUID and the score for the recognition.
FaceLogger.i(TAG, "------- recog result < targetScore-------- trackid:" + face.getTrackid() + " uuid:" + pairList.get(0).first + " score:" + pairList.get(0).second);
// Print this log when the current recognition produces no result.
FaceLogger.i(TAG, "--------------- pairList: null");
```