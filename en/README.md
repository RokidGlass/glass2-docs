# Rokid Glass Software Development Document

[![Build Status](https://travis-ci.org/RokidGlass/glass2-docs.svg?branch=master)](https://travis-ci.org/github/RokidGlass/glass2-docs)

## 1、Introduction
-   This document is aimed at the developers of Rokid Glass and introduces how to develop applications on Rokid Glass.
-   This document contains system information, development guide, Rokid Glass SDK usage documents and examples.
-   For detailed page jump, please click "Directory" in the upper left corner of gitbook.

## 2、System information description
### Basic Information
|name|Introduction|
|---|---|
| AP | Amlogic-S905D3|
| RAM |2G|
| ROM |32G|
| IMU |9 axis, support ROTATION_VECTOR|
| Camera |The maximum resolution of photos is 3264x2448, and video is 1080p@30fps|
| Screen | Resolution 1280x720, horizontal screen, 320dpi |
| Based on Android9.0 |Development Tools AndroidStudio|
| interactive mode |[Touchpad, buttons](1-system/index.md), head control|

## 3、Brief development guide
* The difference between glasses development and Android development
  
  * Glass does not have a touch screen, only a touch pad. Some types of controls require custom focus control
  * It is recommended on Glass not to display the camera preview (preview), because AR glasses can see through the real world. For specific implementation, please refer to [Camera Mapping](2-sdk/ui-sdk/index.md#3. Function list)
  * Glass style UI: Refer to [UI SDK](2-sdk/ui-sdk/index.md).
  * If you need to use the built-in AR screen recording function of the system and need to overlay the Camera preview as the screen recording background, please note:
	* App uses Camera API2 interface;
	* The Activity that needs to be superimposed on the Camera preview, and it needs to be broadcast when it is turned on. ``android.intent.action.CAMERA_WALLPAPER_START_PREVIE``
	
    
	
	* Send the broadcast ``android.intent.action.CAMERA_WALLPAPER_STOP_PREVIE``
	
* Steps of glasses development:
  
  1. Create a new Android project, or rebuild based on an existing Android project.
  
  2. According to the development model of Android TV, use the Glass touchpad to control focus changes (refer to [Touchpad key value description](1-system/index.md))。<br>Congratulations! You can use your own app with the touchpad on the glasses!
  
  3. You can use the provided **Basic SDK** to develop the interactive mode of Glass voice and head control.
  
  4. According to the application scenario, you can select the corresponding **function SDK** to speed up development.

## 4、SDK introduction and download
### Basic SDK
|name|Introduction|
|---|---|
| [Glass UI](2-sdk/ui-sdk/index.md) | 1. Provide a set of basic UI libraries for developing applications on Rokid Glass<br>2. The relationship between the real world and camera preview (Preview) and camera mapping (alignment)<br> |

