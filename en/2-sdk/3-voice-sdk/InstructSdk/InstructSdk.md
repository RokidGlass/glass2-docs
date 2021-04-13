# Offline voice instruction SDK for the glasses

**Version: 1.5.8**

## 1. Overview of the offline voice instruction SDK

The Rokid offline voice instruction SDK is provided to help develop the offline voice instructions used with the Rokid voice assistant.

* To trigger the voice instructions, you need to enable Voice Assistant Activation in Settings of the glasses device. In addition, there are no requirements for the network environment to use the voice instructions. You can use the instructions in both offline and online modes.
* The voice instructions depend on the lifecycle of the activity, and the settings of instructions are applicable within the whole activity. The setting of an independent set of instructions for the fragment or dialog separately is not supported at present.
* For the voice instructions, it is lingually based on the current system voice to select a type of instruction language. If there is no language type of instructions corresponding to the current system language, Chinese (zh) will be selected as the default language type of instructions.

Note: The voice assistant RokidAiSdk must be v2.2.1 or higher.

```shell
// how to view the version of the voice assistant RokidAiSdk:
adb shell dumpsys package com.rokid.ai.glassaudio
```

Example demo for using the plugin:

[download demo](https://static.rokidcdn.com/sdk/sdk_apg_voiceInstruct_demo-866ab9f.zip)

### 1.1 Notes for use

#### 1.1.1 Notes for using the plugin

- For the scenarios in which you need to set independent instructions for the fragment or dialog, the lifecycle method is recommended;
- When using Chinese instructions, try to explicitly specify the pinyin of the instruction word;
- In the scenario of Chinese instructions, do not set the name of the instruction word using the text of another language type;
- For the apps for which proguard is required, refer to the proguard file in the example demo.

#### 1.1.2 Rules for defining Chinese instruction words

- Pronunciation
  
  1. Avoid the instruction word including reduplication words or two or more words with the same pronunciation, such as xiaolubeibei and babababa;
  2. For the instruction words in the same scenario, the relation of inclusion should be prohibited, such as Record Video and Start Record Video.

- Number of words
  
  1. The number of words as instructions shall be 2-10;
  2. For the global instructions, the number shall be 4 or more.

- Quantity
  
  1. It is recommended that the quantity of global instructions does not exceed 8;
  2. For the app-level instructions, try not to use 2-word and 3-word instructions (these instructions shall not be more than 20% of total instructions);
  3. The maximum number of instructions is 20 for the page with the most global and local instructions.

## 2. Description of integration

### 2.1 Adding 3rd party dependencies

- Configuring the general project build.gradle:
  
  ```groovy
  allprojects {
      repositories {
          google()
          jcenter()
      }
  }
  ```

- Configuring build.gradle in the module of the app:
  
  ```groovy
  dependencies {
      implementation fileTree(dir: 'libs', include: ['*.jar'])
      // the voice instruction SDK
      implementation 'com.rokid.ai.glass:instructsdk:1.5.8'
  }
  ```

- Jcenter Maven information
  
  ```xml
  <dependency>
    <groupId>com.rokid.ai.glass</groupId>
    <artifactId>instructsdk</artifactId>
    <version>1.5.8</version>
    <type>pom</type>
  </dependency>
  ```

- Modified on December 10, 2020

### 2.2 Configuring AndroidManifest.xml and the application

- Customizing the application
  
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

- Customizing the initialization of the voice SDK and the setting of global instructions in the application java file

```java
public class InstructApplication extends Application {

    @Override
    public void onCreate() {
        super.onCreate();
        // initialize the voice instruction SDK; by default, the lark is closed when the app is running 
  	    VoiceInstruction.init(this);
        // alternatively, use the following mixing mode with both the plugin and the lark
  	    // VoiceInstruction.init(this, false);


  	    // set global instructions; you can delete the following code if there is no global instruction
  	    // e.g. the instruction Return
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

The following 3 ways of use are supported for the voice instructions:

1. Use LifeCycle by InstructLifeManager (recommended);
2. Directly inherit InstructionActivity;
3. Imitate InstructionActivity.

### 2.3 Using LifeCycle by InstructLifeManager (recommended)

Description: To use voice instructions in this way, you need to provide an object as an input parameter of LifeCycle for InstructLifeManager, and the lifecycle of the instructions is mainly this LifeCycle; the page will not display the tips floating bar when the context is not an instance of the activity type.

#### 2.3.1 Initializing InstructLifeManager

```java
/**
* InstructLifeManager initialization function
* @param context Context instance; the page will not display the tips floating bar when the context is not an instance of the activity type
* @param lifecycle android.arch.lifecycle.Lifecycle instance
* @param lifeListener IInstructLifeListener callback listening instance
*/
public InstructLifeManager(Context context, Lifecycle lifecycle, IInstructLifeListener lifeListener)
```

#### 2.3.2 IInstructLifeListener callback

    ```java
     /**
     * InstructLifeManager some callback listening
     */
     public interface IInstructLifeListener {
           /**
           * instruction processing interception
           *
           * @param command
           * @return
           */
           boolean onInterceptCommand(String command);

           /**
           * tips UI ready callback
           */
           void onTipsUiReady();

           /**
          * show/hide the help floating layer
          *
          * @param show true: show; false: hide
          */
          void onHelpLayerShow(boolean show);
       }
       ```

#### 2.3.2 Using InstructLifeManager

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
                              Log.d(TAG, "last one trigger ");
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
                                      Log.d(TAG, "next one trigger ");
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
                                      Log.d(TAG, "open video trigger ");
                                  }
                              })
              );
  }

    private InstructLifeManager.IInstructLifeListener mInstructLifeListener = new InstructLifeManager.IInstructLifeListener() {
      @Override
      public boolean onInterceptCommand(String command) {
          if ("instruction to intercept".equals(command)) {
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

### 2.4 Directly inheriting InstructionActivity

Description: To use voice instructions in this way, the activity must inherit InstructionActivity, and InstructionActivity inherits the basic activity.

#### 2.4.1 Inheriting InstructionActivity.java by the activity

```java
public class HomeTestAct extends InstructionActivity {}
```

#### 2.4.2 Adding a common instruction

    ```java
    // add an instruction    
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
                                    // instruction processing callback
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
                                    // instruction processing callback
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
                                    // instruction processing callback
                                    openVideo();
                                }
                            })
            );

    return config;
    }

    ```

#### 2.4.3 Intercepting instructions

```java
// in HomeTestAct.java
/**
 * whether to intercept and process the current voice instruction; the instruction closure configured before will not be called after the interception
 * (can be used to process some instructions in advance, and then return false)
 * @param command
 * @return true: intercept the event ; false: do not intercept
 */
