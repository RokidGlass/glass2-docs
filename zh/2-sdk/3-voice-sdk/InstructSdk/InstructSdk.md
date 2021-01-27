# Glass 语音离线指令 SDK
**Version: 1.5.8**  



## 一. 离线指令SDK概述

Rokid 离线语音指令SDK 开发工具，方便开发配合Rokid语音助手一起使用的离线语音指令。
* 语音指令触发需要用户打开眼镜设备''设置''中''语音助手激活''开关，另外语音指令对网络环境没有要求，在离线/在线环境下都可以使用。
* 语音指令需要依附Activity的生命周期，指令设置在整个Activity内适用，目前不支持独自Fragment、dialog设置独立指令组。
* 语音指令以当前系统语音为语言基础选定指令语言类型，如果没有与当前系统语言对应的语言类型指令，会选取中文zh为默认语言类型指令。



附：语音助手RokidAiSdk需要v2.2.1版本及以上。

  ```shell
  // 语音助手RokidAiSdk版本查看方式
  adb shell dumpsys package com.rokid.ai.glassaudio
  ```


插件使用示例Demo：

https://github.com/RokidGlass/Rokid_APG_VoiceInstructDemo

### 1.1 使用时注意事项

#### 1.1.1 插件使用注意事项
- 针对需要给Fragment、dialog设置独立指令的场景，建议使用LifeCycle方式；
- 使用中文指令时，尽量明确指定指令词的拼音；
- 在中文指令场景时，指令词的name不要设置成其他语言类型的文字；
- 涉及到需要proguard的app应用，可以参考示例demo中的proguard文件；

#### 1.1.2 中文指令词定义规则
- 发音
  1. 避免包含叠词，多个同音字的指令词，如：小鹿贝贝、巴巴爸爸等；
  2. 同一个场景的指令词，不要存在包含关系，如：录像和开始录像；


- 字数
  1. 指令的字数在2~10字之间；
  2. 全局指令需为4字及以上指令；


- 数量
  1. 全局指令数量建议不超过8个；
  2. 应用级指令尽量减少2字、3字指令使用，占比不超过总指令数的20%；
  3. 全局+局部指令最多的页面，指令数量加起来不超过20个；


## 二. 集成说明

### 2.1 添加三方依赖库

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
      implementation 'com.rokid.ai.glass:instructsdk:1.5.8'
  }
  ```
- Jcenter Maven信息

  ```xml
  <dependency>
    <groupId>com.rokid.ai.glass</groupId>
    <artifactId>instructsdk</artifactId>
    <version>1.5.8</version>
    <type>pom</type>
  </dependency>
  ```

- 修改时间
  2020年12月10日


### 2.2 AndroidManifest.xml及Application配置

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

  

- 自定义application java文件中进行语音SDK初始化及全局指令设置

```java
public class InstructApplication extends Application {

    @Override
    public void onCreate() {
        super.onCreate();
        // 初始化语音指令SDK，App运行时默认关闭百灵鸟 
  	    VoiceInstruction.init(this);
        // 或者使用下面的，插件与百灵鸟混合模式
  	    // VoiceInstruction.init(this, false);


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
    }
}

```

语音指令支持三种使用方式：
1. 通过InstructLifeManager使用LifeCycle方式；（推荐）
2. 直接继承InstructionActivity方式；
3. 模仿InstructionActivity方式；


### 2.3 通过InstructLifeManager使用LifeCycle方式（推荐）

说明：这种使用方式需要给InstructLifeManager提供一个LifeCycle的入参对象，指令的生命周期以此LifeCycle为主；当Context不是Activity类型实例时，页面不会展示tips浮条。

#### 2.3.1 InstructLifeManager初始化

  ```java 
  /**
  * InstructLifeManager 初始化函数
  * @param context Context 实例，当Context不是Activity类型实例时，页面不会展示tips浮条
  * @param lifecycle android.arch.lifecycle.Lifecycle 实例
  * @param lifeListener IInstructLifeListener 回调监听实例
  */
 public InstructLifeManager(Context context, Lifecycle lifecycle, IInstructLifeListener lifeListener)
  ```

#### 2.3.2 IInstructLifeListener回调

  ```java
    /**
   * InstructLifeManager 一些回调监听
   */
  public interface IInstructLifeListener {
      /**
       * 指令处理拦截
       *
       * @param command
       * @return
       */
      boolean onInterceptCommand(String command);

      /**
       * tips ui 准备完毕回调
       */
      void onTipsUiReady();

      /**
       * 帮助浮层显隐
       *
       * @param show true， 显示；false，隐藏
       */
      void onHelpLayerShow(boolean show);
  }
  ```

#### 2.3.2 InstructLifeManager使用

  ```java

