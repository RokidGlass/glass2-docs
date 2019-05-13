# Glass 软件开发文档

## 介绍
-   下列文档包含了系统配置方法，SDK使用文档，公版App的介绍。  

## 如何在Glass上开发App？
-   开发者可以基于Rokid提供的SDK开发眼镜端App，或者用已有的App做眼镜适配。
-   眼镜适配方法（与Android手机上App的开发区别）：
    -   Touch screen -> Touch pad：部分类型的控件需要自定义焦点控制。
    -   有preview -> 无preview：真实世界不需要preview（具体可参考UI SDK）。
    -   相机映射alignment：相机世界需要映射到真实世界（具体可参考UI SDK）。
    -   Glass风格的UI：参考UI设计规范和UI SDK。
    -   如果需要使用系统AR投屏功能, 建议使用Android Camera2.0开发应用。