@Override
public boolean doReceiveCommand(String command) {
    Log.d(TAG, "doReceiveCommand command = " + command);

    if ("instruction to intercept".equals(command)) {
        return true;
    }
    return false;
}

```

#### 2.4.4 The method for closing voice instructions in the activity (override not a must)

```java
    /**
     * whether to switch the voice instruction off; on by default, and closing can be opted for inheriting
     *
     * @return false: open; true: close
     */
    @Override
    public boolean closeInstruction() {
        return false;
    }
```

#### 2.4.5 The method for configuring the instruction in the activity, which returns the InstructConfig instruction configuration entity (must override)

```java
public InstructConfig configInstruct()
```

#### 2.4.6 Generation of floating bar UI relating to instructions is completed and a change is needed (override not a must)

```java
// in HomeTestAct.java
/**
 * after the UI relating to the plugin floating layer has been prepared and added to the primary view tree, a change to the UI can be done
 */
@Override
public void onInstrucUiReady() {
    super.onInstrucUiReady();
}
```

### 2.5 Imitating InstructionActivity

Description: This applies to the scenario in which there is a basic activity of your own, and directly inheriting InstructionActivity cannot be done; other applications are the same as those in directly inheriting InstructionActivity.

#### 2.5.1 Imitating the implementation of InstructionActivity

    ```java

    public abstract class BasicInstructionActivity extends BasicActivity[the basic activity of the app itself] implements IInstruction{

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
     * whether to switch the voice instruction off; on by default, and closing can be opted for inheriting
     *
     * @return false: open; true: close
     */
     @Override
     public boolean closeInstruction() {
      return false;
     }
 
     /**
     * after the UI relating to the plugin floating layer has been prepared and added to the primary view tree, a change to the UI can be done
     */
    @Override
    public void onInstrucUiReady() {

    }

    /**
     * show/hide the help floating layer
     *
     * @param show true: show; false: hide
     */
     public void onHelpLayerShowed(boolean show) {

     }

     /**
     * get the voice instruction configuration
     *
     * @return
     */
     @Override
     public abstract InstructConfig configInstruct();

     /**
     * whether to intercept and process the current voice instruction; the instruction closure configured before will not be called after the interception
     * (can be used to process some instructions in advance, and then return false)
     * @param command
     * @return true: intercept the event ; false: do not intercept
     */
    @Override
    public abstract boolean doReceiveCommand(String command);
    }

    ```

### 2.6 Other public examples

#### 2.6.1 Setting the pinyin of the instruction

* By default, the Chinese instruction name is pinyin-converted in the SDK, but for some words with different pronunciations, the user needs to set the more exact pronunciations
* e.g., 重心 (zhong xin) and 重复 (chong fu)

```java
// add an instruction    
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
                                    // instruction processing callback
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
                                    // instruction processing callback
                                }
                            })
            );

    return config;
}