public class BasicEasyAct extends AppCompatActivity {

    private static final String TAG = BasicEasyAct.class.getSimpleName();

    private InstructLifeManager mLifeManager;


    @Override
    public void onCreate(@Nullable Bundle savedInstanceState, @Nullable PersistableBundle persistentState) {
        super.onCreate(savedInstanceState, persistentState);
    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_basic_easy);
        configInstruct();
    }

    public void configInstruct() {
        mLifeManager = new InstructLifeManager(this, getLifecycle(), mInstructLifeListener);
        mLifeManager.addInstructEntity(
                new InstructEntity()
                        .addEntityKey(new EntityKey("上一个", null))
                        .addEntityKey(new EntityKey(EntityKey.Language.en, "last one"))
                        .setShowTips(true)
                        .setCallback(new IInstructReceiver() {
                            @Override
                            public void onInstructReceive(Activity act, String key, InstructEntity instruct) {
                                Log.d(TAG, "上一个 触发 ");
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
                                        Log.d(TAG, "下一个 触发 ");
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
                                        Log.d(TAG, "进入视频 触发 ");
                                    }
                                })
                );
    }

    private InstructLifeManager.IInstructLifeListener mInstructLifeListener = new InstructLifeManager.IInstructLifeListener() {
        @Override
        public boolean onInterceptCommand(String command) {
            if ("需要拦截的指令".equals(command)) {
                return true;
            }
            return false;
        }

        @Override
        public void onTipsUiReady() {
            Log.d("AudioAi", "onTipsUiReady Call ");
        }

        @Override
        public void onHelpLayerShow(boolean show) {

        }
    };

    @Override
    protected void onDestroy() {
        super.onDestroy();
    }
}

  ```


### 2.4  直接继承InstructionActivity方式

说明：这种方式的Activity必须继承InstructionActivity，InstructionActivity继承基本的Activity。

#### 2.4.1 Activity继承InstructionActivity.java
  
  ```java
  public class HomeTestAct extends InstructionActivity {}
  ```
  
#### 2.4.2 添加普通指令
  
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
  
#### 2.4.3 指令拦截
  
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
  
      if ("需要拦截的指令".equals(command)) {
          return true;
      }
      return false;
  }
  
  ```

#### 2.4.4 Activity中关闭语音指令方法 (非必须Override)

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

#### 2.4.5 Activity中 配置指令方法, 返回 InstructConfig指令配置实体 (必须Override)

  ```java
  public InstructConfig configInstruct()
  ```

#### 2.4.6 指令相关浮条UI生成完毕，想要进行修改 (非必须Override)

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

  
### 2.5 模仿InstructionActivity方式

说明：此种方式适合有自己的基础BasicActivity，无法直接继承InstructionActivity的场景，其他使用与直接继承InstructionActivity方式相同。

