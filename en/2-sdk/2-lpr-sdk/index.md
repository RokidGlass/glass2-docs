# License plate recognition SDK

**Version：3.9.2.1**

---


## A demo of how to use the APIs

https://github.com/Rokid/RokidLprSDK

## 1. Overview

RokidLPRSDK provides the functions of license plate detection and license plate recognition. It outputs license plate strings, license plate positions, and recognition confidence levels based on input data from cameras.

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

Add dependencies to "build.gradle" of the app.

```java
// integration of the CPU version
dependencies {
    implementation 'com.rokid.glass:lpr:3.9.2.1-cpu'
}
// integration of the NPU version
dependencies {
    implementation 'com.rokid.glass:lpr:3.9.2.1-npu-s905d3'
}
```

### 2.2 Permissions that are required

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


### 3.0 Initializing the license plate recognition engine

Initialize the engine in the onCreate method of the Application for the app:

```java
RokidLPR.Init(Context context,boolean npuMode);
```

Parameter| Meaning
----------|----------
context| The context
npuMode| Whether to switch to the NPU mode (Note: Set its value to "true" only when the device supports NPU)

### 3.1 Configuring parameters

**1. Setting the width and the height of the data source**

```java
LPRConfig lprConfig = new LPRConfig();
lprConfig.width = PREVIEW_WIDTH;
lprConfig.height = PREVIEW_HEIGHT;
```

Parameter| Meaning
----------|----------
width| The width of the input data
height| The height of the input data

### 3.2 License plate recognition

#### 1. Creating the license plate SDK

```java
RokidLPR rokidLPR = new RokidLPR();
```

**Returns:** `RokidLPR` The license plate recognition interface

#### 2. Setting the preview data of camera

Description: Transfer the camera data to the SDK.

```java
void setData(byte[] data)
```

Parameter| Meaning
----------|----------
data| The camera data, which must be in the format of nv21

Sample code:

```java
rokidLPR.setData(data);
```

#### 3. Obtaining the result of license plate recognition

Description: The detection result will be returned by the data structure LPRModel in a unified manner.

```java
void startLPR(RokidLPRCallback rokidLPRCallback)
```

Parameter| Meaning
----------|----------
rokidLPRCallback| The unified callback interface for the result of license plate recognition

Sample code:

```java
rokidLPR.startLPR(new RokidLPRCallback(){
            @Override
            public void onLPRCallback(LPRModel model) {
            
            }
        });
```

#### 4. Destroying the license plate recognition interface

Description: The memory recovery of the license plate recognition interface.

```java
rokidLPR.destroy();
```

### 3.3 License plate entity class

```java
public class LPRModel {
    public int width;
    public int height;
    public byte[] img_data;
    public List<LPRDO> lps = new ArrayList(); // the license plate data model, including LPRDOlist

    public LPRModel() {
    }
}

public class LPRDO {
    public RectF position; // the position where the license plate is located in the camera
    public String licensePlate; // the license plate string
    public float score; // the confidence of license plate recognition

    public LPRDO() {
    }
}
```