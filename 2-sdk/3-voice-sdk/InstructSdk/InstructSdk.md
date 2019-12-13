
# 语音离线指令SDK

## **Version：instructsdk 1.1.4**

## 接口使用示例demo

https://github.com/RokidGlass/Rokid_APG_VoiceInstructDemo

## 一. SDK概述

Rokid 离线语音指令SDK 开发工具，方便开发配合Rokid语音助手一起使用的离线语音指令。指令触发需要用户打开眼镜设备''设置''中''语音助手激活''开关，另外语音指令对网络环境没有要求，在离线/在线环境下都可以使用。

附：语音助手RokidAiSdk需要v1.9.5版本以上。

  ```shell
  // 语音助手RokidAiSdk版本查看方式
  adb shell dumpsys package com.rokid.ai.glassaudio
  ```



### 二. 集成说明

##### 添加三方依赖库

- 总工程build.gradle配置：

  ```groovy
  allprojects {
      repositories {
          google()
          jcenter()
      }
  }
  ```
  
- app应用 module中build.gradle配置：

  ```groovy
  dependencies {
      implementation fileTree(dir: 'libs', include: ['*.jar'])
      // 语音指令SDK
      implementation 'com.rokid.ai.glass:instructsdk:1.1.4'
  }
  ```
- Jcenter Maven信息

  ```xml
  <dependency>
    <groupId>com.rokid.ai.glass</groupId>
    <artifactId>instructsdk</artifactId>
    <version>1.1.4</version>
    <type>pom</type>
  </dependency>
  ```



##### AndroidManifest.xml及Application配置

- 自定义application

  ```xml
      <application
          android:name=".application.InstructApplication"
          android:allowBackup="true"
          android:icon="@mipmap/ic_launcher"
          android:label="@string/app_name"
          android:roundIcon="@mipmap/ic_launcher_round"
          android:supportsRtl="true"
          android:theme="@style/AppTheme">
  ```

  

- 自定义application java文件中进行语音SDK初始化及全局指令设置：
	```java
	/**
	 * 设置ManagerBasicSkill的context
   */
	@Override
	public void onCreate() {
	    super.onCreate();
	    // 初始化语音指令SDK
	    VoiceInstruction.init(this);
	  
	    // 设置全局指令，无全局指令可以删掉下面的代码
	    // eg：”返回“指令
	    VoiceInstruction.getInstance().addGlobalInstruct(
	            new InstructEntity()
	                    .setGlobal(true)
	                    .setName("返回")
	                    .setPinYin("fan hui")
	                    .setCallback(new IInstructReceiver() {
	                        @Override
	                        public void onInstructReceive(Activity act, String key, InstructEntity instruct) {
	                            try {
	                                if (act != null) {
	                                    act.finish();
	                                }
	                            } catch (Exception e) {
	                                e.printStackTrace();
	                            }
	                        }
	                    })
	    );
	}
	```
	
	

##### App Activity中调用

- 基础Activity继承InstructionActivity.java：
  
  ```java
  public class HomeTestAct extends InstructionActivity {}
  ```
  **注：**如果不能直接继承InstructionActivity.java，则需要将InstructionActivity的内部方法调用实现在自己的BaseActivity中。
  
- 添加普通指令：
  
  ```java
  // 添加指令    
  @Override
  public InstructConfig configInstruct() {
      InstructConfig config = new InstructConfig();
      config.setActionKey(HomeTestAct.class.getName() + InstructConfig.ACTION_SUFFIX)
              .addInstructEntity(
                      new InstructEntity()
                              .setName("上一个")
                              .setShowTips(true)
                              .setCallback(new IInstructReceiver() {
                                  @Override
                                  public void onInstructReceive(Activity act, String key, InstructEntity instruct) {
                                      // 指令处理回调
                                      doLast();
                                  }
                              })
              )
              .addInstructEntity(
                      new InstructEntity()
                              .setName("下一个")
                              .setShowTips(true)
                              .setCallback(new IInstructReceiver() {
                                  @Override
                                  public void onInstructReceive(Activity act, String key, InstructEntity instruct) {
                                      // 指令处理回调
                                      doNext();
                                  }
                              })
              )
              .addInstructEntity(
                      new InstructEntity()
                              .setName("进入视频")
                              .setShowTips(true)
                              .setIgnoreHelp(true)
                              .setCallback(new IInstructReceiver() {
                                  @Override
                                  public void onInstructReceive(Activity act, String key, InstructEntity instruct) {
                                      // 指令处理回调
                                      openVideo();
                                  }
                              })
              );
  
      return config;
  }
  
  ```
  
- 指令拦截：
  
  ```java
  // HomeTestAct.java 中
  /**
   * 是否拦截处理当前语音指令，拦截后之前配置的指令闭包不会被调用
   * （可以用来提前处理一些指令，然后返回false）
   * @param command
   * @return true：拦截事件 false：不进行拦截
   */
  @Override
  public boolean doReceiveCommand(String command) {
      Log.d(TAG, "doReceiveCommand command = " + command);
  
      if ("进入视频".equals(command)) {
          return true;
      }
      return false;
  }
  
  ```
  
- 默认帮助相关指令：
  * 显示帮助
  * 关闭帮助

  无需用户添加，SDK会自动添加到指令集中



### 三、API参考

#### Activity中需要Override方法说明

##### Activity中关闭语音指令方法 (非必须Override)

  ```java
      /**
       * 是否关闭语音指令开关， 默认开启，继承可以选择关闭
       *
       * @return false:开启， true:关闭
       */
      @Override
      public boolean closeInstruction() {
          return false;
      }
  ```