#### 2.5.1 模仿实现InstructionActivity

  ```java

public abstract class BasicInstructionActivity extends BasicActivity[App自己的基础Activity] implements IInstruction{

    protected InstructionManager mInstructionManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mInstructionManager = new InstructionManager(this, closeInstruction(), configInstruct(), mInstructionListener);
    }

    protected InstructionManager.IInstructionListener mInstructionListener = new InstructionManager.IInstructionListener() {
        @Override
        public boolean onReceiveCommand(String command) {
            return doReceiveCommand(command);
        }

        @Override
        public void onHelpLayerShow(boolean show) {
            onHelpLayerShowed(show);
        }
    };


    @Override
    protected void onStart() {
        super.onStart();
        if (mInstructionManager != null) {
            mInstructionManager.onStart();
        }

    }

    @Override
    protected void onResume() {
        if (mInstructionManager != null) {
            mInstructionManager.onResume();
        }
        super.onResume();
    }

    @Override
    protected void onPause() {
        if (mInstructionManager != null) {
            mInstructionManager.onPause();
        }
        super.onPause();
    }

    @Override
    protected void onDestroy() {
        if (mInstructionManager != null) {
            mInstructionManager.onDestroy();
            mInstructionManager = null;
        }
        super.onDestroy();
    }

    /**
     * 是否关闭语音指令开关， 默认开启，继承可以选择关闭
     *
     * @return false:开启， true:关闭
     */
    @Override
    public boolean closeInstruction() {
        return false;
    }

    /**
     * 插件浮层相关UI已经准备并添加到主View树完毕，可以进行UI相关修改
     */
    @Override
    public void onInstrucUiReady() {

    }

    /**
     * 帮助浮层显隐
     *
     * @param show true， 显示；false，隐藏
     */
    public void onHelpLayerShowed(boolean show) {

    }

    /**
     * 获取语音指令配置
     *
     * @return
     */
    @Override
    public abstract InstructConfig configInstruct();

    /**
     * 是否拦截处理当前语音指令，拦截后之前配置的指令闭包不会被调用
     * （可以用来提前处理一些指令，然后返回false）
     * @param command
     * @return true：拦截事件 false：不进行拦截
     */
    @Override
    public abstract boolean doReceiveCommand(String command);
}

  ```

### 2.6 其他公共示例

#### 2.6.1 指令拼音设置

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

#### 2.6.2 动态设置指令说明

1. 默认的指令会在Activity onCreate() 时全部配置好，Tips UI相关会在onStart()时生成，onResume()时会将指令设置到语音助手，onPause()时会将指令从语音助手中移除；
2. 如果指令需要异步数据才能生成，生成后可以使用 InstructLifeManager 或 InstructionManager对象的sendWtWords()进行指令设置；
3. Tips UI可以使用 InstructionManager对象的setTipsContent(String content)方法来设置显示内容；
4. Tips UI根据指令自动生成只会在Activity初次设置指令时生效，UI准备完毕会回调 onInstrucUiReady()（集成InstructionActivity方式） 或 onTipsUiReady()（LifeCycle方式）方法。再次设置UI不会动态变化，需要用户手动调用setTipsContent(String content)方法来设置显示内容；

#### 2.6.3 系统指令说明

Rokid Glass XR系统中，默认设置了一些系统指令，在每个页面都可以使用。
* zh：回到桌面 / 返回桌面 en：Navigate Home
  * 功能：跳转到Launcher app页面，并关闭(finish)当前app的当前Activity；
  * 注意：并不会直接kill掉调用app的进程，如果需要对App进程进行清除，请通过指令拦截来特殊处理。
* zh：回到上一级 / 返回上一级 en：Navigate Back
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
* zh：亮一点 en: Brightness Up
  * 功能：亮度调高一档；
  * 注意：系统指令，全局类型
* zh：暗一点 en: Brightness Down
  * 功能：亮度调低一档；
  * 注意：系统指令，全局类型
* zh：点亮屏幕 en: Screen On
  * 功能：控制屏幕点亮；
  * 注意：系统指令，全局类型
* zh：熄灭屏幕 en: Screen Off
  * 功能：控制屏幕熄灭；
  * 注意：系统指令，全局类型


### 2.7 关闭全部语音指令

某些情况下，App为了更好地沉浸式体验，类似3D放映、3D游戏等，需要在当前App关闭、清除所有语音指令，去除语音标志。要实现上述功能，需要用户集成语音插件，并做一下功能组合调用。

