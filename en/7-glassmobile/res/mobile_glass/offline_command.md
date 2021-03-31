# A brief introduction

Offline commands are used to perform voice command recognition offline. All of these commands are dependent on voice model training. So, for those commands that have not been trained, their recognition result cannot be guaranteed. For all currently available offline commands, please **[refer to](https://docs.qq.com/sheet/DRGtvcW1qc01HTEdJ?tab=BB08J2) this document**.

# Prepare the development environment

* Install AndroidStudio
* Create an Android project

# Quick start guide

1.Configure the `maven` warehouse address in the root directory of the project.
   
   ```groovy
       allprojects {
               repositories {
                   maven { url = 'https://dl.bintray.com/rokid/alliance/' }
               }
       }
   ```

2.Add module dependencies in the file `app/build.gradle`.
   
   ```groovy
   implementation 'com.rokid.alliance.voicecommand:voicecommand:1.1.9'
   ```

3.Add the SDK permission dependencies.
   
   ```groovy
   <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
   <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
   <uses-permission android:name="android.permission.CAMERA" />
   <uses-permission android:name="android.permission.INTERNET" />
   <uses-permission android:name="android.permission.READ_PHONE_STATE" />
   <uses-permission android:name="android.permission.RECORD_AUDIO" />
   <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
   ```

4.Initialize SDK.
   
   ```java
   RKGlassDevice.RKGlassDeviceBuilder.buildRKGlassDevice().build().initUsbDevice(this, findViewById(R.id.camera_view), new OnGlassConnectListener() {
               @Override
               public void onGlassConnected(UsbDevice usbDevice, GlassInfo glassInfo) {
   
               }
   
               @Override
               public void onGlassDisconnected() {
   
               }
           });
   RKVoiceEngine.getInstance().init(getApplicationContext());
   ```

5.Add an offline command
   
   ```java
       private static final RKOfflineWords[] offlineWords = new RKOfflineWords[]{
               new RKOfflineWords("speak louder", "da sheng dian", defaultCallback),
               new RKOfflineWords("speak lower", "xiao sheng dian", defaultCallback),
               new RKOfflineWords("turn brigher", "liang yi dian", defaultCallback),
               new RKOfflineWords("turn darker", "an yi dian", defaultCallback),
       };
       RKVoiceEngine.getInstance().updateOfflineWords(offlineWords);
   ```

6.Remove an offline command
   
   ```java
   RKVoiceEngine.getInstance().clearOfflineWords(offlineWords);
   ```

7.Release the SDK.
   
   ```java
   RKVoiceEngine.getInstance().uninit();
   ```

# Advanced topics

The Lifecycle is used to control the currently active commands. Each page has unique commands. When a page is bound to the Lifecycle, the life cycle change of the page leads to activities on the commands, such as adding, restoring, and removing. The default implementation strategies are available for reference, but may not meet the product service requirements of actual scenarios. For more details, refer to RKOfflineCommandActivity, RKOfflineCommandFragment, and RKOfflineCommandPresentation.

1.Create RKOfflineCommandManager instance
   
   ```java
   private static final RKOfflineWords[] offlineWords = new RKOfflineWords[]{
               new RKOfflineWords("speak louder", "da sheng dian", defaultCallback),
               new RKOfflineWords("speak lower", "xiao sheng dian", defaultCallback),
               new RKOfflineWords("turn brigher", "liang yi dian", defaultCallback),
               new RKOfflineWords("turn darker", "an yi dian", defaultCallback),
       };
   RKOfflineCommandManager mOfflineCommandManager = new RKOfflineCommandManager(offlineWords);
   ```

2.Bind Lifecycle
   
   ```java
   mOfflineCommandManager.bindLifecycle(lifecycle:LifecycleOwner);
   ```

3.Update offline commands
   
   ```java
   mOfflineCommandManager.updateOfflineCommands(offlineWords);
   ```

4.Remove an offline command
   
   ```java
   mOfflineCommandManager.removeOfflineCommands(offlineWords);
   ```

# FAQ

# Best Practice

**[Reference Demo project](https://static.rokidcdn.com/sdk/sdk_glassmobile_demo-177ebe7.zip)**

# Contact us

If you have any questions on using the SDK, please submit your questions by creating issues on Github.

# ChangeLog

