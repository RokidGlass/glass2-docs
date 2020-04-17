# Glass 语音离线指令 SDK
**Version: 1.3.4**  



## 一. 离线指令SDK概述

Rokid 离线语音指令SDK 开发工具，方便开发配合Rokid语音助手一起使用的离线语音指令。指令触发需要用户打开眼镜设备''设置''中''语音助手激活''开关，另外语音指令对网络环境没有要求，在离线/在线环境下都可以使用。

附：语音助手RokidAiSdk需要v2.2.1版本及以上。

  ```shell
  // 语音助手RokidAiSdk版本查看方式
  adb shell dumpsys package com.rokid.ai.glassaudio
  ```


接口使用示例demo：

https://github.com/RokidGlass/Rokid_APG_VoiceInstructDemo


## 二. 集成说明

### 2.1、 添加三方依赖库

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
      implementation 'com.rokid.ai.glass:instructsdk:1.3.4'
  }
  ```
- Jcenter Maven信息

  ```xml
  <dependency>
    <groupId>com.rokid.ai.glass</groupId>
    <artifactId>instructsdk</artifactId>
    <version>1.3.4</version>
    <type>pom</type>
  </dependency>
  ```

- 修改时间
  2020年04月2日18:00


### 2.2、 AndroidManifest.xml及Application配置

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
                      .addEntityKey(new EntityKey("返回", "fan hui"))
                      .addEntityKey(new EntityKey(EntityKey.Language.en, "back last page"))
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
	
	

### 2.3、 App Activity中调用

#### 2.3.1、基础Activity继承InstructionActivity.java：
  
  ```java
  public class HomeTestAct extends InstructionActivity {}
  ```
  **注：**如果不能直接继承InstructionActivity.java，则需要将InstructionActivity的内部方法调用实现在自己的BaseActivity中。
  
#### 2.3.2、添加普通指令：
  
  ```java
  // 添加指令    
  @Override
  public InstructConfig configInstruct() {
      InstructConfig config = new InstructConfig();
      config.setActionKey(HomeTestAct.class.getName() + InstructConfig.ACTION_SUFFIX)
              .addInstructEntity(
                      new InstructEntity()
                              .addEntityKey(new EntityKey("上一个", null))
                              .addEntityKey(new EntityKey(EntityKey.Language.en, "last one"))
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
                              .addEntityKey(new EntityKey("下一个", null))
                              .addEntityKey(new EntityKey(EntityKey.Language.en, "next one"))
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
                              .addEntityKey(new EntityKey("进入视频", null))
                              .addEntityKey(new EntityKey(EntityKey.Language.en, "open video"))
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
  
#### 2.3.3、指令拦截：
  
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
  
#### 2.3.4、默认帮助相关指令：
  * zh: 显示帮助  en: show help
  * zh: 关闭帮助  en: close help

  无需用户添加，语言助手会自动添加到系统指令集中

#### 2.3.5、指令拼音设置：
  * sdk中会对中文指令名做默认的拼音转化，但是针对部分多音字，更确切的读音需要用户自己设置
  * eg：重心、重复
  
  ```java
  // 添加指令    
  @Override
  public InstructConfig configInstruct() {
      InstructConfig config = new InstructConfig();
      config.setActionKey(HomeTestAct.class.getName() + InstructConfig.ACTION_SUFFIX)
              .addInstructEntity(
                      new InstructEntity()
                              .addEntityKey(new EntityKey("重心", "zhong xin"))
                              .addEntityKey(new EntityKey(EntityKey.Language.en, "Gravity Center"))
                              .setShowTips(true)
                              .setCallback(new IInstructReceiver() {
                                  @Override
                                  public void onInstructReceive(Activity act, String key, InstructEntity instruct) {
                                      // 指令处理回调
                                  }
                              })
              )
              .addInstructEntity(
                      new InstructEntity()
                              .addEntityKey(new EntityKey("重复", "chong fu"))
                              .addEntityKey(new EntityKey(EntityKey.Language.en, "repeat"))
                              .setShowTips(true)
                              .setCallback(new IInstructReceiver() {
                                  @Override
                                  public void onInstructReceive(Activity act, String key, InstructEntity instruct) {
                                      // 指令处理回调
                                  }
                              })
              );
  
      return config;
  }
  
  ```

#### 2.3.6、动态设置指令说明：
默认的指令会在Activity onCreate() 时全部配置好，UI相关会在onStart()时生成，onResume()时会将指令设置到语音助手，onPause()时会将指令从语音助手中移除。

如果指令需要异步数据才能生成，生成后可以使用 InstructionManager对象的sendWtWords()进行指令设置。

tips UI可以使用 InstructionManager对象的setTipsContent(String content)方法来设置显示内容

#### 2.3.7、系统指令说明：
Rokid Glass 二代系统中，默认设置了一些系统指令，在每个页面都可以使用。
* zh：回到桌面 en：Navigate Home
  * 功能：跳转到Launcher app页面，并关闭(finish)当前app的当前Activity；
  * 注意：并不会直接kill掉调用app的进程，如果需要对App进程进行清除，请通过指令拦截来特殊处理。
* zh：回到上一级 en：Navigate Back
  * 功能：返回上一个Activity页面，并关闭(finish)当前当前Activity；
* zh：显示帮助 en: show help
  * 功能：弹出语音指令词帮助浮窗；
  * 注意：系统指令，全局类型
* zh：关闭帮助 en: close help
  * 功能：关闭语音指令词帮助浮窗；
  * 注意：系统指令，全局类型
* zh：大点声 en: Volume Up
  * 功能：音量调高一档；
  * 注意：系统指令，全局类型
* zh：小点声 en: Volume Down
  * 功能：音量调低一档；
  * 注意：系统指令，全局类型
* zh：增强亮度 en: Brightness Up
  * 功能：亮度调高一档；
  * 注意：系统指令，全局类型
* zh：降低亮度 en: Brightness Down
  * 功能：亮度调低一档；
  * 注意：系统指令，全局类型

## 三、API参考

### 3.1、VoiceInstruction中公共方法说明

#### 3.1.1、VoiceInstruction中初始化 (必须在客户端的Application中调用)

  ```java
      /**
       * 是否关闭语音指令开关， 默认开启，继承可以选择关闭
       *
       * @param appContext Application级别Context
       */
      @Override
      public static void init(Context appContext) {
      }
  ```

#### 3.1.2、VoiceInstruction中根据解决方案重启语音助手服务 (SDK 1.1.5及以上版本，语音助手RokidAiSdk 2.0.5版本及以上可用，中文环境使用)

  ```java
    /**
    * 根据解决方案重启语音助手服务
    *
    * @param context Activity级别的Context
    * @param mustRestart true：强制重启  false：如果语音助手使用的正式当前解决方案，则不必重启（默认推荐false）
    * @param configAllUseSolution true：所有配置全部使用解决方案的 false：素有配置使用系统默认和解决方案混合（默认推荐false）
    * @param notifyRealRestart    true：真正重启才触发后续的指令词设置 false：只要有广播返回就触发后续的指令词设置（默认推荐false）
    * @param instructionManager InstructionManager 重启后使当前页面指令配置生效，如没有指令配置或后续自己单独配置，可以直接传null
    */
    public static void restartVoiceServer(Context context, boolean mustRestart, boolean configAllUseSolution, final boolean notifyRealRestart, final InstructionManager instructionManager) {
    }
  ```

#### 3.1.3、恢复标准模型配置

  ```java
    /**
    * 重启语音助手服务以恢复标准模型配置
    *
    * @param context
    */
    public static void recoveryVoiceServer(Context context) {
    }
  ```

#### 3.1.4、添加全局指令

  ```java
      /**
       * 添加全局指令配置
       *
       * @param entity InstructEntity实体
       * @return
       */
      public VoiceInstruction addGlobalInstruct(InstructEntity entity){
      }
  ```

#### 3.1.5、去除全局指令

  ```java
      /**
       * 清除某个全局指令配置
       *
       * @param entity InstructEntity实体
       * @return
       */
      public VoiceInstruction removeGlobalInstruct(InstructEntity entity){
      }
  ```


### 3.2、Activity中需要Override方法说明

#### 3.2.1、Activity中关闭语音指令方法 (非必须Override)

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

#### 3.2.2、Activity中 指令拦截方法 (必须Override)

  ```java
  /**
   * 是否拦截处理当前语音指令，拦截后之前配置的指令闭包不会被调用
   * （可以用来提前处理一些指令，然后返回false）
   * @param command
   * @return true：拦截事件 false：不进行拦截
   */
  public boolean doReceiveCommand(String command)
  ```


#### 3.2.3、Activity中 配置指令方法, 返回 InstructConfig指令配置实体 (必须Override)

  ```java
  public InstructConfig configInstruct()
  ```

#### 3.2.4、指令相关浮条UI生成完毕，想要进行修改 (非必须Override)

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

#### 3.2.5、指令帮助浮层UI生成完毕，想要进行修改 (非必须Override)

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


### 3.3、InstructConfig.java 指令配置实体


#### 3.3.1、setActionKey

  ```java
public InstructConfig setActionKey(String actionKey);
  ```
  作为指令命中广播的Action使用，必须保证唯一，推荐Activity类名 + InstructConfig.ACTION_SUFFIX。

参数：

  actionKey ：String，指令命中广播的Action

  ```java
// eg:
InstructConfig config = new InstructConfig();
config.setActionKey(HomeTestAct.class.getName() + InstructConfig.ACTION_SUFFIX)
  ```

#### 3.3.2、addInstructEntity

  ```java
public InstructConfig addInstructEntity(InstructEntity entity);
  ```
  向配置中添加离线语音指令。

参数：

  entity ：InstructEntity，语音指令实体

  ```java
// eg:
InstructConfig config = new InstructConfig();
config.addInstructEntity(
        new InstructEntity()
                .addEntityKey(new EntityKey("确认", "que ren"))
                .addEntityKey(new EntityKey(EntityKey.Language.en, "make sure"))
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

#### 3.3.3、addInstructList

  ```java
public InstructConfig addInstructList(List<InstructEntity> instructList);
  ```
  向配置中添加离线语音指令组。

参数：

  instructList ：List<InstructEntity>，语音指令组

  ```java
// eg:
InstructConfig config = new InstructConfig();
config.addInstructList(NumberTypeControler.doTypeControl(3, 20,
              new NumberTypeControler.NumberTypeCallBack() {
                  @Override
                  public void onInstructReceive(Activity act, String key, int number, InstructEntity instruct) {
                      Log.d(TAG, "AudioAi Number onInstructReceive command = " + key + ", number = " + number);
                  }
              },
              new NumberKey(EntityKey.Language.zh, "第", "页", "可以说第3/4.../20页"),
              new NumberKey(EntityKey.Language.en, "the", "page", "the 3/4.../20 page")
              )
      );
  ```

#### 3.3.4、setIgnoreGlobal

  ```java
public void setIgnoreGlobal(boolean ignoreGlobal);
  ```
  控制当前页面是否忽略所有全局指令。

参数：

  ignoreGlobal ：boolean，ture - 忽略所有全局指令、false - 不忽略所有全局指令

  ```java
  // eg:
  InstructConfig config = new InstructConfig();
  config.setIgnoreGlobal(true);
  ```

#### 3.3.5、setIgnoreSystem

  ```java
public void setIgnoreSystem(boolean ignoreSystem);
  ```
  控制当前页面是否忽略所有系统指令。

参数：

  ignoreGlobal ：boolean，ture - 忽略所有系统指令、false - 不忽略所有系统指令

  ```java
  // eg:
  InstructConfig config = new InstructConfig();
  config.setIgnoreSystem(true);
  ```


#### 3.3.6、其他

  具体看InstructConfig中方法实现。



### 3.4、InstructEntity.java 指令实体

#### 3.4.1、属性定义
| 属性| 类型 |含义|
|----|---|---|
| keyMap | Map (EntityKey.Language, EntityKey) | 指令的识别key map，会根据系统语言来确定当前使用的EntityKey， 当前语音找不到对应的Key值时，使用中文zh 的 EntityKey |
| global | boolean | 是否是全局指令，全局指令需要设定 |
| showTips | boolean | 是否展示在指令提示浮条中，展示的需要设定 |
| ignoreHelp | boolean | 是否不再帮助浮层中显示指令默认信息，不展示需要设置 |
| ignoreSoundEffect | boolean | 是否忽略命中后发出的音效 |
| ignoreToast | boolean | 是否忽略命中后显示的Toast内容提示 |
| callback | IInstructReceiver | 指令回调闭包，void onInstructReceive(Activity act, String key, InstructEntity instruct); |

#### 3.4.2、方法定义
以上属性均支持getter、setter方式调用 

keyMap 支持 添加、查找、删除 EntityKey 操作

```java

    /**
     * 根据语言来查询对应的指令key
     * 
     * @param language EntityKey.Language 查询语言
     * @return EntityKey 指令key
     */
    public EntityKey getEntityKey(EntityKey.Language language);

        /**
     * 添加EntityKey到keyMap
     * 
     * @param key EntityKey
     * @return InstructEntity
     */
    public InstructEntity addEntityKey(EntityKey key);

    /**
     * 根据语言来删除对应的指令key
     *
     * @param language EntityKey.Language 查询语言
     * @return InstructEntity 指令key
     */
    public InstructEntity removeEntityKey(EntityKey.Language language);

```

#### 3.4.3、EntityKey.java 指令key定义
| 属性| 类型 |含义|
|----|---|---|
| language | EntityKey.Language | EntityKey 语言类型，不能为空，zh为中文、en为英文 |
| name | String | EntityKey名称，不能为空 |
| pinYin | String | EntityKey拼音，小写，单词之间为一个空格，会根据name自动生成，也可以自己指定。eg：指令”看书“ ，拼音为”kan shu“。 |
| margins | float | EntityKey语音幅值，无需设置 |
| other | Object | EntityKey其他数据，需要指令附带一些数据可以利用这个属性 |
| helpContent | String | EntityKey提示文字，默认为EntityKey name，如果设置，以此为高优先级 |

#### 3.4.4、EntityKey.java 方法定义
EntityKey 以上属性均支持getter、setter方式调用

EntityKey 构造函数：
  
```java

    /**
     * 创建制定语言的EntityKey
     * 
     * @param language EntityKey.Language 语言类型
     * @param name EntityKey名称，不能为空
     */
    public EntityKey(Language language, String name);

    /**
     * 创建中文的EntityKey
     *
     * @param name EntityKey名称
     * @param pinYin EntityKey拼音，小写，单词之间为一个空格，会根据name自动生成，也可以自己指定。
     */
    public EntityKey(String name, String pinYin);


```



### 3.5、IInstructReceiver.java 指令触发回调方法实体

#### 3.5.1、onInstructReceive

  ```java
void onInstructReceive(Activity act, String key, InstructEntity instruct);
  ```
InstructEntity callback指令回调闭包，指令触发时，若无在
*public boolean doReceiveCommand(String command)* 
方法中进行拦截，处理线程会自动调用此方法进行指令处理。
方法运行在BroadcastReceiver主线程中

参数：

  act ：Activity，回调的Activity实体

  key ：String，指令key 即InstructEntity 的 name 属性

  instruct ：InstructEntity，指令实体
  
  ```java
// eg：
InstructConfig config = new InstructConfig();
config.addInstructEntity(
        new InstructEntity()
                .addEntityKey(new EntityKey("确认", "que ren"))
                .addEntityKey(new EntityKey(EntityKey.Language.en, "make sure"))
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

### 3.6、InstructionManager.java 语音指令管理实体

#### 3.6.1、InstructionManager实例获取
InstructionManager 实例会在客户端Activity继承的InstructionActivity中生成：
可以直接通过mInstructionManager来调用
  ```java
  public abstract class InstructionActivity extends Activity implements IInstruction{

      protected InstructionManager mInstructionManager;

      @Override
      protected void onCreate(Bundle savedInstanceState) {
          super.onCreate(savedInstanceState);
          mInstructionManager = new InstructionManager(this, closeInstruction(), configInstruct(), mInstructionListener);
      }
  }
  ```

#### 3.6.2、setTipsContent 设置tips显示文案

  ```java
  public void setTipsContent(String content);
  ```
  设置tips条显示的指令提示内容。

参数：

  content ：String，tips显示文案

  ```java
// eg:
  if (mInstructionManager != null) {
      mInstructionManager.setTipsContent("开始播放/停止播放/回到首页");
  }
  ```

#### 3.6.3、showHelpLayer 显示帮助浮层

  ```java
  public void showHelpLayer();
  ```
  设置显示帮助浮层。

  ```java
// eg:
  if (mInstructionManager != null) {
      mInstructionManager.showHelpLayer();
  }
  ```

#### 3.6.4、hideHelpLayer 关闭帮助浮层

  ```java
  public void hideHelpLayer();
  ```
  设置关闭帮助浮层。

  ```java
// eg:
  if (mInstructionManager != null) {
      mInstructionManager.hideHelpLayer();
  }
  ```

#### 3.6.5、showTipsLayer 显示tips浮层

  ```java
  public void showTipsLayer();
  ```
  设置显示tips浮层。

  ```java
// eg:
  if (mInstructionManager != null) {
      mInstructionManager.showTipsLayer();
  }
  ```

#### 3.6.6、hideTipsLayer 关闭tips浮层

  ```java
  public void hideTipsLayer();
  ```
  设置关闭tips浮层。

  ```java
// eg:
  if (mInstructionManager != null) {
      mInstructionManager.hideTipsLayer();
  }
  ```

#### 3.6.7、setMenuShowing 设置是否显示tip条中的"显示菜单"字样

  ```java
  public void setMenuShowing(boolean showing);
  ```
  设置是否显示tip条中的"显示菜单"字样。建议在InstructionActivity的onInstrucUiReady()方法中调用

参数：

  showing ：boolean，true 显示，false 不显示

  ```java
// eg:
  if (mInstructionManager != null) {
      mInstructionManager.setMenuShowing(false);
  }
  ```

#### 3.6.8、isHelpLayerShowing 帮助浮层是否正在展示

  ```java
  public boolean isHelpLayerShowing();
  ```
  帮助浮层是否正在展示， true 展示，false 未展示。


#### 3.6.9、sendWtWords 将指令词设置到语音助手

  ```java
  public void sendWtWords();
  ```
  将指令词设置到语音助手，在InstructionActivity的onResume()方法中会默认调用，客户端也可以修改InstructConfig后，单独调用此方法再次设置语音指令。

  ```java
// eg:
  if (mInstructionManager != null) {
      mInstructionManager.removeInstruct(EntityKey.Language.zh, "开始播放");
      mInstructionManager.sendWtWords();
  }
  ```

#### 3.6.10、clearWtWords 清除语音助手当前所有语音指令

  ```java
  public void clearWtWords();
  ```
  清除语音助手当前所有语音指令。

  ```java
// eg:
  if (mInstructionManager != null) {
      mInstructionManager.clearWtWords();
  }
  ```

#### 3.6.11、getInstructConfig 获取当前页面指令配置

  ```java
  public InstructConfig getInstructConfig();
  ```
  获取当前页面指令配置。


#### 3.6.12、setInstructConfig 设置当前页面的指令配置

  ```java
  public void setInstructConfig(InstructConfig instructConfig);
  ```
  设置当前页面的指令配置，需要动态设置指令时使用。

参数：

  instructConfig ：InstructConfig，指令配置实体类

  ```java
// eg:
  if (mInstructionManager != null) {
      mInstructionManager.setInstructConfig(instructConfig);
  }
  ```

#### 3.6.13、addInstructList 成组添加语音指令

  ```java
  public void addInstructList(List<InstructEntity> instructList);
  ```
  成组添加语音指令

参数：

  showinstructListing ：List<InstructEntity>，list指令组

  ```java
// eg:
  if (mInstructionManager != null) {
      mInstructionManager.addInstructList(instructList);
  }
  ```

#### 3.6.14、addInstructEntity 单个添加语音指令

  ```java
  public void addInstructEntity(InstructEntity entity);
  ```
  单个添加语音指令

参数：

  entity ：InstructEntity，单个语音指令实例

  ```java
// eg:
  if (mInstructionManager != null) {
      mInstructionManager.addInstructEntity(entity);
  }
  ```

#### 3.6.15、clearUserInstruct 清除用户级指令

  ```java
  public void clearUserInstruct();
  ```
  清除用户级指令，单独清除sdk端的指令配置，会在下次onResume()时生效，如需立即生效，需要调用InstructionManager的sendWtWords()方法。

  ```java
// eg:
  if (mInstructionManager != null) {
      mInstructionManager.clearUserInstruct();

      mInstructionManager.sendWtWords();
  }
  ```

#### 3.6.16、clearGlobalInstruct 清除用户级指令

  ```java
  public void clearGlobalInstruct();
  ```
  清除全局级指令，单独清除sdk端的指令配置，会在下次onResume()时生效，如需立即生效，需要调用InstructionManager的sendWtWords()方法。

  ```java
// eg:
  if (mInstructionManager != null) {
      mInstructionManager.clearGlobalInstruct();

      mInstructionManager.sendWtWords();
  }
  ```

#### 3.6.17、clearAllInstruct 清除用户级指令

  ```java
  public void clearAllInstruct();
  ```
  清除全部语音指令，单独清除sdk端的指令配置，会在下次onResume()时生效，如需立即生效，需要调用InstructionManager的sendWtWords()方法。

  ```java
// eg:
  if (mInstructionManager != null) {
      mInstructionManager.clearAllInstruct();

      mInstructionManager.sendWtWords();
  }
  ```


#### 3.6.18、getInstructByName 通过指令名称来获取指令实体

  ```java
  public InstructEntity getInstructByName(EntityKey.Language language, String name);
  ```
  通过指令名称来获取指令实体

参数：

  language : EntityKey.Language 语言类型
  name ：String，指令名称
  return InstructEntity 指令实体

  ```java
// eg:
  if (mInstructionManager != null) {
      mInstructionManager.getInstructByName(EntityKey.Language.zh, "开始播放");
  }
  ```

#### 3.6.19、removeInstruct 清除单个指令

  ```java
  public boolean removeInstruct(EntityKey.Language language, String name);
  ```
  通过指令名称清除单个指令，单独清除sdk端的指令配置，会在下次onResume()时生效，如需立即生效，需要调用InstructionManager的sendWtWords()方法。

参数：

  language : EntityKey.Language 语言类型
  name ：String，指令名称
  return true，成功，false 清除失败或指令组中没有当前名称指令

  ```java
// eg:
  if (mInstructionManager != null) {
      mInstructionManager.removeInstruct(EntityKey.Language.zh, "开始播放");
  }
  ```

### 3.6、连续数字相关指令

#### 3.6.1、NumberTypeControler 连续数字指令使用

  ```java
public static List<InstructEntity> doTypeControl(int startNumber, int endNumber, NumberTypeCallBack cb, NumberKey... keyList)
  ```

通过给定的数字指令配置，返回成组的数字指令实体InstructEntity，并衔接好指令触发后的CallBack处理。

参数：

  startNumber ：int，初始的数字

  endNumber ：int，结束的数字

  cb ：NumberTypeCallBack，指令触发后的处理实体

  keyList ：NumberKey，中文、英文及其他文字的指令实体EntityKey
  
  ```java
// eg：
InstructConfig config = new InstructConfig();
config.addInstructList(NumberTypeControler.doTypeControl(3, 20,
              new NumberTypeControler.NumberTypeCallBack() {
                  @Override
                  public void onInstructReceive(Activity act, String key, int number, InstructEntity instruct) {
                      Log.d(TAG, "AudioAi Number onInstructReceive command = " + key + ", number = " + number);
                  }
              },
              new NumberKey(EntityKey.Language.zh, "第", "页", "可以说第3/4.../20页"),
              new NumberKey(EntityKey.Language.en, "the", "page", "the 3/4.../20 page")
              )
      );
  ```

#### 3.6.2、NumberKey 数字指令实体EntityKey

  ```java
public NumberKey(EntityKey.Language language, String prefix, String subfix, String helpContent)
  ```

数字指令实体EntityKey。

参数：

  language ：EntityKey.Language，语言类型

  prefix ：String，数字指令前缀，eg“第二页”的“第”

  subfix ：String，数字指令后缀，eg“第二页”的“页”

  helpContent ：String，帮助提示，eg“可以说第...页”