#### 2.7.1 在LifeCycle形式的使用场景下，关闭语音指令

  ```java
/**
 * 清除全部指令 Act
 * LifeCycle方式
 */
public class NoAllInstructAct extends AppCompatActivity {

    private InstructLifeManager mLifeManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_no_instruct);
        configInstruct();
    }

    public void configInstruct() {
        mLifeManager = new InstructLifeManager(this, getLifecycle(), mInstructLifeListener);
        // 清除全部系统指令
        mLifeManager.getInstructConfig().setIgnoreSystem(true);
    }

    private InstructLifeManager.IInstructLifeListener mInstructLifeListener = new InstructLifeManager.IInstructLifeListener() {
        @Override
        public boolean onInterceptCommand(String command) {
            return false;
        }

        @Override
        public void onTipsUiReady() {
            // 清除页面底部"显示帮助"浮层
            if (mLifeManager != null) {
                mLifeManager.hideTipsLayer();
            }
        }

        @Override
        public void onHelpLayerShow(boolean show) {

        }
    };
}
  ```
可参照Demo中的NoAllInstructLifeAct.java   如App内所有页面都需要关闭全部语音指令，可以在App的Base Activity中做上述代码操作。


#### 2.7.2 在继承或者仿写InstructionActivity形式式的使用场景下，关闭语音指令

  ```java
/**
 * 清除全部指令 Act
 * 继承或仿照InstructionActivity方式
 */
public class NoAllInstructBaseExtendAct extends InstructionActivity {
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_no_instruct);
    }
    
    @Override
    public InstructConfig configInstruct() {
        InstructConfig config = new InstructConfig();
        // 设置ActionKey，需要保证不为空且唯一
        config.setActionKey(getClass().getName() + InstructConfig.ACTION_SUFFIX);
        // 清除全部系统指令
        config.setIgnoreSystem(true);
        return config;
    }

    @Override
    public void onInstrucUiReady() {
        super.onInstrucUiReady();
        // 清除页面底部"显示帮助"浮层
        if (mInstructionManager != null) {
            mInstructionManager.hideTipsLayer();
        }
    }

    /**
     * 是否拦截处理当前语音指令，拦截后之前配置的指令闭包不会被调用
     * （可以用来提前处理一些指令，然后返回false）
     * @param command
     * @return true：拦截事件 false：不进行拦截
     */
    @Override
    public boolean doReceiveCommand(String command) {
        return false;
    }
}
  ```
可参照Demo中的NoAllInstructBaseExtendAct.java  如App内所有页面都需要关闭全部语音指令，可以在App的Base Activity中做上述代码操作。


## 三、API参考

### 3.1 VoiceInstruction中公共方法说明

#### 3.1.1 VoiceInstruction中初始化 (必须在客户端的Application中调用)

  ```java
      /**
       * 语音指令插件sdk初始化，App运行时默认关闭百灵鸟模式
       *
       * @param appContext Application级别Context
       */
      @Override
      public static void init(Context appContext) 

      /**
       * 语音指令插件sdk初始化，插件与百灵鸟混合模式
       *
       * @param appContext Application级别Context
       * @param ignoreLark 是否忽略百灵鸟模式，true 忽略，false 启用
       */
      @Override
      public static void init(Context appContext, boolean ignoreLark) 

  ```

#### 3.1.2 VoiceInstruction中根据解决方案重启语音助手服务 (SDK 1.1.5及以上版本，语音助手RokidAiSdk 2.0.5版本及以上可用，中文环境使用)

  ```java
    /**
    * 根据解决方案重启语音助手服务
    *
    * @param context Activity级别的Context
    * @param mustRestart true：强制重启  false：如果语音助手使用的正式当前解决方案，则不必重启（默认推荐false）
    * @param configAllUseSolution true：所有配置全部使用解决方案的 false：所有配置使用系统默认和解决方案混合（默认推荐false）
    * @param notifyRealRestart    true：真正重启才触发后续的指令词设置 false：只要有广播返回就触发后续的指令词设置（默认推荐false）
    * @param instructionManager InstructionManager 重启后使当前页面指令配置生效，如没有指令配置或后续自己单独配置，可以直接传null
    */
    public static void restartVoiceServer(Context context, boolean mustRestart, boolean configAllUseSolution, final boolean notifyRealRestart, final InstructionManager instructionManager) 
  ```

