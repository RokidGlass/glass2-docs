# 1.1.1-20191018-150000
#### 系统更新

* 标准版恢复双击back回home的配置，切换方案时随方案切换；
* 增加pvt2设备的alignment参数配置（19年33周生产）；
* 更新系统APP：
	* RokidGallery：修复bug
		1. 手动删除图片后，语音打开相册，列表中仍存在之前删除的图片；
		2. 图库查看图片界面，语音激活：删除图片,大图查看照片数仍为N；
		3. 相册界面调用camera进行录像，录像结束后语音打开相册，相册内容显示为空 等；
	* RokidSettings：
		1. 修改二维码为原始camera API2接口;
		2. 去掉头部控制入口;
		3. 修改切换方案不读取配置json文件；
	* RokidLauncher:
		1. 修改launcher.json的加载规则，先删除 db 中launcher.json对应的应用;
		2. 修复 bug: 进入launcher后wifi图标非未连接而是正常连接的图标；
	* RokidCamera：
		1. 修复摄像界面发送语音：“若琪我要拍照”，界面不会跳转到拍照界面 ;
	* RokidAiCloudApp
		1. 修正FadeInTextView跑马灯动画在跳帧情况下会丢字的bug；

#### 若琪眼镜APP
* 未更新

# 1.1.0-20191012-150000
#### 系统更新

* 移除双击back回home配置，改为应用自行处理；
* 修复投屏时点击tp无效问题；
* 新增根据prop值切换解决方案的功能；
* 更新系统APP：
	* RokidActivation：
		1. 解决连接WFD后，无法连接手机的BUG；
	* RokidSettings：
		1. 增加切换方案功能;
		2. 增加设置人脸识别阈值功能;
	* RokidLauncher:
		1. 增加第三方安装应用，存入 db。重启加载时，和 launch.json 配置白名单应用进行合并;
		2. launch.json 修改 reset 配置，修改重置应用逻辑；
	* RokidCameraDeploy
		1. 图片Base64编解码改成NO_WRAP;
		2. 从设置中读取识别分数阈值，缺省值为80;
		3. 支持通过配置文件切换在线和离线识别;
	* RokidAiSdk
		1. 增加切换方案功能；

#### 若琪眼镜APP
* 未更新

# 1.0.1-20190912-150000
#### 系统更新

* 修复WFD海备斯投屏器一直连不上的问题；
* OTA页面增加升级手机app的提示；
* 更新系统APP：
	* RokidActivation：
		1. websocket动态设置端口;
		2. 升级faceSDK到14;
		3. 在数据库中增加一个字段来表明正在执行人脸特征库批量添加操作;
		4. 其他功能模块crash导致websocket端口占用问题，暂时挂起，未做处理;
		5. 修复杀进程导致websocket端口被占用导致server启动失败配对失败；
	* RokidSettings：
		1. 扫码联网，同时获取uniqueId,转存至Activation;
		2. 兼容绑定若琪账号id;
		3. fix media play position problem;
		4. 修改设置中时区的英文翻译;
		5. 修改获取序列号为直接读取属性值;
		6. WIFI扫描连接新的网络时，实际已连接成功，但页面提示连接失败;
		7. 扫码解析时间戳;
	* RokidRemoteCooperation:[FIX] 眼镜连接TPLink-5Gwifi，无法连接外网时使用远程协作一直crash;
	* RokidCameraDeploy
		1. 正在进行批量添加人脸，使用标记控制人脸识别是否开启;
		2. 人脸SDK升级到14，修复正在升级状态值错误判断;
		3. 通过拦截触摸事件，应用层播放音效，修复单人识别和多人识别界面同一方向触摸两次不触发音效问题;

#### 若琪眼镜APP
**RokidGlassMobileApp：v4.1.3**

1. 在生成二维码页面增加手机状态获取权限检查，对无权限情况crash做保护；
2. 在登陆、切换设备、登出时做若琪账号设备解绑，修复一个账号绑定多设备时，主叫拨打已显示的绑定设备，无法拨通；
3. 升级人脸SDK到14；
4. 在扫码配网中添加是否配网标识，用来区分不传uniqueId时是重新配网还是扫老版本手机app；
5. [fix] 在没有若琪设备绑定时，登出不需要解绑；
6. 修复若琪账号登出后，解绑设备异常；
7. 修改心跳间隔为1分钟。