```

#### 2.6.2 Description of dynamically setting instructions

1. The default instructions are all configured at the time of Activity onCreate(), the instructions relating to the tips UI are generated at the time of onStart(), the instructions are set into the voice assistant at the time of onResume(), and the instructions are removed from the voice assistant at the time of onPause();
2. If an instruction requires the asynchronous data to be generated, you can set the instruction after the generation using sendWtWords() of the InstructLifeManager or InstructionManager object;
3. For the tips UI, the method setTipsContent(String content) of the InstructionManager object can be used to set the displayed contents;
4. The automatic generation of the tips UI according to the instructions only takes effect at the first time of setting the instructions by the activity, and the method onInstrucUiReady() (for the integrated InstructionActivity approach) or onTipsUiReady() (for the LifeCycle approach) will be called back once the UI has been prepared. Setting again will not make the UI change dynamically, and it is required that the user manually calls the method setTipsContent(String content) to set the displayed content.

#### 2.6.3 Description of system instructions

In the Rokid glasses XR system, some system instructions are configured by default, and can be used in each page.

* zh: 回到桌面/返回桌面; en: Navigate Home
  * Function: go to the launcher app page, and finish the current activity of the current app.
  * Note: The process that calls the app will not be directly killed; if you want to clear the process, perform special processing by instruction interception.
* zh: 回到上一级/返回上一级; en: Navigate Back
  * Function: go back to the previous activity page, and finish the current activity.
* zh: 显示帮助; en: show help
  * Function: pop up the floating window of a voice instruction word help.
  * Note: It is a system instruction and its type is global.
* zh: 关闭帮助; en: Close Help
  * Function: close the floating window of the voice instruction word help.
  * Note: It is a system instruction and its type is global.
* zh: 大点声; en: Volume Up
  * Function: tune up the sound volume by one level.
  * Note: It is a system instruction and its type is global.
* zh: 小点声; en: Volume Down
  * Function: tune down the sound volume by one level.
  * Note: It is a system instruction and its type is global.
* zh: 亮一点; en: Brightness Up
  * Function: tune up the brightness by one level.
  * Note: It is a system instruction and its type is global.
* zh: 暗一点; en: Brightness Down
  * Function: tune down the brightness by one level.
  * Note: It is a system instruction and its type is global.
* zh: 点亮屏幕; en: Screen On
  * Function: control the screen to light on.
  * Note: It is a system instruction and its type is global.
* zh: 熄灭屏幕; en: Screen Off
  * Function: control the screen to light off.
  * Note: It is a system instruction and its type is global.

### 2.7 Closing all voice instructions

In some cases, the app needs to close and clear all voice instructions and remove the voice marks for a better immersive experience, for example, in a 3D projection or 3D game. To achieve this, the user needs to integrate the voice plug-in and call the feature portfolio.

#### 2.7.1 Closing the voice instructions in the scenario of use in the form of LifeCycle

  ```java
 /**
* clear all instructions Act
* LifeCycle approach
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
      // clear all system instructions
      mLifeManager.getInstructConfig().setIgnoreSystem(true);
    }

    private InstructLifeManager.IInstructLifeListener mInstructLifeListener = new InstructLifeManager.IInstructLifeListener() {
      @Override
      public boolean onInterceptCommand(String command) {
          return false;
      }

      @Override
      public void onTipsUiReady() {
          // clear Show Help floating layer at the bottom of the page
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

Refer to NoAllInstructLifeAct.java in the demo; if it is necessary to close all voice instructions in all pages of the app, perform the code operation in the basic activity of the app.

#### 2.7.2 Closing voice instructions in the scenario of use of inheriting or imitating InstructionActivity

  ```java
/**
* clear all instructions Act
* inherit or imitate InstructionActivity
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
      // set ActionKey; it is required that it is not null and is unique
      config.setActionKey(getClass().getName() + InstructConfig.ACTION_SUFFIX);
      // clear all system instructions
      config.setIgnoreSystem(true);
      return config;
    }

    @Override
    public void onInstrucUiReady() {
      super.onInstrucUiReady();
      // clear Show Help floating layer at the bottom of the page
      if (mInstructionManager != null) {
          mInstructionManager.hideTipsLayer();
      }
    }

    /**
    * whether to intercept and process the current voice instruction; the instruction closure configured before will not be called after the interception
    * (can be used to process some instructions in advance, and then return false)
    * @param command
    * @return true: intercept the event ; false: do not intercept
     */
    @Override
    public boolean doReceiveCommand(String command) {
      return false;
    }
    }
    ```

Refer to NoAllInstructBaseExtendAct.java in the demo; if it is necessary to close all voice instructions in all pages of the app, perform the code operation in the basic activity of the app.

## 3. API reference

### 3.1 Description of the public methods in VoiceInstruction

#### 3.1.1 Initialization in VoiceInstruction (must be called in the application on the client side)

  ```java
    /**
     * initialize the voice instruction plugin SDK; the lark mode is closed by default when the app is running
     *
     * @param appContext the application-level context
     */
    @Override
    public static void init(Context appContext) 

    /**
     * initialize the voice instruction plugin SDK; the mode of mixing the plugin and the lark
     *
     * @param appContext the application-level context
     * @param ignoreLark whether to ignore the lark mode; true: ignore; false: enable
     */
    @Override
    public static void init(Context appContext, boolean ignoreLark) 

    ```

#### 3.1.2 Restarting the voice assistant service according to the solution in VoiceInstruction (for the SDK version 1.1.5 or higher; available for the voice assistant RokidAiSdk version 2.0.5 or higher; used in the Chinese environment)

```java
  /**
  * restart the voice assistant service according to the solution
  *
  * @param context the context at the activity level
  * @param mustRestart true: to forcibly restart; false: if what is used by the voice assistant is the current solution, it is not necessary to restart (false is recommended as a default value)
  * @param configAllUseSolution true: all configurations are the configurations of the solution; false: all configurations are a mixture of system default configurations and the configurations of the solution (false is recommended as a default value)
  * @param notifyRealRestart true: only real restarting triggers subsequent setting of the instruction words; false: the subsequent setting of the instruction words is triggered as long as a broadcast is returned (false is recommended as a default value)
  * @param instructionManager InstructionManager the instruction configuration for the current page is made effective after restarting; if there is no instruction configuration or you want to configure it subsequently, transfer a null directly
  */
  public static void restartVoiceServer(Context context, boolean mustRestart, boolean configAllUseSolution, final boolean notifyRealRestart, final InstructionManager instructionManager) 
