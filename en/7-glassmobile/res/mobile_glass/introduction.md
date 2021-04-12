<!-- toc -->  

![](media/glassConnectMobile.png)
      
# A brief introduction

**The Rokid AR Mobile Solution** can be used to implement these capabilities: `camera data`, `key events`, `sensor events`, `microphone data`, `offline commands` and `dual screen display`.

# Quick start guide

Please determine the functions to be implemented using the Rokid AR Mobile Solution, and then select the appropriate connection method from the following solutions:

1. [[Using hardware capabilities of the Rokid Glass (camera data, key events, sensor events, dual screen display)](glass_hardware.md#A brief introduction)
2. [Using hardware capabilities of Rokid Glass + face recognition and license plate recognition](ai.md)
3. [Using hardware capabilities of Rokid Glass + face recognition and license plate recognition + dual screen display](glass_ai_presentation.md)

# Best Practice

**[Reference Demo project](https://static.rokidcdn.com/sdk/sdk_glassmobile_demo-177ebe7.zip)**

# Appendices

If you are not familiar with the following areas of development expertise, please learn about them using the corresponding links.

1. [USB host](https://developer.android.com/guide/topics/connectivity/usb/host?hl=zh-cn)
2. [UVCcamera](https://github.com/jiangdongguo/AndroidUSBCamera): UVC stands for `USB Video Class`. This can be considered an external camera.
3. [Dual screen display](https://developer.android.com/reference/android/app/Presentation)

# Usage restrictions

When Rokid Glass is used as a USB device for dual screen display, the models of mobile phones are restricted, because different mobile phone manufacturers implement the dual screen display function in different ways. **Currently, only some Huawei mobile phone models with DP output are supported, including Mate10, Mate20, Mate30 and their corresponding Pro models.** 
A supported mobile phone must meet the following requirements (you can directly perform step 3 to determine whether the mobile phone is supported):

1. The mobile phone has a USB Type-C port.
2. The mobile phone supports DP output.
3. **The mobile phone is NOT supported if it does not meet either of these requirements:**
   1. Power supply is normal: Connect the glasses to the mobile phone with a data cable, put on the glasses and confirm screen of the glasses is on. ![Step 1](media/mobile phone support2.jpeg "Power supply is normal.")
   2. Display is normal: Confirm the image displayed on the glasses is normal. This image is usually a mirror of what is displayed on the mobile phone screen. ![Step 2](media/mobile phone support1.jpeg "Display is normal.")