# 1.0.0-20190829-150000
#### 系统更新
* 更新系统APP：
	* RokidLauncher：
		1. 解决replace package 图标显示问题；
		2. 解决中英文切换问题；
		3. 去除进入和退出应用系统声音；
	* RokidGallery：解决相册在非第一张图片时进入全屏浏览，无法左右滑动；
	* RokidActivation：
		1. 修改连接方式为udp+websocket,用长连接维护设备状态；
		2. 将uniqueId和masterId绑定解绑区分开，uniqueId对应设备绑定，masterId对应账号登录；
		3. 解绑uniqueId的同时，需要解绑master，远程协作不可再用； 
		2. 登录若琪账号后，每次都发送广播,用于远程协作更新masterId状态；
		3. UDP组播携带绑定时的时间戳，用于判定设备绑定先后顺序；
	* RokidSettings：从master主分支合并代码；
		1. 扫码解析时间戳；
		2. 修复WIFI扫描连接新的网络时，实际已连接成功，但页面提示连接失败；
		3. 修改获取序列号为直接读取属性值；
		4. 修改设置中时区的英文翻译；
		5. fix media play position problem；
		6. 保持二维码分辨率1280*720；
		7. 升级cameralib版本到2.1.6 ；
		8. 修改About界面宽度；
		9. fix bug: the large year limit set；
		10. 解决扫描错误的wifi二维码显示连接成功，实际未连接；
		11. 解决无法连接无密码的wifi网络。

#### 若琪眼镜APP

**RokidGlassMobileApp：v4.1.1**

1. wifi二维码携带时间戳，用于判定设备绑定先后；
2. 远程协作拨号列表，选择最后一个；
3. 登出时，会解绑同一deviceTypeId的所有设备，保证每次只有一个绑定；
4. 退出登录，先调用若琪SDK登出，再调用http接口解绑masterId。

# 0.5.3-20190730-150000
#### 系统更新
* 更新system app
	* RokidLauncher：版本重构；
	* RokidCamera：修改App icon；
	* RokidGallery：修改App icon；
	* RokidCameraDeploy：修改App icon；
	* RokidTranslate：修改App icon；
	3. RokidAiSdk：
		- 若琪语音浮层弹出时会重置系统灭屏时间；
		- 抽出条件控制中心架构，统一管理PSensor、Pause Order、Usb Mic 三种条件，并根据不同版本可。
		- 解决audioai 进程crash后，turenso进程无法完全重启的bug；
	1. RokidGlassIME: 新增若琪眼镜输入法。
	2. RokidRemoteCooperation：修改App icon；修复oom内存异常问题，使用系统输入法。
	3. 
	
* OTA增加下载升级进度提示信息。
* 默认使能USB MTP，眼镜连接PC时可以像U盘一样拷贝文件。（Windows10直接可用，Mac需要安装https://www.android.com/filetransfer/）。
* 移除一些无用自带app，节省rom空间。
* 修复自动曝光不可用问题
* 合并创达更新：
	* 使能usb-otg U盘功能；
	* 更新WLAN固件，改善WFD功能稳定性；
	* 修复电池电量跳变问题；
	* 新增单天线配置；
	* 修复蓝牙压力测试时打开失败的问题；
	* 一套image同时兼容单双天线配置；
* 更新PVT机器的alignment参数，提升人脸识别框精度；

# 0.4.7-20190625-150001
#### 系统更新

* 更新system app

	1. RokidSettings: 修改日期设置，最大年份到2037年；
	2. RokidProvision：修改日期设置，最大年份到2037年；
	3. RokidCameraDeploy：更新sdk，使用新的sdk校验方式，解决因日期设置错误导致人脸识别不能使用的问题；解决音量过小的问题

* 增加系统property属性，用于人脸识别sdk校验
#### 若琪眼镜APP

**RokidGlassMobileApp：v4.0.6**

 1. 更新菊风sdk，解决眼镜端音量过小的问题

# 0.4.6-20190614-150000
#### 系统更新

