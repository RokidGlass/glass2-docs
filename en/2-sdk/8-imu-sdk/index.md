# IMU SDK



## 1.Introduction to IMU SDK
---
### 1.1 Overview
The SDK Provides the control IMU View that controls the horizontal sliding on Rokid Glass and the instructions for customizing the use of IMU functions

**1. IMU View Control**
Provides a list control that can be automatically scrolled horizontally through the head control

**2. IMU Function Customization**
Based on IMU custom head control related functions

## 2.Integration instructions and version information
---
Refer to the integration and version update of Glass UI



## 3.Function List
---

### 3.1 IMU View

* IMU View control: Provides a list control that can control horizontal automatic scrolling by turning the head left and right, helping developers to quickly use the "hand-free" function.

* When the user turns on the "hand-free" in the system settings, your IMU View control will take effect.

* Sample code：

  Refer to the ImuActivity section of the Glassui library

#### 3.1.1 Example of use

<img width="400" src="images/imuview_simple.png">

#### 3.1.2 Instructions



```java
Initialize in Application:
IMUSdk.init(this);
Specific use:
getLifecycle().addObserver(mImuView);//Lifecycle binding
mImuView.setSlow();//The default is fast sliding mode, setting here can be set to slow sliding mode
mImuView.setAdapter(mAdapter);
```

``` xml
<com.rokid.glass.imusdk.core.IMUView
        android:id="@+id/ui_recycler_view"
        imulabmarginleft="10"
        imulabmargintop="10"
        imutouchstyle="true"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        app:imuscale="1.1"
        app:imutouchstyle="true" />

```

|Attribute configuration|Meaning|
|---|---|
|imuscale|Configure the zoom ratio of the selected item|
|imupadding|Configure the spacing filled in the item to reserve space for zooming|
|imuspeed|Configure the sliding speed of the uniform sliding mode|
|imuguide|Configure whether to display the top navigation bar|
|imuunable|The default is false, setting it to true will block the head control function of imu|
|imutitlewidth|Configure the width of the default display template title|
|imulabmarginleft|Configure the position of the upper left corner to indicate the distance between the lab and the left border|
|imulabmargintop|Configure the upper left corner position to indicate the distance between the lab and the upper boundary|
|imutouchstyle|Provides two sliding modes true: simulated touch sliding mode false: uniform sliding mode|
|imutouchinterval|Configure the sliding speed of the simulated touch sliding mode|

```xml
<declare-styleable name="imuview">
    <attr name="imuscale" format="float"/>
    <attr name="imupadding" format="dimension" />
    <attr name="imuspeed" format="integer" />
    <attr name="imuguide" format="boolean" />
    <attr name="imuunable" format="boolean" />
    <attr name="imutitlewidth" format="dimension" />
    <attr name="imulabmarginleft" format="dimension" />
    <attr name="imulabmargintop" format="dimension" />
    <attr name="imutouchstyle" format="boolean" />
    <attr name="imutouchinterval" format="dimension" />
</declare-styleable>
```

#### 3.1.3 Sliding mode selection

* Configuration method: configure via imutouchstyle attribute.

* Constant-speed sliding mode: The list slides at a constant speed, and each item will not have a pause effect. It is mostly used for faster scrolling of content, similar to a gallery.

* Simulated touch sliding mode: Simulates the effect of manual touch sliding. After each item, there will be a pause effect, which is easy for users to see. It is the default sliding mode.

  

### 3.2 IMU Function customization

* You can register the rotation vector sensor type of SensorManager.getDefaultSensor(Sensor.TYPE_GAME_ROTATION_VECTOR), get the real-time orientation information in the onSensorChanged(SensorEvent event) callback, and judge the current head control status according to the difference of each callback content and do the corresponding processing .
* Android official website address: https://developer.android.google.cn/reference/kotlin/android/hardware/SensorManager?hl=en
* Data acquisition and conversion: https://github.com/RokidGlass/glass-ui/blob/master/demo/src/main/java/com/rokid/glass/ui/sample/handcontrol/sensors/Orientation.java
* Use sample code: Refer to the HandControlActivity.java section of the GlassUI example