```

#### 3.1.3 Restoring standard model configurations

```java
  /**
  * restart the voice assistant service to restore the standard model configuration
  *
  * @param context
  */
  public static void recoveryVoiceServer(Context context) 
```

#### 3.1.4 Adding a global instruction

```java
    /**
     * add a global instruction configuration
     *
     * @param entity InstructEntity entity
     * @return
     */
    public VoiceInstruction addGlobalInstruct(InstructEntity entity)
```

#### 3.1.5 Removing a global instruction

```java
    /**
     * clear some global instruction configuration
     *
     * @param entity InstructEntity entity
     * @return
     */
    public VoiceInstruction removeGlobalInstruct(InstructEntity entity)
```

### 3.2 InstructConfig.java instruction configuration entities

#### 3.2.1 setActionKey

```java
public InstructConfig setActionKey(String actionKey);
```

Used as the action of the broadcast hit by the instruction; must be unique; the class name of the activity+InstructConfig.ACTION\_SUFFIX is recommended.

Parameters:

actionKey: String, the action of the broadcast hit by the instruction.

```java
// e.g.:
InstructConfig config = new InstructConfig();
config.setActionKey(HomeTestAct.class.getName() + InstructConfig.ACTION_SUFFIX)
```

#### 3.2.2 addInstructEntity

```java
public InstructConfig addInstructEntity(InstructEntity entity);
```

Add an offline voice instruction to the configuration.

Parameters:

entity: InstructEntity, the voice instruction entity.

```java
// e.g.:
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

Add a set of offline voice instructions to the configuration.

Parameters:

instructList ：List<InstructEntity>, the set of voice instructions.