* 更新system app

	1. RokidGallery：修复以下bug
		1. 在相册外语音控制删除图片或视频，删除后界面显示的文件统计数显示错误
		2. 在2000+张图片和视频情况下，进入相册点击文件无法进行全屏显示，显示桌面且长时间卡顿
		3. 播放视频中摘下再戴上眼镜，视频显示的时间为暂停播放的时间，但是再次播放却是从头开始播放
		4. 播放视频时关闭/打开电源，播放界面会跳动闪烁一次
		5. 多种场景下进入相册浏览界面，均会闪烁一次
	2. RokidRemoteCooperation：修复以下bug
		1. 通话时间运行长时间之后，时间显示有问题
		2. glass向重新绑定手机号拨打远程协作，app显示的主叫号码错误
		3. 循环执行多次glass呼叫手机app，偶现双方接通后无任何视频媒体
	3. RokidAiSdk
		1. 全面升级标准版本第三方配置方案。
		2. 支持turen配置文件本地附加配置功能.
		3. 修改离线指令运行配置，部分后羿功能释放成标准方案，通过配置控制。


* 修改屏幕默认亮度为80%（OTA的不会更改用户设置的亮度，刷机版本默认亮度为80%）
* 优化拉起原生投屏ui的方式

#### 若琪眼镜APP
**RokidGlassMobileApp：v4.0.4**

1. 修复若琪眼镜app切换到后台时，手机熄屏状态下glass拨打，手机端无任何反应，打开app也不会弹出接听界面


# 0.4.5-20190610-150001
#### 系统更新

* 更新system app

	1. RokidCameraDeploy：
		* 单人脸识别，选择满足条件的最大人脸；
		* 优化bitmap内存回收
	2. RokidSettings：
		* 增加投屏UI；
		* 优化打开usb调试的点击次数
	3. RokidGallery：
		* 版本重构
		* **需回归测试相册所有功能**

* 更新关机音乐时长。
* 更新开机动画。

# 0.4.4-20190531-150000
#### 系统更新

* 更新system app

	1. RokidCameraDeploy：
		* 退出应用调用finish，并且杀进程；
	2. RokidSettings：
		* 增加恢复出厂设置倒计时功能，倒计时6s，可点击任意键取消；
	3. RokidRemoteCooperation：
		* 解决时间窗口显示异常问题；
	4. RokidCamera：
		* 解决相机内存泄漏；
		* 解决压力测试中的空指针异常。

* 替换了标准版新的关机动画；
* 替换了关机充电的图标。

#### 若琪眼镜APP
**RokidGlassMobileApp：v4.0.3**

1. 增加远程协作涂鸦区域显示和隐藏的动画。

# 0.4.3-20190524-150000

#### 系统更新

* 更新system app

	1. RokidActivation: 
		* 人脸抠图放大为人脸框的两倍，并且上移1/8高;
	2. RokidCameraDeploy：
		* 修复对若琪说"关闭人脸识别"导致的crash；
		* facelib升级到2.2.1.12；
		* 人脸抠图放大为人脸框的两倍，并且上移1/8；
	3. RokidSettings：
		* 增加usb调试开关，在系统信息页面连续点击tp 6次以上调出开关页面；
	4. RokidRemoteCooperation：
		* 延迟展示来电显示，避免显示过期来电消息；
		* 解决了通话过程中部分手机端画面会发生抖动的问题；
		* 解决连接vysor时触摸事件引起crash的问题；
		* alignment根据property获取，并在通话接通前发送给手机端；

* 重新校准了DVT设备的alignment参数，解决人脸识别框偏移问题；
* framework增加对Ethernet连接方式的支持，当有ethernet连接或断开时将发送系统广播；
* 优化戴上、摘下眼镜的开关屏幕方案；
* 增加user编译选项，默认关闭usb调试，关闭usb授权；
* 修改OTA时英文文案。

#### 若琪眼镜APP
**RokidGlassMobileApp：v4.0.2**

1. 移除无人脸信息页面，合并到列表页，状态切换即可；
2. UI修改，文案优化；
3. facelib升级到2.2.1.12；
4. 人脸框抠图放大到两倍，上移1/8；
5. 拨打电话的语音提示；
6. 切换后台的语音处理；
7. 水滴屏适配；
8. 增加Alignment动态适配。

# 0.4.2-20190517-150000

#### 系统更新

