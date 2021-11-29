## 1. Introduction to the voice assistant of the glasses

### 1.1 Overview

The voice assistant of the glasses is developed based on the Rokid Ai SDK, and has the folllowing features:

1. Voice activation and sound data processing;
2. Setting, recognition and processing of offline voice instructions in Chinese and English;
3. Model configuration dedicated to the client solutions;
4. Non-invasive voice control for the 3rd party apps;

### 1.2 How the external support works

As an independent system app, the voice assistant of the glasses is built into the glasses system, and now it is not supported that the user makes changes to the source code directly. However, to support the use of voice function in the user’s app, the following is provided for external users:

1. The voice instruction SDK to support the accurate use of offline instructions of voice by the user;
2. The lark service for implementing non-invasive (by the code) control by voice instructions for the 3rd party apps.

## 2. How to use the voice assistant of the glasses

### 2.1 Using the offline instruction SDK

If other Android APKs in the system need to use the offline voice instructions accurately, these APKs must interact with the voice assistant. Rokid provides the corresponding voice instruction SDK; for the specific method of use, refer to the user’s guide for the offline instruction SDK. Also, an example demo of use of the offline instruction SDK is provided at:

[Download Demo](https://static.rokidcdn.com/sdk/sdk_apg_voiceInstruct_demo-ac8ced7.zip)

### 2.2 How to use the lark service for non-invasive control by voice instructions

In the software of the voice assistant built into the system, an independent lark service process is included to enable the 3rd party apps to use the control function by simple voice instructions to improve the experience of use of these apps on the glasses and improve the ability to control fully by the voice, without introducing the voice instruction SDK.

The lark service is capable of automatically generating corresponding simple voice instructions according to the content of the current running interface of the app, and configuring them into the master process of the voice assistant after screening and filtering.

After the user speaks the corresponding voice instruction in the current running interface of the app, the recognition result will be returned to the lark service, and then the processing of the implementation of the function of the specific instruction is performed in accordance with the corresponding rules.

#### 2.2.1 Rules for automatic generation of instructions

1. The Open the Nth instruction type

   The view that is provided with a clicking feature and is being displayed in the current UI interface (that is, the attribute clickable of this view is true) will be placed into the collection of pre-generated instructions. At the stage of generating instructions, all of the instructions of the collection of pre-generated instructions are sorted by the numbers, and the instruction Open the Nth is generated.
   
   For example, there are 5 button views in the current page;

   The Chinese environment:：“打开第一个”、“打开第五个”等；

   ​The English environment: "Open the first", "Open the 5th", etc.;
   
   The triggered effect of the instruction: the view where the instruction is generated triggers its own clicking feature;

2. The "Select **" instruction type:
   
   For the TextView that has a clicking feature and is being displayed in the current UI interface, a corresponding instruction "Select \*\*" will be generated according to the context of the current text.
   
   For example, there are a clickable TextView in which the content of the text is "Back" and a button in which the content of the text is "Start Update" in the current page;
   
   ​        The Chinese environment: "选择上一页", "选择开始更新", etc.
   
   ​        The English environment: "Select Back", "Select Start Update", etc.
   
   The triggered effect of the instruction: the view where the instruction is generated triggers its own clicking feature;

3. The "Scroll up, down, to the left, and to the right" instruction type
   
   If there are ScrollView, ListView, and RecyclerView in the current UI interface and its memory is in the scrollable region, 4 instructions "Scroll up", "Scroll down", "Scroll to the left", and "Scroll to the right" will be generated.
   
   The triggered effect of the instruction: the ScrollView, ListView, or RecyclerView with the focus at the moment is scrolled to the direction indicated by the instruction by a fixed distance, and if the view with the focus at the moment cannot be scrolled, the first scrollable view will be selected and scrolled;

#### 2.2.2 Instruction UI Marks

The lark service of the voice assistant provides the instruction UI marks at the top of the operable interface.

1. The Open the Nth instruction type
   
   There will be number marks with a circular background corresponding to 1, 2, 3, etc. on the upper left corner of the view corresponding to the generation the instruction;

2. General mark:
   
   If the lark service supports the current interface, the mark "Show Help" will appear on the lower right corner of the current interface;

#### 2.2.3 The lark global instructions

In the interface of a 3rd party app, in addition to all the instructions of the system, the user can also use the global instructions generated and dedicated to the lark service if the service supports the current interface:

* Chinese: "显示提示"; English: "Show Tips"
  * Meaning of the instruction: Used for displaying the instruction UI tips mark
  * The triggered effect: Display the instruction UI tips mark
* Chinese: "关闭提示"; English: "Close Tips"
  * Meaning of the instruction: Used for closing the instruction UI tips mark
  * The triggered effect: Close the instruction UI tips mark
* Chinese: "控制向左"; English: "Navigate Left"
  * Meaning of the instruction: The remote control left key, that is, KeyEvent.KEYCODE\_DPAD\_LEFT will be triggered once
  * The triggered effect: The current focus is moved to the left
* Chinese: "控制向上"; English: "Navigate Top"
  * Meaning of the instruction: The remote control up key, that is, KeyEvent.KEYCODE\_DPAD\_UP will be triggered once
  * The triggered effect: The current focus will be moved up
* Chinese: "控制向右"; English: "Navigate Right"
  * Meaning of the instruction: The remote control right key, that is, KeyEvent.KEYCODE\_DPAD\_RIGHT will be triggered once
  * The triggered effect: The current focus will be moved to the right
* Chinese: "控制向下"; English: "Navigate Down"
  * Meaning of the instruction: The remote control down key, that is, KeyEvent.KEYCODE\_DPAD\_DOWN will be triggered once
  * The triggered effect: The current focus will be moved down
* Chinese: "控制点击"; English: "Navigate Click"
  * Meaning of the instruction: The remote control OK key, that is, KeyEvent.KEYCODE\_DPAD\_CENTER will be triggered once
  * The triggered effect: The view with the current focus is clicked
* Chinese: "控制菜单"; English: "Navigate Menu"
  * Meaning of the instruction: The remote control menu key, that is, KeyEvent.KEYCODE\_MENU will be triggered once
  * The triggered effect: The menu key of the current interface is triggered

#### 2.2.4 How to develop 3rd party apps

If you wish that the lark service of the voice assistant perfectly supports the app interface you are developing:

1. Try to keep the attribute clickable of the view for which you want to generate control instructions to be true;

2. Try to trigger the clicking effect of the view by the method onClick, instead of onKeyDown;

3. For the view related to the text for which you want to generate control instructions, try to keep the Chinese content of the text to be more than 2 words and less than 8 words, and the English content to be less than 4 words, and not to mix Chinese and English words;

4. If the view for which instructions can be generated has been hidden in the current scenario, try to use the value View.Gone to hide it, instead of hierarchical overlay; and

5. In the page or list for which the scrolling instructions are needed, it is recommended to use "scroll to the bottom" to trigger loading of more features, instead of the Key event and selection of the ItemView in the last row.

#### 2.2.5 Subsequent features

Subsequently, the lark service will support the view for which you want to generate voice instructions to interact with the voice assistant through configuration of XML properties, so that more accurate instruction contents can be generated.

### 2.3 How to turn off all voice instructions

In some cases, the app needs to close and clear all voice instructions and remove the voice marks for a better immersive experience, for example, in a 3D projection or 3D game. To achieve this, the user needs to integrate the voice plug-in and call the feature portfolio.

For specific use, refer to "Closing all voice instructions" in the offline instruction SDK user's guide, or NoAllInstructLifeAct and NoAllInstructBaseExtendAct in the demo of use of the offline instruction SDK.

### 2.4 Online voice function description

The voice assistant realizes online voice recognition services by connecting to the Rokid cloud platform, and provides developers with voice ASR recognition and TTS online voice synthesis functions.

For specific usage, please refer to Voice Interaction -> Online Speech Recognition Service (Online Voice Use Document), turn off all voice commands, or use SpeechTestAct in Demo for voice command SDK.
