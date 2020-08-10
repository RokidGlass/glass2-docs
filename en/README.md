# Glass（二代）软件开发文档

[![Build Status](https://travis-ci.org/RokidGlass/glass2-docs.svg?branch=master)](https://travis-ci.org/github/RokidGlass/glass2-docs)

## 介绍
-   本文档面向Rokid Glass的开发者，介绍了开发者如何在Rokid Glass上开发应用。(The document provides the guidelines for the developers to build the app in Rokid Glass)
-   本文档包含了系统配置方法，Rokid Glass SDK使用文档。(The document includes the system settings, and the user guide for Rokid Glass SDK)

## 如何在Glass上开发App？(how to devlep app in glasses)
-   开发者可以基于Rokid提供的SDK开发眼镜端App，或者用已有的Android App做眼镜适配。(THe developers can build the app in the glasses with SDK or port the Android app into the glasses.
-   眼镜适配方法（与Android手机上App的开发区别）(Porting apps into the glasses/Different from developing app in the smartphone)：
    -   Touch screen -> Touch pad：部分类型的控件需要自定义焦点控制。
    	 (Touch screen -> Touch pad：some controls need to be customized for the 		focus control)
    -   有preview -> 无preview：真实世界不需要preview（具体可参考UI SDK）。
    	 (With Preview -> No Preview: the preview is not nessesary in the real world.(UI SDK))
    -   相机映射alignment：相机世界需要映射到真实世界（具体可参考UI SDK）。
    	(Aligment between Camera and Display: mirror the camera prevew into the real world. (UI SDK))
    -   Glass风格的UI：参考UI设计规范和UI SDK。
    	(UI for Glasses: UI guideline and SDK)
    -   如果需要使用系统AR投屏功能, 建议使用Android Camera2.0开发应用。
    	(Suggest to use Camera2.0 if developing the app with the feature of the system-level AR project)