* 更新system app

	1. RokidActivation: 
		* 通过MQTT方式来上报局域网地址，更加及时;
		* 修复删除后返回剩余用户数目的BUG;
		* 保存操作的延时改成300ms;
	2. RokidCamera：解决连续进出相机拍照，无拍照音的BUG；
   6. RokidGallery：修复bug：修复bug：播放暂停，播放完毕后时间变为00:00:00;
   7. RokidAiSdk：
	   * 修改眼镜语音公共版默认语音功能，使用双麦语音，添加60、120度两路波束配置；
		* 优化所有turen配置文件，全部改为lothal，去除本地绝对路径；
		* 后羿离线ASR添加“打开/关闭智能识别”、“打开/关闭智能布控”相关指令词；
   7. RokidRemoteCooperation：
		* 降低相机预览帧率至15，优化高功耗导致CPU高温的问题；
		* 解决切换中英文导致应用crash的问题；
		* 解决被动挂断电话后，屏幕闪现手机预览画面的问题；
		* 将相机预览帧格式从YV12改为YUV\_420\_888的格式，以适配multi和passthrough两种情况；
		* 修改返回桌面时显示的时间记录的背景色；

* 修复按键卡顿导致关机的问题；

#### 若琪眼镜APP
**RokidGlassMobileApp：v4.0.0**

1. 修改离线状态时首页功能模块显示；
2. 修复人脸特征管理全选删除，无法选择取消部分勾选；
3. 修复上传某张特定人脸特征记录，界面显示扫描成功且上传成功，但实际并未保存记录；
4. 修复非图片文件上传失败，文件被删除问题；
5. 修复手机切后台，出现无文字的接听界面;
6. 修复远程连接成功，本地没有视频显示；
7. 修复黑屏状态接听，只有取消按钮；
8. 其他异常情况处理;


# 0.4.1-20190515-150001（未部署OTA）

#### 系统更新

* 更新system app

	1. RokidActivation: 
		* 优化和手机APP连网操作
		* 提供WEB服务器操作人脸特征库(在设置—本机信息—中查看web服务地址，在同一个局域网电脑上打开这个地址)
	2. RokidSettings：
	   * 解决开机进入设置-wifi,界面下方存在未命名热点；
  	   * 修改设置中条目信息的最大字符串长度；
	3. RokidCameraDeploy： 
		* 修复未上传人脸库时打开人脸识别失败问题；
		* 对名字和tag显示做长度限制，单人都为12个字符，多人为5个字符
	4. RokidCamera：解决退出再进入相机，状态错误的BUG；
	5. RokidTranslate：
	   * 修复音频临时文件不断创建保存问题；
      * 修改未联网文案；
   6. RokidGallery：修复bug：播放视频过程中暂停/恢复后，播放完毕时显示视频时长为00:00:00
   7. RokidRemoteCooperation：
	   * 添加英文应用名和英文提示语句，适配系统语言为英文的情况，并将名字由远程协助改为远程协作；
		* 添加通话时APP中开启关闭手机摄像头时的页面更新；
		* 灭屏时，显示来电提醒时点亮屏幕；
		* 添加来电铃声；
		* 添加拨打电话时，所拨号码不存在的音频提示；
		* 修复来电被动挂断后，来电提醒对话框未消失的问题；
		* 修复通话过程中，因camera2预览数据长度异常引发的crash问题；
		* 修复退出activity时，DialogPress未结束引发crash的问题；

* 修复WFD时非中心点layer位置错误问题；
* 修改power长按关机时间为3s；
* 修改刷机第一次启动时加密文案错误。

#### 若琪眼镜APP
**RokidGlassMobileApp：v3.1.3**

1. 增加拨号和接听的语音；
2. 通话界面增加通话状态的icon显示；
3. 修复bug：
	* 远程协助连接后，返回，异常退出；
	* 在小米手机非全屏显示，视频底部存在白边；
	* 通话应答时间设置为60s。

4. 已知问题：
	1. 在通话界面，开关前置摄像头，画面会刷新
	2. 涂鸦的区域缩小放大功能未完善

# 0.4.1-20190513-150000（未部署OTA）

#### 系统更新

* 更新system app

	5. RokidActivation: 支持HTTP方式管理人脸特征库和文件管理；
	7. RokidSettings：修复激活词文案显示错误；
	9. RokidLauncher：增加远程协助图标管理；
	10. RokidCameraDeploy： 指定数据库目录，不做拷贝；
	11. RokidRemoteCooperation：新增远程协助功能。

#### 若琪眼镜APP
**RokidGlassMobileApp：v3.1.1**

1. 人脸信息通过Http增删改查；
2. 调整交互；
3. 增加远程协助功能；