#### 3.1.3 恢复标准模型配置

  ```java
    /**
    * 重启语音助手服务以恢复标准模型配置
    *
    * @param context
    */
    public static void recoveryVoiceServer(Context context) 
  ```

#### 3.1.4 添加全局指令

  ```java
      /**
       * 添加全局指令配置
       *
       * @param entity InstructEntity实体
       * @return
       */
      public VoiceInstruction addGlobalInstruct(InstructEntity entity)
  ```

#### 3.1.5 去除全局指令

  ```java
      /**
       * 清除某个全局指令配置
       *
       * @param entity InstructEntity实体
       * @return
       */
      public VoiceInstruction removeGlobalInstruct(InstructEntity entity)
  ```

### 3.2 InstructConfig.java 指令配置实体


#### 3.2.1 setActionKey

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

#### 3.2.2 addInstructEntity

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

#### 3.2.3 addInstructList

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

#### 3.2.4 setIgnoreGlobal

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

#### 3.2.5 setIgnoreSystem

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


#### 3.2.6 其他

  具体看InstructConfig中方法实现。



### 3.3 InstructEntity.java 指令实体

#### 3.3.1 属性定义(支持getter、setter方式调用)
| 属性| 类型 |含义|
|----|---|---|
| keyMap | Map (EntityKey.Language, EntityKey) | 指令的识别key map，会根据系统语言来确定当前使用的EntityKey， 当前语音找不到对应的Key值时，使用中文zh 的 EntityKey |
| global | boolean | 是否是全局指令，全局指令需要设定 |
| showTips | boolean | 是否展示在指令提示浮条中，展示的需要设定 |
| ignoreHelp | boolean | 是否不再帮助浮层中显示指令默认信息，不展示需要设置 |
| ignoreSoundEffect | boolean | 是否忽略命中后发出的音效 |
| ignoreToast | boolean | 是否忽略命中后显示的Toast内容提示 |
| callback | IInstructReceiver | 指令回调闭包，void onInstructReceive(Activity act, String key, InstructEntity instruct); |

#### 3.3.2 方法定义
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

#### 3.3.3 EntityKey.java 指令key定义(支持getter、setter方式调用)
| 属性| 类型 |含义|
|----|---|---|
| language | EntityKey.Language | EntityKey 语言类型，不能为空，zh为中文、en为英文 |
| name | String | EntityKey名称，不能为空 |
| pinYin | String | EntityKey拼音，小写，单词之间为一个空格，会根据name自动生成，也可以自己指定。eg：指令”看书“ ，拼音为”kan shu“。 |
| margins | float | EntityKey语音幅值，无需设置 |
| other | Object | EntityKey其他数据，需要指令附带一些数据可以利用这个属性 |
| helpContent | String | EntityKey提示文字，默认为EntityKey name，如果设置，以此为高优先级 |

#### 3.3.4 EntityKey.java 方法定义
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



### 3.4 IInstructReceiver.java 指令触发回调方法实体

#### 3.4.1 onInstructReceive

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

### 3.5 InstructLifeManager 或 InstructionManager 语音指令管理实体

说明： 一下通用方法均适用于 InstructLifeManager 或 InstructionManager的实例，用来完成一些语音设置操作；
* InstructLifeManager 用于使用LifeCycle方式使用语音指令SDK；
* InstructionManager 用于使用InstructionActivity或自定义BasicActivity方式使用语音指令SDK；

#### 3.5.1 Manager实例获取

* InstructLifeManager 通常用户自己创建，参考InstructLifeManager构造函数：

  ```java

     /**
  * InstructLifeManager 初始化函数
  * @param act Activity 实例
  * @param lifecycle android.arch.lifecycle.Lifecycle 实例
  * @param lifeListener IInstructLifeListener 回调监听实例
  */
 public InstructLifeManager(Activity act, Lifecycle lifecycle, IInstructLifeListener lifeListener)
  ```

* InstructionManager 实例会在客户端Activity继承的InstructionActivity中生成：
可以直接通过mInstructionManager来调用

#### 3.5.2 setTipsContent 设置tips显示文案

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