```java
// e.g.:
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

Control whether to ignore all global instructions for the current page.

Parameters:

ignoreGlobal: boolean, true: ignore all global instructions, and false: do not ignore all global instructions.

```java
// e.g.:
InstructConfig config = new InstructConfig();
config.setIgnoreGlobal(true);
```

#### 3.2.5 setIgnoreSystem

```java
public void setIgnoreSystem(boolean ignoreSystem);
```

Control whether to ignore all system instructions for the current page.

Parameters:

ignoreSystem: boolean, true: ignore all system instructions, and false: do not ignore all system instructions.

```java
// e.g.:
InstructConfig config = new InstructConfig();
config.setIgnoreSystem(true);
```

#### 3.2.6 Misc.

The details depend on the implementation of the methods in InstructConfig.

### 3.3 InstructEntity.java instruction entities

#### 3.3.1 Definition of attributes (calling by getter and setter supported)

| Attribute| Type| Meaning
|----------|----------|----------
| keyMap| Map (EntityKey.Language, EntityKey)| The key map of identification of the instruction; the EntityKey currently in use is determined according to the system language; if the corresponding key value is not found for the current voice, the Chinese (zh) EntityKey will be used.
| global| boolean| Whether it is a global instruction; for the global instructions, setting is needed.
| showTips| boolean| Whether to display in the floating bar of the tip of the instruction; for the displayed ones, setting is needed.
| ignoreHelp| boolean| Whether to not display the default information of the instruction in the help floating layer; if it is not displayed, setting is needed.
| ignoreSoundEffect| boolean| Whether to ignore the sound effect emitted after a hit.
| ignoreToast| boolean| Whether to ignore the tip of the content of the toast displayed after a hit.
| callback| IInstructReceiver| The instruction callback closure, void onInstructReceive(Activity act, String key, InstructEntity instruct);

#### 3.3.2 Definition of methods

All the above-mentioned attributes support calling by getter and setter.

keyMap supports the operations of adding, searching for, and deleting EntityKey.

```java

    /**
     * query the corresponding instruction key according to the language
     * 
     * @param language EntityKey.Language the query language
     * @return EntityKey the instruction key
     */
    public EntityKey getEntityKey(EntityKey.Language language);

        /**
     * add EntityKey to keyMap
     * 
     * @param key EntityKey
     * @return InstructEntity
     */
    public InstructEntity addEntityKey(EntityKey key);

    /**
     * delete the corresponding instruction key according to the language
     *
     * @param language EntityKey.Language the query language
     * @return InstructEntity the instruction key
     */
    public InstructEntity removeEntityKey(EntityKey.Language language);

```

#### 3.3.3 Definition of EntityKey.java instruction keys (calling by getter and setter supported)

| Attribute| Type| Meaning
|----------|----------|----------
| language| EntityKey.Language| The type of EntityKey language; cannot be a null; zh for Chinese, and en for English.
| name| String| The name of EntityKey; cannot be a null.
| pinYin| String| The pinyin of EntityKey, which is in lowercase and can be generated automatically according to the name or be specified by yourself, and in which there is a space between the pinyins of two adjacent words. e.g.: for the instruction "看书," its pinyin is "kan shu."
| margins| float| The margin of EntityKey voice; no need to set it.
| other| Object| Other data of EntityKey; this attribute can be utilized if it is necessary to provide the instruction with some data.
| helpContent| String| The tip text of EntityKey; by default, it is the name of EntityKey; if set, this is deemed as having the higher priority.

#### 3.3.4 Definition of EntityKey.java methods

All the above-mentioned attributes of EntityKey support calling by getter and setter.

The EntityKey constructor:

```java

    /**
     * create EntityKey for specifying a language
     * 
     * @param language EntityKey.Language the type of language
     * @param name the name of EntityKey; cannot be a null
     */
    public EntityKey(Language language, String name);

    /**
     * create Chinese EntityKey
     *
     * @param name the name of EntityKey
     * @param pinYin the pinyin of EntityKey, which is in lowercase and can be generated automatically according to the name or be specified by yourself, and in which there is a space between the pinyins of two adjacent words
     */
    public EntityKey(String name, String pinYin);


```

### 3.4 The instruction-triggering callback method entities of IInstructReceiver.java

#### 3.4.1 onInstructReceive

```java
void onInstructReceive(Activity act, String key, InstructEntity instruct);
```

The InstructEntity instruction callback closure; when the instruction is triggered, the processing thread will automatically call this method for instruction processing if there is no interception in the method *public boolean doReceiveCommand(String command)*. The method runs in the primary thread of BroadcastReceiver.

Parameters:

act: the activity, that is, the activity entity to be called back;

key: String; the instruction key, that is the name attribute of InstructEntity;

instruct: InstructEntity, that is, the instruction entity.

```java
// e.g.:
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

