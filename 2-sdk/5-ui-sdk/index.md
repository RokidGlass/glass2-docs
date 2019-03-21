# Glass UI SDK
**Version: 1.0.0-SNAPSHOT**
## 目录
* [概述](#概述)
* [接入方式](#接入方式)
    * [Gradle依赖](#Gradle依赖)
    * [Sample](#Sample)
* [功能列表](#功能列表)
    * [GlassButton](#GlassButton)
    * [GlassDialog](#GlassDialog)
* [工具类](#工具类)

## 概述
目前的UI SDK仅适用于Glass版本

## 接入方式
在根目录`build.gradle`中增加私有maven库：
``` gradle
maven {
    url 'http://mvnrepo.rokid-inc.com/nexus/content/repositories/snapshots/'
}

maven {
    url 'http://mvnrepo.rokid-inc.com/nexus/content/repositories/releases/'
}
```
### Gradle依赖
``` gradle
implementation 'com.rokid.glass:ui:1.0.0-SNAPSHOT'
```

### Sample
[Glass UI Sample](https://gitlab.rokid-inc.com/rokid-glass/glass-ui)

## 功能列表
### GlassButton
Glass自定义的Button

`Focused`:  

![](images/glass_button_focused.png)

`Normal`

![](images/glass_button_normal.png)

#### 用法
``` xml
<com.rokid.glass.ui.button.GlassButton
    android:id="@+id/confirm_btn"
    style="@style/GlassButton"
    android:layout_width="@dimen/glass_button_width"
    android:layout_height="@dimen/glass_button_height"
    android:text="@string/confirm_text" />
```
### GlassDialog
提供了一系列常用的对话框,通过不同Builder 来构建不同类型的对话框。
目前提供的Builder:
#### NotificationDialogBuilder
通知栏通知（出现固定时间后消失）

![](images/notification.png)
``` java
GlassDialog notificationDialog = new GlassDialog.NotificationDialogBuilder(this)
            .setTitle(getString(R.string.notification_title))
            .setMessage(getString(R.string.notification_message))
            .setIconRes(R.mipmap.ic_launcher)
            .setDuration(3000)
            .create();
notificationDialog.show();
```
|方法|含义|默认值
|---|---|---|
|setTitle|设置通知栏标题|null|
|setMessage|设置通知栏内容|null|
|setIconRes|设置通知icon||
|setDuration|设置通知栏消息时间(ms)|3000|

#### SimpleVoiceDialogBuilder
纯语音通知

![](images/notify_simple_voice.png)

具体代码参考Sample
``` java
GlassDialog simpleVoiceDialogBuilder = new GlassDialog.SimpleVoiceDialogBuilder(this)
            .setTitle(getString(R.string.voice_test))
            .setConfirmText(getString(R.string.voice_play))
            .setCancelText(getString(R.string.voice_collapse))
            .setConfirmListener(new GlassDialogListener() {
                @Override
                public void onClick(View view) {
                    Toast.makeText(MainActivity.this,
                            "Click Confirm", Toast.LENGTH_SHORT).show();

                    mSimpleVoiceDialogBuilder.dynamicTitle(getString(R.string.voice_playing));
                    mSimpleVoiceDialogBuilder.dynamicCustomConfirmView(mCustomTimerView);

                    countDownManager.start();
                }
            })
            .setCancelListener(new GlassDialogListener() {
                @Override
                public void onClick(View view) {
                    Toast.makeText(MainActivity.this,
                            "Click Cancel", Toast.LENGTH_SHORT).show();

                    if (null != countDownManager) {
                        countDownManager.cancel();
                    }
                }
            });

simpleVoiceDialogBuilder.show();
```
|方法|含义|默认值
|---|---|---|
|setTitle|设置标题|null|
|setConfirmText|设置确定按钮文字|确定|
|setCancelText|设置取消按钮文字|取消|
|setConfirmListener|设置Confirm监听||
|setCancelListener|设置Cancel监听||
|dynamicTitle|动态改变标题||
|dynamicConfirmText|动态改变确定按钮文字| |
|dynamicCustomConfirmView|自定义Confirm界面布局| - |

#### ImageDialogBuilder
语音图片通知

![](images/notify_image.png)

示例代码
``` java
mImageDialogBuilder = new GlassDialog.ImageDialogBuilder(this)
            .setTitle(getString(R.string.image_title))
            .setConfirmText(getString(R.string.voice_play))
            .setCancelText(getString(R.string.voice_collapse))
            .setNotifyResId(R.mipmap.ic_notify_img)
            .setConfirmListener(new GlassDialogListener() {
                @Override
                public void onClick(View view) {
                    Toast.makeText(MainActivity.this,
                            "Click Confirm", Toast.LENGTH_SHORT).show();

                    mImageDialogBuilder.dynamicCustomConfirmView(mCustomTimerView);
                    countDownManager.start();
                }
            })
            .setCancelListener(new GlassDialogListener() {
                @Override
                public void onClick(View view) {
                    Toast.makeText(MainActivity.this,
                            "Click Cancel", Toast.LENGTH_SHORT).show();

                    if (null != countDownManager) {
                        countDownManager.cancel();
                    }
                }
            });

mImageDialogBuilder.show();
```
|方法|含义|默认值
|---|---|---|
|setTitle|设置标题|null|
|setConfirmText|设置确定按钮文字|确定|
|setCancelText|设置取消按钮文字|取消|
|setNotifyResId|设置图片显示,res方式||
|setNotifyBitmap|设置图片显示,bitmap方式||
|setConfirmListener|设置Confirm监听||
|setCancelListener|设置Cancel监听||
|dynamicConfirmText|动态改变确定按钮文字||
|dynamicCustomConfirmView|自定义Confirm界面布局|-|

#### SimpleMessageDialogBuilder
仅有标题  

![](images/notify_simple_title.png)

示例代码：
``` java
new GlassDialog.SimpleMessageDialogBuilder(this)
            .setTitle(getString(R.string.simple_message_title))
            .setConfirmText(getString(R.string.voice_play))
            .setCancelText(getString(R.string.voice_collapse))
            .setConfirmListener(new GlassDialogListener() {
                @Override
                public void onClick(View view) {
                    Toast.makeText(MainActivity.this,
                            "Click Confirm", Toast.LENGTH_SHORT).show();
                }
            })
            .setCancelListener(new GlassDialogListener() {
                @Override
                public void onClick(View view) {
                    Toast.makeText(MainActivity.this,
                            "Click Cancel", Toast.LENGTH_SHORT).show();

                }
            }).show();
```
|方法|含义|默认值
|---|---|---|
|setTitle|设置标题|null|
|setConfirmText|设置确定按钮文字|确定|
|setCancelText|设置取消按钮文字|取消|
|setConfirmListener|设置Confirm监听||
|setCancelListener|设置Cancel监听|-|
#### SimpleContentDialogBuilder
标题+正文

![](images/nofity_simple_content.png)

```java
new GlassDialog.SimpleContentDialogBuilder(this)
            .setTitle(getString(R.string.simple_message_title))
            .setConfirmText(getString(R.string.voice_play))
            .setCancelText(getString(R.string.voice_collapse))
            .setContent(getString(R.string.simple_content))
            .setConfirmListener(new GlassDialogListener() {
                @Override
                public void onClick(View view) {
                    Toast.makeText(MainActivity.this,
                            "Click Confirm", Toast.LENGTH_SHORT).show();
                }
            })
            .setCancelListener(new GlassDialogListener() {
                @Override
                public void onClick(View view) {
                    Toast.makeText(MainActivity.this,
                            "Click Cancel", Toast.LENGTH_SHORT).show();

                }
            }).show();
```
|方法|含义|默认值
|---|---|---|
|setTitle|设置标题|null|
|setContent|设置内容|null|
|setConfirmText|设置确定按钮文字|确定|
|setCancelText|设置取消按钮文字|取消|
|setConfirmListener|设置Confirm监听| |
|setCancelListener|设置Cancel监听|-|

#### ImageContentDialogBuilder
标题+图片

![](images/notify_image_content.png)

```java
new GlassDialog.ImageContentDialogBuilder(this)
            .setTitle(getString(R.string.image_content_title))
            .setConfirmText(getString(R.string.voice_play))
            .setCancelText(getString(R.string.voice_collapse))
            .setNotifyResId(R.mipmap.ic_notify_img)
            .setContent(getString(R.string.simple_content))
            .setConfirmListener(new GlassDialogListener() {
                @Override
                public void onClick(View view) {
                    Toast.makeText(MainActivity.this,
                            "Click Confirm", Toast.LENGTH_SHORT).show();
                }
            })
            .setCancelListener(new GlassDialogListener() {
                @Override
                public void onClick(View view) {
                    Toast.makeText(MainActivity.this,
                            "Click Cancel", Toast.LENGTH_SHORT).show();

                }
            }).show();
```
|方法|含义|默认值
|---|---|---|
|setTitle|设置标题|null|
|setContent|设置内容|null|
|setNotifyResId|设置图片显示,res方式||
|setNotifyBitmap|设置图片显示,bitmap方式||
|setConfirmText|设置确定按钮文字|确定|
|setCancelText|设置取消按钮文字|取消|
|setConfirmListener|设置Confirm监听| |
|setCancelListener|设置Cancel监听|-|
#### CustomerSimpleMsgDialogBuilder
自定义标题内容

![](images/notifiy_customer_content.png)
```java
mCustomerMessageDialog = new GlassDialog.CustomerSimpleMsgDialogBuilder(this)
            .setTitle(getString(R.string.image_content_title))
            .setConfirmText(getString(R.string.voice_play))
            .setCancelText(getString(R.string.voice_collapse))
            .setCustomerText(getString(R.string.voice_customer))
            .setContent(getString(R.string.simple_content))
            .setCustomerListener(new GlassDialogListener() {
                @Override
                public void onClick(View view) {
                    Toast.makeText(MainActivity.this,
                            "Click Customer", Toast.LENGTH_SHORT).show();
                }
            })
            .setConfirmListener(new GlassDialogListener() {
                @Override
                public void onClick(View view) {
                    Toast.makeText(MainActivity.this,
                            "Click Confirm", Toast.LENGTH_SHORT).show();
                    if (null != mCustomerMessageDialog && mCustomerMessageDialog.isShowing()) {
                        mCustomerMessageDialog.dismiss();
                    }
                }
            })
            .setCancelListener(new GlassDialogListener() {
                @Override
                public void onClick(View view) {
                    Toast.makeText(MainActivity.this,
                            "Click Cancel", Toast.LENGTH_SHORT).show();

                }
            })
            .show();
```
|方法|含义|默认值
|---|---|---|
|setTitle|设置标题|null|
|setContent|设置内容|null|
|setCustomerText|自定义按钮文本||
|setConfirmText|设置确定按钮文字|确定|
|setCancelText|设置取消按钮文字|取消|
|setConfirmListener|设置Confirm监听| |
|setCancelListener|设置Cancel监听| |
|setCustomerListener|自定义按钮监听|-|

#### CustomerImageDialogBuilder
自定义图片样式1

![](images/notify_customer_image1.png)
```java
mCustomerImageDialogBuilder = new GlassDialog.CustomerImageDialogBuilder(this)
            .setTitle(getString(R.string.image_title))
            .setConfirmText(getString(R.string.voice_play))
            .setCancelText(getString(R.string.voice_collapse))
            .setCustomerText(getString(R.string.voice_customer))
            .setNotifyResId(R.mipmap.ic_notify_img)
            .setCustomerListener(new GlassDialogListener() {
                @Override
                public void onClick(View view) {
                    Toast.makeText(MainActivity.this,
                            "Click Customer", Toast.LENGTH_SHORT).show();
                }
            })
            .setConfirmListener(new GlassDialogListener() {
                @Override
                public void onClick(View view) {
                    Toast.makeText(MainActivity.this,
                            "Click Play", Toast.LENGTH_SHORT).show();
                    mCustomerImageDialogBuilder.dynamicCustomConfirmView(mCustomTimerView);
                    countDownManager.start();
                }
            })
            .setCancelListener(new GlassDialogListener() {
                @Override
                public void onClick(View view) {
                    Toast.makeText(MainActivity.this,
                            "Click Cancel", Toast.LENGTH_SHORT).show();

                }
            });

mCustomerImageDialogBuilder.show();
```
|方法|含义|默认值
|---|---|---|
|setTitle|设置标题|null|
|setCustomerText|自定义按钮文本||
|setConfirmText|设置确定按钮文字|确定|
|setCancelText|设置取消按钮文字|取消|
|setNotifyResId|设置图片显示,res方式| |
|setNotifyBitmap|设置图片显示,bitmap方式| |
|setConfirmListener|设置Confirm监听| |
|setCancelListener|设置Cancel监听| |
|setCustomerListener|自定义按钮监听|-|

#### CustomerImageContentDialogBuilder
自定义图片样式2

![](images/notify_customer_image2.png)
```java
new GlassDialog.CustomerImageContentDialogBuilder(this)
            .setTitle(getString(R.string.image_content_title))
            .setConfirmText(getString(R.string.voice_play))
            .setCancelText(getString(R.string.voice_collapse))
            .setNotifyResId(R.mipmap.ic_notify_img)
            .setContent(getString(R.string.multi_content))
            .setCustomerText(getString(R.string.voice_customer))
            .setCustomerListener(new GlassDialogListener() {
                @Override
                public void onClick(View view) {
                    Toast.makeText(MainActivity.this,
                            "Click Customer", Toast.LENGTH_SHORT).show();
                }
            })
            .setConfirmListener(new GlassDialogListener() {
                @Override
                public void onClick(View view) {
                    Toast.makeText(MainActivity.this,
                            "Click Play", Toast.LENGTH_SHORT).show();
                }
            })
            .setCancelListener(new GlassDialogListener() {
                @Override
                public void onClick(View view) {
                    Toast.makeText(MainActivity.this,
                            "Click Cancel", Toast.LENGTH_SHORT).show();

                }
            })
            .show();
```
|方法|含义|默认值
|---|---|---|
|setTitle|设置标题|null|
|setContent|设置内容|null|
|setCustomerText|自定义按钮文本||
|setConfirmText|设置确定按钮文字|确定|
|setCancelText|设置取消按钮文字|取消|
|setNotifyResId|设置图片显示,res方式| |
|setNotifyBitmap|设置图片显示,bitmap方式| |
|setConfirmListener|设置Confirm监听| |
|setCancelListener|设置Cancel监听| |
|setCustomerListener|自定义按钮监听|-|

### 工具类
#### CountDownManager
倒计时
```java
CountDownManager countDownManager = new CountDownManager.Builder()
            .setMillisInFuture(10000)
            .setCountDownInterval(1000)
            .setCountDownListener(new CountDownManager.CountDownListener() {
                @Override
                public void onTick(long millisUntilFinished) {
                    
                }

                @Override
                public void onFinish() {
                    
                }
            })
            .build();
countDownManager.start();
//countDownManager.cancel();
```
|方法|含义|默认值
|---|---|---|
|setMillisInFuture|总时间||
|setCountDownInterval|间隔时间| |
|setCountDownListener|监听回调| |
|start|开始| |
|cancel|取消|-|

#### RokidSystem
##### getAlignmentRect
获取不同 glass 下的 alignment 参数

##### getHardwareVersion
获取glass硬件版本,dvt或者evt