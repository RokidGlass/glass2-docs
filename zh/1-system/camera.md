**Version：V1.2**


<h2 id="2">1. Camera简介</h2>

我们的产品形态虽然是分体，camera模组通过USB接入到系统中，但是我们的OS进行了适配，开发者可直接使用Android标准的API1或者API2开发camera相关功能。一些常见开发问题如下：

### 1.1 Camera的对焦模式：中心对焦，默认定焦

Camera固件采用中心对焦的方式，取中心九分之一做中心区域对焦。可以解决背景过大、前景过小的对焦不准问题。
经过系统级测试，改善了对焦速度、对焦精度和识别类应用的识别速度。camera默认定焦模式，可配置开启自动对焦使用。

• 自动对焦：默认定焦用于固定场景使用，自动定焦模式可动态调节清晰度。

应用接口如下（安卓标准接口）：

```
## Camera API1

Camera.Parameters parameters = mCamera.getParameters();

// "auto" "fixed";
parameters.setFocusMode("auto");
mCamera.setParameters(parameters);
 
## Camera API2

mPreviewRequestBuilder.set(CaptureRequest.CONTROL_AF_MODE, CaptureRequest.CONTROL_AF_MODE_AUTO);
//或者
mPreviewRequestBuilder.set(CaptureRequest.CONTROL_AF_MODE, CaptureRequest.CONTROL_AF_MODE_CONTINUOUS_PICTURE);
  
```

### 1.2 Camera曝光模式：支持多种曝光模式选择

目前支持全局曝光，下三角曝光和中心曝光三种方式，可以满足不同场景的需求。

  •  全局曝光：相机应用关注整体观感，可以采用全局曝光  
 
  •  下三角曝光：在部分逆光场景下，减少天空对曝光的影响可以采用下三角曝光
  
  •  中心曝光：二维码识别场景，中心有较亮的屏幕场景，使用中心曝光为宜。 

应用接口如下：

```
方案一：Camera API1
	int aeCompMode; //0 全局曝光，1 下三角曝光，2 中心区域曝光
	Camera.Parameters parameters = mCamera.getParameters();
	parameters.setExposureCompensation(aeCompMode);
	mCamera.setParameters(parameters);

方案二：Camera API2
	int aeCompMode; //0 全局曝光，1 下三角曝光，2 中心区域曝光
	mPreviewBuilder.set(CaptureRequest.CONTROL_AE_EXPOSURE_COMPENSATION, aeCompMode);
```

### 1.3 Camera放大：支持多级数码变焦
camera支持在1080和720P输出分辨率时候，可以支持多级数码变焦。

• 放大模式：可以支持数码变焦，可以增强图像的细节，对小物体和小图案的识别功能，有较大改善空间。

应用接口如下（安卓标准接口）：

```
## Camera API1

Camera.Parameters parameters = mCamera.getParameters();

boolean isZoom = parameters.isZoomSupported();
int mMaxZoom = parameters.getMaxZoom();

if (isZoom && zoomLevel <= mMaxZoom) {
  parameters.setZoom(zoomLevel);
  mCamera.setParameters(parameters);
}
 
 
 
## Camera API2
Rect rect = mCameraCharacteristics.get(CameraCharacteristics.SENSOR_INFO_ACTIVE_ARRAY_SIZE);
float maxZoom = mCameraCharacteristics.get(CameraCharacteristics.SCALER_AVAILABLE_MAX_DIGITAL_ZOOM);
int zoomLevel = maxZoom;
float ratio = 1f / zoomLevel;
int croppedWidth = rect.width() - Math.round((float) rect.width() * ratio);
int croppedHeight = rect.height() - Math.round((float) rect.height() * ratio);

Rect mZoom = new Rect(croppedWidth / 2, croppedHeight / 2,
    rect.width() - croppedWidth / 2, rect.height() - croppedHeight / 2);
mPreviewRequestBuilder.set(CaptureRequest.SCALER_CROP_REGION,mZoom);
  
```