### 3.5 InstructLifeManager or InstructionManager voice instruction management entity

Note: All the following general methods apply to the instances of InstructLifeManager or InstructionManager for accomplishing some voice setting operations;

* InstructLifeManager is for using the voice instruction SDK by the way of LifeCycle;
* InstructionManager is for using the voice instruction SDK by the way of InstructionActivity or the customized basic activity.

#### 3.5.1 Obtaining the manager instance

* Typically, InstructLifeManager is created by the user; refer to the InstructLifeManager constructor:
  
  ```java
  
     /**
  * InstructLifeManager initialization function
  * @param act the activity instance
  * @param lifecycle android.arch.lifecycle.Lifecycle instance
  * @param lifeListener IInstructLifeListener callback listening instance
  */
  ```

public InstructLifeManager(Activity act, Lifecycle lifecycle, IInstructLifeListener lifeListener)

```

* the InstructionManager instance is generated in the InstructionActivity inherited by the activity on the client side:
you can call it directly by mInstructionManager

#### 3.5.2 Using setTipsContent to set the displayed copywriting of tips

```java
public void setTipsContent(String content);
```

Set the prompt content of the instruction displayed by the tip bar.

Parameters:

content: String, the displayed copywriting of the tip.

```java
// e.g.:
if (mInstructionManager != null) {
    mInstructionManager.setTipsContent("Start playing/Stop playing/Go back to the homepage");
}
```

#### 3.5.3 Using showTipsLayer to show the tip floating layer

```java
public void showTipsLayer();
```

Set to display the tip floating layer.

```java
// e.g.:
if (mInstructionManager != null) {
    mInstructionManager.showTipsLayer();
}
```

#### 3.5.4 Using hideTipsLayer to close the tip floating layer

```java
public void hideTipsLayer();
```

Set to close the tip floating layer.

```java
// e.g.:
if (mInstructionManager != null) {
    mInstructionManager.hideTipsLayer();
}
```

#### 3.5.5 Using setMenuShowing to set whether to display "Show Menu" in the tip bar

```java
public void setMenuShowing(boolean showing);
```

Set whether to display "Show Menu" in the tip bar. It is recommended that it is called in the method onInstrucUiReady() of InstructionActivity.

Parameters:

showing: boolean, true: display, and false: do not display.

```java
// e.g.:
if (mInstructionManager != null) {
    mInstructionManager.setMenuShowing(false);
}
```

#### 3.5.6 Using isHelpLayerShowing to set whether the help floating layer is being displayed

```java
public boolean isHelpLayerShowing();
```

Set whether the help floating layer is being displayed; true: displayed; false: not displayed.

#### 3.5.7 Using sendWtWords to set the instruction word into the voice assistant

```java
public void sendWtWords();
```

Set the instruction word into the voice assistant; by default, it is called in the method onResume() of InstructionActivity; this method can also be separately called to set the voice instruction again after making changes to InstructConfig on the client side.

```java
// e.g.:
if (mInstructionManager != null) {
    mInstructionManager.removeInstruct(EntityKey.Language.en, "Start Playing");
    mInstructionManager.sendWtWords();
}
```

#### 3.5.8 Using clearWtWords to clear all current voice instructions of the voice assistant

```java
public void clearWtWords();
```

Clear all current voice instructions of the voice assistant.

```java
// e.g.:
if (mInstructionManager != null) {
    mInstructionManager.clearWtWords();
}
```

#### 3.5.9 Using getInstructConfig to obtain the instruction configuration of the current page

```java
public InstructConfig getInstructConfig();
```

Obtain the instruction configuration of the current page.

#### 3.5.10 Using setInstructConfig to set the instruction configuration of the current page

```java
public void setInstructConfig(InstructConfig instructConfig);
```

Set the instruction configuration of the current page; this is used when it is necessary to dynamically set the instruction.

Parameters:

instructConfig: InstructConfig, the instruction configuration entity class.

```java
// e.g.:
if (mInstructionManager != null) {
    mInstructionManager.setInstructConfig(instructConfig);
}
```

#### 3.5.11 Using addInstructList to add a set of voice instructions

```java
public void addInstructList(List<InstructEntity> instructList);
```

Add a set of voice instructions.

Parameters:

showinstructListing: List<InstructEntity>, the set of instructions.

```java
// e.g.:
if (mInstructionManager != null) {
    mInstructionManager.addInstructList(instructList);
}
```

#### 3.5.12 Using addInstructEntity to add a single voice instruction

```java
public void addInstructEntity(InstructEntity entity);
```

Add a single voice instruction.

Parameters:

entity: InstructEntity, the instance of a single voice instruction.

```java
// e.g.:
if (mInstructionManager != null) {
    mInstructionManager.addInstructEntity(entity);
}
```

#### 3.5.13 Using clearUserInstruct to clear user-level instructions

```java
public void clearUserInstruct();
```

Clear user-level instructions; clear the instruction configuration on the SDK side separately; this will take effect at the time of the next onResume(); if it is necessary to take effect immediately, call the method sendWtWords() of InstructionManager.

```java
// e.g.:
if (mInstructionManager != null) {
    mInstructionManager.clearUserInstruct();

    mInstructionManager.sendWtWords();
}
```

#### 3.5.14 Using clearGlobalInstruct to clear global-level instructions

```java
public void clearGlobalInstruct();
```

Clear global-level instructions; clear the instruction configuration on the SDK side separately; this will take effect at the time of the next onResume(); if it is necessary to take effect immediately, call the method sendWtWords() of InstructionManager.

```java
// e.g.:
if (mInstructionManager != null) {
    mInstructionManager.clearGlobalInstruct();

    mInstructionManager.sendWtWords();
}
```

#### 3.5.15 Using clearAllInstruct to clear all instructions

```java
public void clearAllInstruct();
```

Clear all voice instructions; clear the instruction configuration on the SDK side separately; this will take effect at the time of the next onResume(); if it is necessary to take effect immediately, call the method sendWtWords() of InstructionManager.

```java
// e.g.:
if (mInstructionManager != null) {
    mInstructionManager.clearAllInstruct();

    mInstructionManager.sendWtWords();
}
```

#### 3.5.16 Using clearNumberInstruct to clear all current number-type instructions

```java
public void clearNumberInstruct();
```

Clear all current number-type instructions; clear the instruction configuration on the SDK side separately; this will take effect at the time of the next onResume(); if it is necessary to take effect immediately, call the method sendWtWords() of InstructionManager.

```java
// e.g.:
if (mInstructionManager != null) {
    mInstructionManager.clearNumberInstruct();

    mInstructionManager.sendWtWords();
}
```

#### 3.5.17 Using getInstructByName to obtain an instruction entity by the name of the instruction

```java
public InstructEntity getInstructByName(EntityKey.Language language, String name);
```

Obtain an instruction entity by the name of the instruction.

Parameters:

language: EntityKey.Language, the type of the language; name: String, the name of the instruction; return: InstructEntity, the instruction entity.

```java
// e.g.:
if (mInstructionManager != null) {
    mInstructionManager.getInstructByName(EntityKey.Language.en, "Start Playing");
}
```

#### 3.5.18 Using removeInstruct to clear a single instruction

```java
public boolean removeInstruct(EntityKey.Language language, String name);
```

Clear a single instruction by the name of the instruction; clear the instruction configuration on the SDK side separately; this will take effect at the time of the next onResume(); if it is necessary to take effect immediately, call the method sendWtWords() of InstructionManager.

Parameters:

language: EntityKey.Language, the type of the language; name: String, the name of the instruction; return: true for success, and false for failure or absence of the instruction with the currently specified name in the set of instructions.

```java
// e.g.:
if (mInstructionManager != null) {
    mInstructionManager.removeInstruct(EntityKey.Language.en, "Start Playing");
}
```

#### 3.5.19 Using setLeftBackShowing to set whether to display "Back" on the left side of the tip

```java
public void setLeftBackShowing(boolean showing);
```

Set whether to display "Back" on the left side of the tip floating layer.

Parameters:

showing: true for display, and false for no display; when it is not displayed, the content of "Back" is View.INVISIBLE, and will occupy the left side of the tip floating layer.

```java
// e.g.:
if (mInstructionManager != null) {
    mInstructionManager.setLeftBackShowing(false);
}
```

#### 3.5.20 Using showHelpLayer to display the system help floating layer

```java
public void showHelpLayer();
```

Display the system help floating layer.

```java
// e.g.:
if (mInstructionManager != null) {
    mInstructionManager.showHelpLayer();
}
```

#### 3.5.21 Using hideHelpLayer to close the system help floating layer

```java
public void hideHelpLayer();
```

Display the system help floating layer.

```java
// e.g.:
if (mInstructionManager != null) {
    mInstructionManager.hideHelpLayer();
}
```

### 3.6 Using continuous number instructions by NumberTypeControler

#### 3.6.1 Common use of continuous number instructions by NumberTypeControler

```java
public static List<InstructEntity> doTypeControl(int startNumber, int endNumber, NumberTypeCallBack cb, NumberKey... keyList)
```

With a given number instruction configuration, a set of number instruction entities (InstructEntity) are returned, and the callback processing after the instructions are triggered is joined; the instructions will take effect after onResume().

Parameters:

startNumber: int, the initial number;

endNumber: int, the final number;

cb: NumberTypeCallBack, the processing entity after the instructions are triggered;

keyList: NumberKey, the Chinese, English and the like instruction entity EntityKey.

```java
// e.g.:
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

