## 1. Introduction to the voice assistant of the glasses

### 1.1 Overview

The voice assistant of the glasses is developed based on the Rokid Ai SDK, and has the folllowing features:

1. Voice activation and sound data processing;
2. Chinese offline voice processing
3. Model configuration dedicated to the client solutions;

### 1.2 How the external support works

As an independent system app, the voice assistant of the glasses is built into the glasses system, and now it is not supported that the user makes changes to the source code directly. However, to support the use of voice function in the user’s app, the following is provided for external users:

1. A simple SDK is provided for the user to use offline voice instructions.
2. A client is provided to set a unique instruction model and configuration files.

## 2. How to use the voice assistant of the glasses

### 2.1 Using the offline instruction SDK

If other Android APKs in the system need to use some simple offline voice instructions, these APKs must interact with the voice assistant. In order to facilitate users to develop their own offline voice instructions, Rokid provides a voice instruction SDK. For details, refer to the documents relating to the offline instruction SDK.

### 2.2 Configuring the model dedicated to the client solution and its steps

In the software of the voice assistant built in the system, the standard instruction model configurations that cooperate with other system apps are included.

The 3rd party app can set its own offline instructions using the voice assistant, and if an instruction is not included in the standard model, the instruction is deemed as an instruction that has not been trained. In the interaction with the page, the instruction that has not been trained is low in the rate of right activation and high in the rate of wrong activation.

If the 3rd party app needs a high hit accuracy of instructions, a model that has been professionally trained by Rokid is required. The voice assistant also supports that the 3rd party app solution is configured with its own dedicated model.

Note: The voice assistant version 2.0.6 or higher is required.

#### 2.2.1 Obtaining the dedicated model configuration file package, which basically has the following format:

```shell
.
├── cmds.json
├── logging.conf
├── lothal_double.ini
├── lothal_double_modules.ini
├── lothal_four.ini
├── lothal_four_modules.ini
├── model
│   └── emb
│       ├── output_graph.bin
│       └── symbol_table.txt
├── rasr.emb.double.ini
└── rasr.emb.four.ini
```

Note: The model directory includes the model files; most of the 3rd party apps only need the model files, and other unnecessary files can be ignored; it is not necessary to import the home directory of the configuration of the solution.

#### 2.2.2 The home directory of the configuration of the solution

The voice assistant uses the directory app package name of the solution under the SD card as the home directory of the configuration of the solution (/sdcard/{packageName}/).

For example, if the package name of an app is com.aaa.bbb.ccc, the home directory of its configuration shall be /sdcard/com.aaa.bbb.ccc/; if the current solution received by the voice assistant at startup is specified as "com.aaa.bbb.ccc," the voice assistant loads the configuration files under the directory /sdcard/com.aaa.bbb.ccc/ in the merging manner, after loading the standard configuration of the solution.

** When the 3rd party solution uses a dedicated model configuration, it is necessary to add its own dedicated model configuration to the home directory of the configuration of the solution.**

#### 2.2.3 The feature of deep configuration of solution\_config.json

By default, when the voice assistant deals with the dedicated model configuration, it does it in the merging manner; that is, it first copies the standard configuration, and then copies the private configuration of the solution. This applies to most of the solutions, and for the solution, it is simply needed to place the model directory and model files into the home directory of the configuration. However, some solutions may require that all voice configuration files are their private ones and the merging mode is not used. Therefore, the voice assistant provides the feature of deep configuration of solution\_config.json.

The user simply needs to place solution\_config.json under the home directory of the configuration of the solution, and configure the content of the .json file:

```json
{
	"allConfigBySolution": true
}
```

* allConfigBySolution
  * true represents that all configurations are the private configurations of the solution
  * false represents that the private configuration of the solution is loaded in the merging manner

#### 2.2.4 Restarting the voice service feature of the voice assistant (for the Chinese environment)

There are two methods of using the 3rd party solution app on the 2G Rokid glasses:

1. Used as a default launcher and started when the device is turned on; and
2. Used as a normal app and started when the user clicks on it.

For the first method, if the dedicated model configuration file is to be used, the solution integrator needs to build the private configuration into the home directory of the configuration of the solution provided with the voice assistant in advance.

For the second method or other cases where it is necessary to restart the voice assistant service to read the private configuration of the solution again, the voice assistant provides the feature of restarting the voice service.

How to use the feature of restarting the voice service:

1. Integrate the voice offline instruction SDK instructsdk version 1.1.8 or higher
   
   e.g.: implementation 'com.rokid.ai.glass:instructsdk:1.1.8'
2. Use the feature of restarting the voice assistant service according to the solution in VoiceInstruction:
   
   ```java
   /**
   * restart the voice assistant service according to the solution
   *
   * @param context the context at the activity level
   * @param packageName String the name of the solution; by default, it is the packageName of the app; if it is left null, the standard model configuration is indicated
   * @param mustRestart true: to forcibly restart; false: if what is used by the voice assistant is the current solution, it is not necessary to restart (false is recommended as a default value)
   * @param configAllUseSolution true: all configurations are the ones of the solution; false: all configurations are the mixture of the system default ones and the ones of the solution (false is recommended as a default value)
   * @param notifyRealRestart true: only real restarting triggers subsequent setting of the instruction words; false: the subsequent setting of the instruction words is triggered as long as a broadcast is returned (false is recommended as a default value)
   * @param instructionManager InstructionManager the instruction configuration for the current page is made effective after restarting; if there is no instruction configuration or you want to configure it subsequently, transfer a null directly
   */
   public static void restartVoiceServer(Context context, String packageName, boolean mustRestart, boolean configAllUseSolution, final boolean notifyRealRestart, final InstructionManager instructionManager) {
   }
   ```
   
   Note: Before restarting the service, make sure that you have added the dedicated model configuration to the home directory of the configuration of the solution; otherwise, the failure of restarting the voice assistant service may occur, which will interrupt the use of the features of the voice offline instructions by other apps.

#### 2.2.5 Restoring the standard model of the voice assistant

If the 3rd party solution app has replaced the model configuration of the voice assistant by restarting the voice service of the voice assistant, it is required to ensure that the voice assistant can switch back to the standard model after leaving the environment of use of its private model; otherwise, the use of voice instructions by other apps may be affected. How to use the feature of restoring the standard model of the voice assistant:

1. Integrate the voice offline instruction SDK instructsdk version 1.1.8 or higher
   e.g.: implementation 'com.rokid.ai.glass:instructsdk:1.1.8'
2. Use the feature of restarting the voice assistant service according to the solution in VoiceInstruction:
   ```java
   /**
   * restart the voice assistant service to restore the standard model configuration
   *
   * @param context
   */
   public static void recoveryVoiceServer(Context context) {
   }
   ```