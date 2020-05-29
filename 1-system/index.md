**Version：V1.1**

<h2 id="1">设备按键键值（System KeyCode）</h2>

用户操作(Action)  | 简单功能描述(Result) | 应用层键值（KeyCode） | 注释（Notes）
-------  | ----------- | ------------ | ---
Back-长<br>(Back long press)| 开启快捷菜单<br>(open shortcut)| none | 被系统占用<br>(System handled)
Back-单<br>(Back click)  | 返回<br>(Back)  | KEYCODE\_BACK = 4 | 
TP-前滑<br>(swipe forward)  | 应用可同时收到多个<br>KEYCODE\_DPAD\_RIGHT键值和单个<br>KEYCODE\_DPAD\_DOWN键值<br>(App can get severl KEYCODE\_DPAD\_RIGHT and one KEYCODE\_DPAD\_DOWN )  | KEYCODE\_DPAD\_DOWN = 20<br>KEYCODE\_DPAD\_RIGHT = 22 | 希望焦点跳一个，使用DOWN；希望焦点跳多个，使用RIGHT，键值数与滑动距离正相关；<br>(Use DOWN for next focus; use RIGHT for severl focus switch, KEYCODE\_DPAD\_RIGHT number is releated to swipe length.) |
TP-后滑<br>(swipe backward)  | 应用可同时收到多个<br>KEYCODE\_DPAD\_LEFT键值和单个<br>KEYCODE\_DPAD\_UP键值<br>(App can get severl KEYCODE\_DPAD\_LEFT and one KEYCODE\_DPAD\_UP )  | KEYCODE\_DPAD\_UP = 19<br>KEYCODE\_DPAD\_LEFT = 21 |希望焦点跳一个，使用UP；希望焦点跳多个，使用LEFT，键值数与滑动距离正相关；<br>(Use UP for previous focus; use LEFT for severl focus switch; KEYCODE\_DPAD\_LEFT number is releated to swipe length.)
TP-单击<br>(TP tap) | 确认<br>(Confirm/Select) | KEYCODE\_DPAD\_CENTER = 23
TP-长按<br>(TP-long press) |  | KEYCODE\_TV = 170 | 应用可自定义<br>(App handle)
Power | 电源键<br>(turn on/off screen) | KEYCODE\_POWER = 26 |