# 0.4.0-20190510-150000

#### 系统更新

* 更新system app

	5. RokidCamera
		* 解决在录像界面无法在线语音”拍照“的问题；
		* 增加离线语音支持(打开相机，拍照，关闭相机)；
	6. RokidGallery：增加语音识别支持；
	7. RokidSettings：
		* 添加系统音量、系统电量、系统休眠 三个本地技能；
		* 添加显示WEB服务地址；
	8. RokidAiSdk：
		* 眼镜激活从压制系统、媒体声音改为只压制媒体声音；
	   * 眼镜语音 key、secret 改成从系统 prop中读取，默认值兜底；
	   * 眼镜语音添加 “返回桌面”等全局拦截处理；
	9. RokidLauncher：增加远程协助、绘本识别、物体识别等app的icon；

* 合并创达更新：更新camera tuning库，修复若干bug；
* 修复OTA文案错误。

#### 若琪眼镜APP
**RokidGlassMobileApp：v3.1.10**

1. 优化UI显示；
2. 解决眼镜无法连接手机热点的问题。


# 0.3.9-20190430-150000

#### 系统更新

* 更新system app

	5. RokidActivation:支持文件管理HTTP模式
	6. RokidProvision：修复稳定性bug

* 更新多路camera服务，修复概率性录像失败问题；
* 降低WFD时camera预览画面的亮度，模拟更真实环境；
* 修改调节音量时的逻辑，使用PLATFORM_TELEVISION策略；

#### 若琪眼镜APP
**RokidGlassMobileApp：v3.0.1**

1. 根据设计完成新版人脸特征管理UI和交互
2. 支持自定义相机拍照，前后置摄像头切换，对前置拍照照片作反镜像处理
3. 批处理支持进度显示，完成后显示批处理数量结果
4. 修改应用启动图标
5. 修改文件管理为HTTP模式
6. 代码优化，细节优化

# 0.3.8-20190426-150000

#### 系统更新

* 更新system app

	1. RokidCameraDeploy:
		- 修复退出人脸识别，没有关闭camera的问题；
		- 更新人脸识别sdk2.2.1.2；
	2. RokidSettings：增加恢复出厂设置前的电量检查，低于25%将不允许恢复出厂设置 ；
	3. RokidAiSdk：
		- 修改眼镜语音默认 Activity 启动部分逻辑；
		- 添加asr、nlp前置拦截器；
		- 添加识别状态返回接口，可以区分SDK当前是使用在线还是离线识别状态；
		- 添加通过配置自动设置自定义激活词功能；
* 更新多路camera服务，优化功耗；

* 优化OTA流程，提高稳定性；

* 修改调节音量时的显示逻辑，不再显示震动 闹钟等文案；

* 修复若干user版本的问题。

#### 若琪眼镜APP
**RokidGlassMobileApp：v2.1.4**

1. 修复无法批量导入图片问题；
2. 增加绑定设备后同步眼镜端人脸数据；

# 0.3.7-20190417-150000

* 更新system app

	1. RokidCameraDeploy:
		- 解决卡在识别中界面的BUG；
		- 解决出现”识别中“和”请对正脸“连续切换的问题；
		- 解决偶现SDK中出现crash问题；
	2. RokidActivation：
		- 修改加密算法，解决部分机器无法绑定的问题；
		- 增加和公版APP交互功能(特征库管理)；
	3. RokidCamera：增加每次拍照后发送媒体库变化的广播；
	4. RokidTranslate：状态动画修改，线程优化；
* 调整关机充电百分比文字的位置；

#### 若琪眼镜APP
**RokidGlassMobileApp：v2.1.1**

1. 增加对眼镜端在线状态的判断；
2. 增加绑定眼镜后，同步眼镜端特征库功能；
3. 修复其他一些异常crash；
4. 修改设备管理UI，增加APP版本显示；

2. 已知问题
	- 在添加特征库过程如果出现失败，数据库没有重传机制。所以请确保在添加特征库过程，眼镜端保持在线。

# 0.3.6-20190413-150001