##### Activity中 指令拦截方法 (必须Override)

  ```java
  /**
   * 是否拦截处理当前语音指令，拦截后之前配置的指令闭包不会被调用
   * （可以用来提前处理一些指令，然后返回false）
   * @param command
   * @return true：拦截事件 false：不进行拦截
   */
  public boolean doReceiveCommand(String command)
  ```


##### Activity中 配置指令方法, 返回 InstructConfig指令配置实体 (必须Override)

  ```java
  public InstructConfig configInstruct()
  ```

##### 指令相关浮条UI生成完毕，想要进行修改 (非必须Override)

  ```java
  // HomeTestAct.java 中
  /**
   * 插件浮层相关UI已经准备并添加到主View树完毕，可以进行UI相关修改
   */
  @Override
  public void onInstrucUiReady() {
      super.onInstrucUiReady();
  }
  ```

##### 指令帮助浮层UI生成完毕，想要进行修改 (非必须Override)

  ```java
  // HomeTestAct.java 中
  /**
   * 插件帮助UI已经准备并添加到主View树完毕，可以进行UI相关修改
   */
  @Override
  public void onInstrucHelpReady() {
      super.onInstrucHelpReady();
  }
  ```



#### InstructConfig.java 指令配置实体


##### setActionKey

  ```java
public InstructConfig setActionKey(String actionKey);
  ```
  作为指令命中广播的Action使用，必须保证唯一，推荐Activity类名 + InstructConfig.ACTION_SUFFIX。

参数：

  - actionKey ：String，指令命中广播的Action

  ```java
// eg:
InstructConfig config = new InstructConfig();
config.setActionKey(HomeTestAct.class.getName() + InstructConfig.ACTION_SUFFIX)
  ```

##### addInstructEntity

  ```java
public InstructConfig addInstructEntity(InstructEntity entity);
  ```
  向配置中添加离线语音指令。

参数：
  - entity ：InstructEntity，语音指令实体

  ```java
// eg:
InstructConfig config = new InstructConfig();
config.addInstructEntity(
        new InstructEntity()
                .setName("确认")
                .setShowTips(true)
                .setIgnoreHelp(true)
                .setCallback(new IInstructReceiver() {
                    @Override
                    public void onInstructReceive(Activity act, String key, InstructEntity instruct) {
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                Toast.makeText(HomeTestAct.this, "确认", Toast.LENGTH_SHORT).show();
                            }
                        });
                    }
                })
)
  ```

##### addInstructList

  ```java
public InstructConfig addInstructList(List<InstructEntity> instructList);
  ```
  向配置中添加离线语音指令组。

参数：
  - instructList ：List<InstructEntity>，语音指令组

  ```java
// eg:
InstructConfig config = new InstructConfig();
config.addInstructList(NumberTypeControler.doTypeControl("第", 3, 20, "页", "第3/4/5...19/20页", new NumberTypeControler.NumberTypeCallBack() {
            @Override
            public void onInstructReceive(Activity act, String key, int number, InstructEntity instruct) {
                Log.d(TAG, "AudioAi Number onInstructReceive command = " + key + ", number = " + number);
            }
        }));
  ```

##### setIgnoreGlobal

  ```java
public void setIgnoreGlobal(boolean ignoreGlobal);
  ```
  控制当前页面是否忽略所有全局指令。

参数：
  - ignoreGlobal ：boolean，ture - 忽略所有全局指令、false - 不忽略所有全局指令

  ```java
  // eg:
  InstructConfig config = new InstructConfig();
  config.setIgnoreGlobal(true);
  ```

##### 其他

  具体看InstructConfig中方法实现。



#### InstructEntity.java 指令实体

##### 属性定义
| 属性| 类型 |含义|
|----|---|---|
| name | String | 指令名称，不能为空 |
| type | String | 指令类型，默认为空 |
| pinYin | String | 指令拼音，小写，单词之间为一个空格，会根据name自动生成，也可以自己指定。eg：指令”看书“ ，拼音为”kan shu“。 |
| margins | float | 指令语音幅值，无需设置 |
| global | boolean | 是否是全局指令，全局指令需要设定 |
| showTips | boolean | 是否展示在指令提示浮条中，展示的需要设定 |
| ignoreHelp | boolean | 是否不再帮助浮层中显示指令默认信息，不展示需要设置 |
| ignoreSoundEffect | boolean | 是否忽略命中后发出的音效 |
| helpContent | String | 提示文字，默认为指令name，如果设置，以此为高优先级 |
| other | Object | 指令其他数据，需要指令附带一些数据可以利用这个属性 |
| callback | IInstructReceiver | 指令回调闭包，void onInstructReceive(Activity act, String key, InstructEntity instruct); |

##### 方法定义
以上属性均支持getter、setter方式调用



#### IInstructReceiver.java 指令触发回调方法实体

##### onInstructReceive

  ```java
void onInstructReceive(Activity act, String key, InstructEntity instruct);
  ```
InstructEntity callback指令回调闭包，指令触发时，若无在
*public boolean doReceiveCommand(String command)* 
方法中进行拦截，处理线程会自动调用此方法进行指令处理。
方法运行在BroadcastReceiver主线程中

参数：
  - act ：Activity，回调的Activity实体
  - key ：String，指令key 即InstructEntity 的 name 属性
  - instruct ：InstructEntity，指令实体

  ```java
// eg：
InstructConfig config = new InstructConfig();
config.addInstructEntity(
        new InstructEntity()
                .setName("确认")
                .setShowTips(true)
                .setIgnoreHelp(true)
                .setCallback(new IInstructReceiver() {
                    @Override
                    public void onInstructReceive(Activity act, String key, InstructEntity instruct) {
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                Toast.makeText(HomeTestAct.this, "确认", Toast.LENGTH_SHORT).show();
                            }
                        });
                    }
                })
)
  ```

