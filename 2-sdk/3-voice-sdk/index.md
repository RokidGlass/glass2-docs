
## 一. Glass 语音助手介绍

### 1.1 概述
Glass 语音助手基于Rokid Ai SDK 开发，拥有：
1. 语音激活和声音数据处理；
2. 中文离线语音处理；
3. 客户端解决方案专用模型配置；

### 1.2 对外支持说明
Glass 语音助手作为独立的系统App内置到Glass系统中，暂不支持用户直接修改源码。但为了支持用户在自己的App中使用语音功能，对外提供：
1. 对外提供简单SDK以支持用户使用语音离线指令。
2. 对外提供客户端设置自己独有的指令模型及配置文件。



## 二. Glass语音助手使用说明

### 2.1 离线指令SDK使用
如果系统内其他的Android apk想要使用一些简单的离线语音指令，需要此应用apk和语音助手进行交互。为了方便用户开发自己的离线语音指令，Rokid提供了相应的语音指令SDK。具体请参考离线指令SDK相关文档。

### 2.2 客户端解决方案专用模型配置及配置步骤
系统内置的语音助手软件中，包含了跟其它系统app配合的标准指令模型配置。

第三方应用可以使用语音助手来设置自己的离线指令，如果标准模型中未包含此指令，那么这种指令会被视为未训练过的指令。未训练过的指令在页面的交互使用中，正确激活率较低，误激活较高。

某些三方应用如果需要较高指令命中精度，那么需要从Rokid方面获取专业训练过模型。语音助手同时支持第三方应用解决方案配置自己的专用模型。

注：需要语音助手 2.0.5版本及以上

#### 2.2.1、 获取专用模型配置文件包，包内格式基本如果下
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
注：model目录为模型文件，大部分第三方应用只需要模型文件即可，其他非必须文件可以忽略，无需导入方案配置主目录

#### 2.2.2、 解决方案配置主目录
语音助手以SD卡下的解决方案app package name目录为解决方案配置主目录（/sdcard/{packageName}/）。

eg：某app 包名为 com.aaa.bbb.ccc, 则其配置主目录应该为 /sdcard/com.aaa.bbb.ccc/ , 如果语音助手启动时接收到的当前方案指定为"com.aaa.bbb.ccc", 那么语音助手在加载完标准方案配置后会以merge 混合方式加载 /sdcard/com.aaa.bbb.ccc/ 目录下的配置文件。

** 在第三方解决方案使用专用模型配置时，需要先将自己的专用模型配置添加到上述解决方案配置主目录。**

#### 2.2.3、 solution_config.json深度配置功能
语音助手处理专用模型配置时，默认会使用merge 混合方式，即先copy 标准配置，然后再copy解决方案私有配置。这适于大多数解决方案，而且解决方案只需要在配置主目录中放置model目录及模型文件就可以了。但是仍然有个别解决方案会希望所有语音配置文件全部使用自己私有的，并且不使用merge模式。为此，语音助手提供了solution_config.json深度配置功能。

用户只需要将solution_config.json放置到解决方案配置主目录下，并配置其相应json内容即可：
```json
{
	"allConfigBySolution": true
}
```
* allConfigBySolution 
  * ture 表示所有配置均使用解决方案私有配置 
  * false 表示使用merge 混合方式加载解决方案私有配置 

#### 2.2.4、 重启语音助手语音服务功能
第三方解决方案app在Rokid glass二代眼镜上有两种使用方式：
1. 作为默认Launcher形式，开机启动。
2. 作为普通应用，用户点击启动app。

对于第一种方式，如果要使用专用模型配置文件，需要方案集成商事先将私有配置内置到语音助手提供的解决方案配置主目录。

针对第二种方式，或者其他用法导致需要重启语音助手服务以重新读取解决方案私有配置的，语音助手提供重启语音服务功能。

重启语音服务功能使用方式：
1. 集成语音离线指令SDK instructsdk 1.1.5 版本及以上 
   
   eg：implementation 'com.rokid.ai.glass:instructsdk:1.1.5'
2. 使用VoiceInstruction中根据解决方案重启语音助手服务功能：
   ```java
   /**
    * 根据解决方案重启语音助手服务
    *
    * @param context Activity级别的Context
    * @param mustRestart true：强制重启  false：如果语音助手使用的正式当前解决方案，则不必重启（默认推荐false）
    * @param configAllUseSolution true：所有配置全部使用解决方案的 false：所有配置使用系统默认和解决方案混合（默认推荐false）
    * @param instructionManager InstructionManager 重启后使当前页面指令配置生效，如没有指令配置或后续自己单独配置，可以直接传null
    */
   public static void restartVoiceServer(Context context, boolean mustRestart, boolean configAllUseSolution, final InstructionManager instructionManager) {
   }
   ```
   注：重启服务前，请务必先将自己的专用模型配置添加到解决方案配置主目录，否则可能导致语音助手服务重启失败，干扰其他应用使用语音离线指令功能！