* 更新system app
	1. RokidSetting：增加日期设置；
	2. RokidLauncher：替换远程协助icon；
	3. RokidProvision：修复bug；
	4. RokidAiSdk：
		- 修复client socket crash 后，再次连接，无法将数据传送到turen的bug；
		- 修复turen error之后，再次使用主动拾音，只能吐出asr，不返回nlp的bug；
	5. RokidCameraDeploy:
		- 人脸识别库动态更新；
		- 单人识别中针对区域识别；
		- sdk版本2.2.0.6版本；
	6. RokidActivation：
		- 增加HTTP服务器，用来接收特征库数据库；
		- 增加接收媒体库变化的广播；
	7. RokidCamera：增加每次拍照后发送媒体库变化的广播
* 更新创达改动：
	- 修复多路cam录像花屏问题，偶现crash问题；
	- 更新了正式release的modem和xbl分区；
* 增大关机充电百分比文字的字体；
* 关闭了自动时间和时区校准；
* 增大了投屏显示的ui大小.

# 0.3.5-20190404-150003

* 更新system app
	1. RokidSetting：移除后羿相关逻辑代码；
	2. RokidLauncher：去除了单击back键启动相机的功能；
	3. RokidProvision：增加了日期设置；
	4. RokidAiSdk：
		- 向外暴露每次激活时本次激活的激活词信息；
		- 修复不激活无法使用离线asr的问题；
		- 接入lothal 最近版本，修改录音方式到多路麦克录音。
* power+vol减截屏时，打开camera拍摄一张图片叠加在ui上；

* 增大了刷机后第一次启动时的默认音量；

* 增加了多路mac的功能。
# 0.3.4-20190329-150000

*	合并创达patch：修复多路camera拍照后无法预览问题，支持API2的FULL level；
*	修复音量加键偶现无反应的问题；
*	增加sdk加密校验算法；
*	修改OTA ui效果
*	更新系统app
	1.	RokidAiSdk
		-	完成按键语音识别流程改为根据录音状态来判断是否显示浮层。
		-	添加中英文错误Toast提示
	2.	RokidCameradeploy
		-	解决RokidCameraDeploy出现闪退问题
		-	修改UI显示
	3.	RokidSettings
		-	增加恢复出厂设置选项
		-	修改UI显示


# 0.3.2-20190322-150001

* 合并创达patch
	1. 回退最大音量修改patch，重新修改
	2. 更新camera tunning库
	3. 修复待机电流bug
* 修复开机超过5分钟后进行蓝牙配对，不弹窗的问题
* 根据RokidSetting的需求，修改双击tp的键值为ENTER
* 更新系统app
	1. RokidAiSdk
		- System.Exit时 添加清空技能栈逻辑。
		- 修复无法重新启动rokid语音功能的bug。
		- 修复眼镜浮层偶现需要10秒才能关闭的bug。
		- 优化语音相关的配置文件。
	2. RokidAiSkillEngine
		- 关闭在线状态的本地指令功能，其他app语音控制改为本地技能模式。
		- 修复SkillEngine中技能栈上报链路出错的bug。
		- 修复清空技能栈的同时没有清空clear 技能cache的bug。
	3. RokidCameradeploy
		- 增加语音控制。
		- 修改使用CameraLabraity版本1.0.7.8功能。
		- 修改UI显示，优化新朋友显示逻辑。
	4. RokidLauncher : 修复电量显示bug，修改ui布局设计
	5. RokidSettings
		- 接入语音操作功能
		- 在关于界面长按直接进入投屏
		- 取消重启语音服务的toast
	6. RokidTranslate：接入语音操作功能
	7. RokidCamera：接入语音操作功能
	8. RokidGallery: 接入语音操作功能

# 0.3.1-20190318-150000

*	更新system app
	1.	RokidSetting：系统信息页面长按tp可以直接拉起投射。
	2.	RokidCameraDeploy：重新设计ui，增加单脸识别和多脸识别功能，支持若琪眼镜app导入人脸数据。 
*	修复WFD时视频播放显示异常的问题
*	关闭联网后自动时间校准

# 0.3.0-20190315-150000

*	更新system app
	1.	RokidAiSdk：
		*	添加后羿离线语音功能，语音SDK会通过包名是否存在探测当前设备是普通模式还是后羿模式。。
		*	解决语音SDK初次启动偶现跨进程监听之后，无法自启动数据链接工具类的bug。
		*	修复按键模式语音浮层首次弹出，无法自动关闭的bug。
	2.	RokidSetting：
		*	重新设计WIFI 扫描二维码模块，支持camera2 API
		*	修改按键keycodedpadcenter
		*	修改蓝牙可见性
	3.	RokidGallery：修改按键keycodedpadcenter。
	4.	RokidProvision：修改按键keycodedpadcenter。
	5.	RokidCamera：修改录像尺寸为16：9，修改按键keycodedpadcenter。
	6.	RokidActivation：增加特征库管理接收数据功能。
	7.	RokidTranslate：修改按键keycodedpadcenter。