#### 3.6.2 More control over the continuous number instructions by NumberTypeControler

```java
public static List<InstructEntity> doTypeControl(boolean ignoreToast, boolean ignoreSoundEffect, boolean ignorehelp, int startNumber, int endNumber, NumberTypeCallBack cb, NumberKey... keyList)
```

With a given number instruction configuration, a set of number instruction entities (InstructEntity) are returned, and the callback processing after the instructions are triggered is joined; the instructions will take effect after onResume().

Parameters:

ignoreToast: boolean, whether to not display the toast of the name of the instruction when the instruction is hit (displayed by default);

ignoreSoundEffect: boolean, whether to not emit a sound effect when the instruction is hit (emitted by default);

Ignorehelp: boolean, whether to not display the content of instruction help in the help page (displayed by default);

startNumber: int, the initial number;

endNumber: int, the final number;

cb: NumberTypeCallBack, the processing entity after the instructions are triggered;

keyList: NumberKey, the Chinese, English and the like instruction entity EntityKey.

```java
// e.g.:
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

#### 3.6.3 Common setting of the continuous number instructions and making it effective immediately by NumberTypeControler

```java
public static void setNumberAndRunning(InstructionManager manager, int startNumber, int endNumber, NumberTypeCallBack cb, NumberKey... keyList)
```

With a given number instruction configuration, a set of number instruction entities (InstructEntity) are returned, and the callback processing after the instructions are triggered is joined; the previous number instructions will be cleared; it is recommended that this is used after the first onResume() during initialization; this applies to the scenarios of dynamically adding or changing the number instruction.

Parameters:

manager: InstructionManager, the instruction control center;

startNumber: int, the initial number;

endNumber: int, the final number;

cb: NumberTypeCallBack, the processing entity after the instructions are triggered;

keyList: NumberKey, the Chinese, English and the like instruction entity EntityKey.

```java
// e.g.:
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