#### 3.5.3 showTipsLayer 显示tips浮层

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

#### 3.5.4 hideTipsLayer 关闭tips浮层

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

#### 3.5.5 setMenuShowing 设置是否显示tip条中的"显示菜单"字样

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

#### 3.5.6 isHelpLayerShowing 帮助浮层是否正在展示

  ```java
  public boolean isHelpLayerShowing();
  ```
  帮助浮层是否正在展示， true 展示，false 未展示。


#### 3.5.7 sendWtWords 将指令词设置到语音助手

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

#### 3.5.8 clearWtWords 清除语音助手当前所有语音指令

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

#### 3.5.9 getInstructConfig 获取当前页面指令配置

  ```java
  public InstructConfig getInstructConfig();
  ```
  获取当前页面指令配置。


#### 3.5.10 setInstructConfig 设置当前页面的指令配置

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

#### 3.5.11 addInstructList 成组添加语音指令

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

#### 3.5.12 addInstructEntity 单个添加语音指令

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

#### 3.5.13 clearUserInstruct 清除用户级指令

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

#### 3.5.14 clearGlobalInstruct 清除用户级指令

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

#### 3.5.15 clearAllInstruct 清除用户级指令

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

#### 3.5.16 clearNumberInstruct 清除当前全部数字类型指令

  ```java
  public void clearNumberInstruct();
  ```
  清除当前全部数字类型指令，单独清除sdk端的指令配置，会在下次onResume()时生效，如需立即生效，需要调用InstructionManager的sendWtWords()方法。

  ```java
// eg:
  if (mInstructionManager != null) {
      mInstructionManager.clearNumberInstruct();

      mInstructionManager.sendWtWords();
  }
  ```


#### 3.5.17 getInstructByName 通过指令名称来获取指令实体

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

#### 3.5.18 removeInstruct 清除单个指令

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

#### 3.5.19 setLeftBackShowing 设置tips左侧back返回上一级是否展示

  ```java
  public void setLeftBackShowing(boolean showing);
  ```
  设置tips浮层左侧back返回上一级是否展示。

参数：

  showing : true，展示；false，不展示；
  不展示时，back内容为View.INVISIBLE，会占用tips浮层左侧内容；

  ```java
// eg:
  if (mInstructionManager != null) {
      mInstructionManager.setLeftBackShowing(false);
  }
  ```

#### 3.5.20 showHelpLayer 展示系统帮助浮层

  ```java
  public void showHelpLayer();
  ```
  展示系统帮助浮层

  ```java
// eg:
  if (mInstructionManager != null) {
      mInstructionManager.showHelpLayer();
  }
  ```

#### 3.5.21 hideHelpLayer 关闭系统帮助浮层

  ```java
  public void hideHelpLayer();
  ```
  展示系统帮助浮层

  ```java
// eg:
  if (mInstructionManager != null) {
      mInstructionManager.hideHelpLayer();
  }
  ```


### 3.6 NumberTypeControler 使用连续数字指令

#### 3.6.1 NumberTypeControler 连续数字指令普通使用

  ```java
public static List<InstructEntity> doTypeControl(int startNumber, int endNumber, NumberTypeCallBack cb, NumberKey... keyList)
  ```

通过给定的数字指令配置，返回成组的数字指令实体InstructEntity，并衔接好指令触发后的CallBack处理，指令会在onResume()后生效

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

#### 3.6.2 NumberTypeControler 连续数字指令更多控制

  ```java
public static List<InstructEntity> doTypeControl(boolean ignoreToast, boolean ignoreSoundEffect, boolean ignorehelp, int startNumber, int endNumber, NumberTypeCallBack cb, NumberKey... keyList)
  ```

通过给定的数字指令配置，返回成组的数字指令实体InstructEntity，并衔接好指令触发后的CallBack处理，指令会在onResume()后生效