*	合并TS的多路camera patch，可以支持多app同时打开camera。
*	App crash或ANR时不再弹出dialog，改为toast提醒。
*	增大系统property字节数到128。
*	增加系统alignment和当前硬件版本的property属性。
*	删除系统vr feature的xml配置文件。
*	根据aligment参数调整WFD显示区域。
*	修复截屏图像异常bug。
*	修改系统TP点击按键键值，从ENTER改为DPAD_CENTER。
*	修改蓝牙可见时间，当应用打开蓝牙未设置可见时间时，蓝牙始终可见。

# 0.2.2-20190308-150056

*	更新system app
	1.	RokidAiSdk：
		*	添加后羿模式，通过包名判断。
		*	去除“没事了”激活词配置。
		*	优化录音架构并修改代码，使用系统改动来规避麦克风权限占用问题。
	2.	RokidAiSkillEngine：
		*	统一校准离线asr字段。
	3.	RokidGallery：更新头控sdk方向。
	4.	RokidSetting：重新排列菜单项，更新头控sdk方向。
	5.	RokidLauncher：更新电量显示，更新头控sdk方向。
	6.	RokidRadashoot：更新IMU方向。
*	修改了系统IMU方向，与普通手机竖放的方向一致，可兼容google vr app的方向。
*	修复设置语言后，rokidkeyboard无法拉起的问题。
*	放开系统Audio source HOTWORD的权限，可供语音助手使用。
*	修改OTA服务启动时间，开机后直接启动，不再等待90s。

# 0.2.1-20190301-150055

*	更新system app
	1.	RokidCamera: 修改左右滑动可以自由切换录像和拍照模式
	2.	RokidAiSdk：
		*	接入turen新架构版本lothal，完善全部jni。
		*	添加中文离线asr识别功能。
		*	通用版本中添加网络变动时自动切换成离线/在线功能。
	3.	RokidAiSkillEngine：
		*	添加本地指令处理离线asr命令功能。
		*	本地指令中添加全局固定指令配置。
		*	修改一些技能的默认本地指令配置。
	4.	RokidActivation：添加登录后上报设备信息，可以在若琪APP设置中查看。
	5.	RokidGallery：修改删除图片英文提示。
	6.	RokidSetting：增加操作指南和时间设置入口，增加系统更新入口，拉起原生setting的功能改为直接拉起“显示”设置页面。
	7.	RokidLauncher：修改游戏名称图标支持。
	8.	RokidProvision：新增开机系统引导App，在刷完机第一次开机时或者恢复出厂设置后启动。
	9.	RokidTranslate：修改新的交互方式。
	10.	RokidRadashoot：替换为新游戏：突袭。
	11.	CameraDeploy: 修改人脸最大识别数10，修复camera抢占问题。
*	修改系统SystemUi默认通知展示的样式：修改长宽及背景色。
*	重构OTA流程，移除了自动更新，需要用户在setting中主动发起。

# 0.1.9-20190222-150053

*	更新system app
	1.	RokidCamera: 拍照分辨率改成16：9
	2.	RokidAiSdk：
		*	按键模式下，增添不佩戴无法使用限制。
		*	更新代码并适配最新的RokidAiSkillEngine。
		*	将本地指令迁移到RokidAiSkillEngine中。
	3.	RokidAiSkillEngine：
		*	架构完全重构，提出center、executor概念模块。
		*  修改消息传递方式，预留出适应局域网传递接口。
		*	增加本地技能搜索、nlp传递、拦截控制等相关功能。
	4.	RokidAiCloudApp：
		*	更新代码并适配最新的RokidAiSkillEngine。
	5.	RokidCameraDeploy：支持中英文菜单
*	back双击改回默认launcher，可以通过修改system/etc/SystemConfig.prop的配置自定义
*	增加property属性，可以设置默认launcher
*	增加后羿device目录，编译后羿专用镜像
集成进RokidKeyboard，并设置成默认输入法，支持tp操作：前后滑动tp控制光标左右，音量键+-控制光标上下，点击tp确认输入。