#### 3.6.4 More control over the setting of the continuous number instructions and making it effective immediately by NumberTypeControler

```java
public static void setNumberAndRunning(InstructionManager manager, boolean ignoreToast, boolean ignoreSoundEffect, boolean ignorehelp, int startNumber, int endNumber, NumberTypeCallBack cb, NumberKey... keyList) 
```

With a given number instruction configuration, a set of number instruction entities (InstructEntity) are returned, and the callback processing after the instructions are triggered is joined; the previous number instructions will be cleared; it is recommended that this is used after the first onResume() during initialization; this applies to the scenarios of dynamically adding or changing the number instruction.

Parameters:

manager: InstructionManager, the instruction control center;

ignoreToast: boolean, whether to not display the toast of the name of the instruction when the instruction is hit (displayed by default);

ignoreSoundEffect: boolean, whether to not emit a sound effect when the instruction is hit (emitted by default);

Ignorehelp: boolean, whether to not display the content of instruction help in the help page (displayed by default);

startNumber: int, the initial number;

endNumber: int, the final number;

cb: NumberTypeCallBack, the processing entity after the instructions are triggered;

keyList: NumberKey, the Chinese, English and the like instruction entity EntityKey.

```java
// e.g.:
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

#### 3.6.5 The NumberKey number instruction entity EntityKey

   ```java
public NumberKey(EntityKey.Language language, String prefix, String subfix, String helpContent)
   ```

The number instruction entity EntityKey.

Parameters:

language: EntityKey.Language, the type of the language;

prefix: String, the prefix of the number instruction, e.g., "the" in "the second page";

subfix: String, the suffix of the number instruction, e.g., "page" in "the second page";

helpContent: String, the help tip, e.g., "You can say the ... page."


