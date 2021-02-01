

#  简介

  离线指令是在离线情况进行语音指令识别，所有的指令均依赖语音模型训练，因此不在当前已训练指令范围识别效果无法得到保障。当前离线指令包含的所有指令词请**[参考](https://docs.qq.com/sheet/DRGtvcW1qc01HTEdJ?tab=BB08J2)**

# 环境准备

* 安装AndroidStudio
* 新建Android工程

#  快速上手

1. 在项目根目录配置`maven`仓库地址

   ```groovy
       allprojects {
               repositories {
                   maven { url = 'https://dl.bintray.com/rokid/alliance/' }
               }
       }
   ```

2. 在`app/build.gradle`文件中添加模块依赖

   ```groovy
   implementation 'com.rokid.alliance.voicecommand:voicecommand:1.1.11'
   ```

3. SDK权限依赖

   ```groovy
   <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
   <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
   <uses-permission android:name="android.permission.CAMERA" />
   <uses-permission android:name="android.permission.INTERNET" />
   <uses-permission android:name="android.permission.READ_PHONE_STATE" />
   <uses-permission android:name="android.permission.RECORD_AUDIO" />
   <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
   ```

4. 初始化SDK

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

   

5. 添加离线指令

   ```java
       private static final RKOfflineWords[] offlineWords = new RKOfflineWords[]{
               new RKOfflineWords("大声点", "da sheng dian", defaultCallback),
               new RKOfflineWords("小声点", "xiao sheng dian", defaultCallback),
               new RKOfflineWords("亮一点", "liang yi dian", defaultCallback),
               new RKOfflineWords("暗一点", "an yi dian", defaultCallback),
       };
       RKVoiceEngine.getInstance().updateOfflineWords(offlineWords);
   ```

   

6. 移除离线指令

   ```java
   RKVoiceEngine.getInstance().clearOfflineWords(offlineWords);
   ```

   

7. 释放SDK

   ```java
   RKVoiceEngine.getInstance().uninit();
   ```

   

# 进阶篇

通过Lifecycle来控制当前生效的指令，一般每个页面的指令词是独享的，通过绑定Lifecycle，当页面生命周期发生变化的同时，指令词也会进行相应的添加、恢复、移除动作。目前有提供默认的一些实现策略可供参考，不一定能够满足实际场景的产品业务需求，具体可以参考RKOfflineCommandActivity、RKOfflineCommandFragment、RKOfflineCommandPresentation。

1. 创建RKOfflineCommandManager实例

   ```java
   private static final RKOfflineWords[] offlineWords = new RKOfflineWords[]{
               new RKOfflineWords("大声点", "da sheng dian", defaultCallback),
               new RKOfflineWords("小声点", "xiao sheng dian", defaultCallback),
               new RKOfflineWords("亮一点", "liang yi dian", defaultCallback),
               new RKOfflineWords("暗一点", "an yi dian", defaultCallback),
       };
   RKOfflineCommandManager mOfflineCommandManager = new RKOfflineCommandManager(offlineWords);
   ```

   

2. 绑定Lifecycle

   ```java
   mOfflineCommandManager.bindLifecycle(lifecycle:LifecycleOwner);
   ```

3. 更新离线指令

   ```java
   mOfflineCommandManager.updateOfflineCommands(offlineWords);
   ```

4. 移除离线指令

   ```java
   mOfflineCommandManager.removeOfflineCommands(offlineWords);
   ```

   

# FAQ



# 最佳实践

**[参考Demo工程](https://github.com/RokidGlass/RokidGlassMobileDemo)**

# 联系我们

SDK使用问题请直接通过github-issue提问即可。

# ChangeLog