# 0.1.8-20190201-150052

*	更新system app
	1.	RokidCamera: 相机增加语音控制拍照和退出功能
	2.	RokidCameraDeploy: 重构识别流程，优化识别速度
	3.	RokidShow：移除
*	移除自动时区功能
*	增加realtek r8150/8152 USB网卡驱动支持
*	ota更新增加dsp.img分区
*	修复默认setting中投射无法点击的问题
*	同步创达更新
	1.	配合产线需求和PC工具，增加Psensor校准功能
	2.	配合产线需求和PC工具，修改音频测试配置
	3.	合入高通解决modem死机patch
	4.	删除动态库中的冗余打印

# 0.1.7-20190125-150044

*	更新system app
	1.	RokidActivation：修复文件管理的一些BUG
	2.	RokidCamera: 修改切换到视频模式就停止语音，避免录像和语音服务冲突导致的crash
	3.	RokidSettings: 增加在本机信息中启动原生设置的隐藏入口
	4.	RokidGallery：修复了连续删除照片crash问题
*	修改打开投射时，默认开启wfd功能
*	修改setting，打开投射时获取按键焦点，方便tp控制wfd
*	整理按键逻辑，修复双击返回键遗留bug
*  修复zoom app 没有声音的bug

# 0.1.4-20190118-150041

*  更新system app 
	1.	RokidAiCloudApp 伟明 -迁出engine、TtsService，并优化剩余代码
	2.	RokidAiSdk/ 伟明 -接入ProximitySensor监听，完成眼镜语音助手“若琪”激活模式用户佩戴、不戴、息屏、亮屏等交互逻辑优化; 修复语音浮层弹出，屏幕亮起功能
	3.	RokidCamera/ 恒锋 -
	4.	RokidCameraDepoly/。 闻斌 无更新
	5.	RokidGallery/。 杨剑 -1. 替换删除按钮​​.2. app那边删除图片同步
	6.	RokidLauncher/。 杨剑 -修复时间显示的crash
	7.	RokidSettings/ 恒锋 -
	8.	RokidTranslate/。 恒锋 无更新
	9.	RokidActivation 恒锋 -。
* WFD功能增加camera 预览为背景
* 双击返回不再回到launcher，改为发送intent广播 
* ota升级成功后发送intent广播
* 同步创达更新
	1. remove gps hal
	2. remove unused module in kernel
	3. TRY_SINK to swap to UFP while plugging in a typec dev
	4. modify audio ftm config file
	5. update TP firmware
	6. remove iop
	7. resolve AutioTimeZone issue

# 0.1.3-20190111-150040

* 更新system app 
	1.	RokidAiCloudApp 伟明 -修改tts通知名称，用新正则过滤所有技能tts
	2.	RokidAiSdk/ 伟明 -语音唤醒词修改 rada为游戏、showroom为播放器，优化其他本地指令
	3.	RokidCamera/ 恒锋 -录制过程中无法唤醒若琪; 录制视频的时间放在中间显眼的位置
	4.	RokidCameraDepoly/。 闻斌 -识别不到的时候显示绿色框和“新朋友”文案
	5.	RokidGallery/。 杨剑 -长按删除照片及视频交互方式改变。
	6.	RokidLauncher/。 杨剑 -桌面支持头部运动浏览图标
	7.	RokidSettings/ 恒锋 -设置新增头部运动开关，控制相册、桌面、设置列表的头部运动浏览。
	8.	RokidTranslate/。 恒锋 无更新
	9.	RokidActivation 恒锋 -集成mqtt，实现glass扫二维码后与账户绑定，glass语音触发可在app上看到相应信息；在APP端管理相册中的照片及视频。
* 增加从persist分区读取seed并设置property的功能
* 修复md5校验错误导致无法下载新的ota升级包的问题 
* 修复ota弹窗显示不全的问题

# 0.1.2-20180104-150033

*	 更新system app（RokidAiCloudApp, RokidAiSdk, RokidCameraDeploy, RokidGallery, RokidLauncher，RokidTranslate），增加RokidActivation
*	 增加rokid glass type id
*	 修复keyevent 事件的上报逻辑
*	 去除Psensor自动校正
*	 更新IMU sensor校正
*	 修改百度时区sdk的key
*	 删除vendor下的Generic.kl，解决增量编译按键错误的问题