参数：

  ignoreToast ：boolean，指令命中时是否不显示指令名Toast，默认显示

  ignoreSoundEffect ：boolean，指令命中时是否不发出命中音效，默认发出音效

  ignorehelp ：boolean，在帮助页面中是否不显示指令帮助内容，默认显示

  startNumber ：int，初始的数字

  endNumber ：int，结束的数字

  cb ：NumberTypeCallBack，指令触发后的处理实体

  keyList ：NumberKey，中文、英文及其他文字的指令实体EntityKey
  
  ```java
// eg：
InstructConfig config = new InstructConfig();
config.addInstructList(NumberTypeControler.doTypeControl(true, true, false, 3, 20,
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

#### 3.6.3 NumberTypeControler 普通设置连续数字指令并立即生效

  ```java
public static void setNumberAndRunning(InstructionManager manager, int startNumber, int endNumber, NumberTypeCallBack cb, NumberKey... keyList)
  ```

通过给定的数字指令配置，返回成组的数字指令实体InstructEntity，并衔接好指令触发后的CallBack处理, 会清除之前的数字指令，推荐在初始化初次 onResume()后使用，适合动态添加修改数字指令场景。

参数：

  manager ：InstructionManager，指令控制中心

  startNumber ：int，初始的数字

  endNumber ：int，结束的数字

  cb ：NumberTypeCallBack，指令触发后的处理实体

  keyList ：NumberKey，中文、英文及其他文字的指令实体EntityKey
  
  ```java
// eg：
NumberTypeControler.doTypeControl(mInstructionManager, 3, 20,
              new NumberTypeControler.NumberTypeCallBack() {
                  @Override
                  public void onInstructReceive(Activity act, String key, int number, InstructEntity instruct) {
                      Log.d(TAG, "AudioAi Number onInstructReceive command = " + key + ", number = " + number);
                  }
              },
              new NumberKey(EntityKey.Language.zh, "第", "页", "可以说第3/4.../20页"),
              new NumberKey(EntityKey.Language.en, "the", "page", "the 3/4.../20 page")
              );
  ```

#### 3.6.4 NumberTypeControler 更多控制设置连续数字指令并立即生效

  ```java
public static void setNumberAndRunning(InstructionManager manager, boolean ignoreToast, boolean ignoreSoundEffect, boolean ignorehelp, int startNumber, int endNumber, NumberTypeCallBack cb, NumberKey... keyList) 
  ```

通过给定的数字指令配置，返回成组的数字指令实体InstructEntity，并衔接好指令触发后的CallBack处理, 会清除之前的数字指令，推荐在初始化初次 onResume()后使用，适合动态添加修改数字指令场景。

参数：

  manager ：InstructionManager，指令控制中心

  ignoreToast ：boolean，指令命中时是否不显示指令名Toast，默认显示

  ignoreSoundEffect ：boolean，指令命中时是否不发出命中音效，默认发出音效

  ignorehelp ：boolean，在帮助页面中是否不显示指令帮助内容，默认显示
  
  startNumber ：int，初始的数字

  endNumber ：int，结束的数字

  cb ：NumberTypeCallBack，指令触发后的处理实体

  keyList ：NumberKey，中文、英文及其他文字的指令实体EntityKey
  
  ```java
// eg：
NumberTypeControler.doTypeControl(mInstructionManager, true, true, false, 3, 20,
              new NumberTypeControler.NumberTypeCallBack() {
                  @Override
                  public void onInstructReceive(Activity act, String key, int number, InstructEntity instruct) {
                      Log.d(TAG, "AudioAi Number onInstructReceive command = " + key + ", number = " + number);
                  }
              },
              new NumberKey(EntityKey.Language.zh, "第", "页", "可以说第3/4.../20页"),
              new NumberKey(EntityKey.Language.en, "the", "page", "the 3/4.../20 page")
              );
  ```

#### 3.6.5 NumberKey 数字指令实体EntityKey

  ```java
public NumberKey(EntityKey.Language language, String prefix, String subfix, String helpContent)
  ```

数字指令实体EntityKey。

参数：

  language ：EntityKey.Language，语言类型

  prefix ：String，数字指令前缀，eg“第二页”的“第”

  subfix ：String，数字指令后缀，eg“第二页”的“页”

  helpContent ：String，帮助提示，eg“可以说第...页”
