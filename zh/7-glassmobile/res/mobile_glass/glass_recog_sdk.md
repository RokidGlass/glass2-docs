# 人脸、车牌SDK

## 简介

车牌人脸SDK主要功能包含车牌人脸检测、人脸跟踪、人脸质量、离线车牌人脸识别等；可以快速识别眼前的人脸车牌数据，并与数据库进行对比，对重点车牌人脸数据进行报警提示；

## 接入前提

- [在接入人脸车牌识别SDK前需要先接入 眼镜硬件SDK，详情查看1.0眼镜硬件相关文档](glass_hardware.md)

## 快速上手

1. 首先需要在项目的build.gradle文件中引入如下配置：

  ```java
   allprojects {
           repositories {
               maven { url = 'https://dl.bintray.com/rokid/alliance/' }
           }
   }
  ```

2. 在项目的module的build.gradle中导入如下依赖

  ```java
  dependencies {
    .......
    // 集成人脸车牌sdk
    implementation 'com.rokid.alliance.magicsdk:magicsdk:1.1.7'
  }
  ```

3. 其他配置注意说明:

  ```java
   defaultConfig {
          applicationId "......"
          // minSdkVersion >= 21
          minSdkVersion 21
          // targetSdkVersion <= 27
          targetSdkVersion 27
      }
  // 需要指定java 8版本
  compileOptions {
      sourceCompatibility JavaVersion.VERSION_1_8
      targetCompatibility JavaVersion.VERSION_1_8
  }
  ```

4. 以下权限在6.0以上设备上需要动态申请

  ```java
  private static final String[] REQUIRED_PERMISSION_LIST = new String[]{
           Manifest.permission.WRITE_EXTERNAL_STORAGE,
           Manifest.permission.READ_EXTERNAL_STORAGE,
           Manifest.permission.RECORD_AUDIO,
           Manifest.permission.CAMERA,
           Manifest.permission.READ_PHONE_STATE,
   }
  ```

5. 初始化SDK及设备

	> 初始化设备以及设置识别模式

  ```java
  private void initGlass(){
      // initUsb设备，需要传入CameraViewInterface，如果不需要该view可见，可以将其宽高大小设置为1dp
      RKGlassDevice.RKGlassDeviceBuilder.buildRKGlassDevice().build().initUsbDevice(this, findViewById(R.id.uvc_preview), new OnGlassConnectListener() {
          @Override
          public void onGlassConnected(UsbDevice usbDevice, GlassInfo glassInfo) {
              // 眼镜连接成功回调
          }

          @Override
          public void onGlassDisconnected() {
              // 眼镜断开连接回调
          }
      });

      BaseLibrary.initialize(getApplication());

      // 设置识别类型,以及是否为在线模式
      // 首次调用必须在initGlassUI函数被调用之前 后续切换识别模式正常调用即可
      //  RecognizeType.IS_SINGLE_RECOGNIZE 单人布控
      //  RecognizeType.IS_MULTI_RECOGNIZE 多人核查 
      // RecognizeType.IS_PLATE_RECOGNIZE  车牌识别
      RKGlassUI.getInstance().recogSettingChanged(RecognizeType.IS_MULTI_RECOGNIZE, true);
      RKGlassUI.getInstance().initGlassUI(getApplicationContext());
  }
  ```

6. 在线 人脸 && 车牌 识别 

	> 在线识别需要将识别到的图片上传到云端进行对比，将对比结果返回。然后在相应回调用将返回结果发送给眼镜端进行展示；

  ```java
  /*
   * 在线识别
   */
  private void initOnlineRecog() {
      // 加载人脸模型
      RKAlliance.getInstance().loadFaceModel(getApplicationContext(), null);
      // 加载车牌模型
      RKAlliance.getInstance().loadLPRModel(getApplicationContext(), null);

      // 人脸车牌在线识别监听返回结果
      OnlineRecgHelper.getInstance().init(new OnlineRequest() {
          @Override
          public void sendFaceInfo(ReqOnlineSingleFaceMessage reqOnlineSingleFaceMessage) {
              //TODO: 将人脸信息上传云端做比对
              // 此处为模拟结果返回，实际要比对完成后再返回
              RespOnlineSingleFaceMessage respOnlineSingleFaceMessage = new RespOnlineSingleFaceMessage();
              respOnlineSingleFaceMessage.setServerCode(RespOnlineSingleFaceMessage.ServerErrorCode.OK);  //设置返回码，正常返回OK，异常详见ServerErrorCode定义
              FaceInfoBean faceInfoBean = new FaceInfoBean();
              faceInfoBean.setName("xxx");  //在线识别 人员名字
              faceInfoBean.setNativeplace("浙江.杭州");  // 在线识别 人员籍贯，比如"浙江.杭州"
              faceInfoBean.setCardno("xxxxxxxxxxxxxxxx");  //在线识别 人员身份证信息
              faceInfoBean.setTag("上访人员");    //在线识别 人员标签信息，比如"逃犯"/"可疑人员"/"上访人员"
              faceInfoBean.setAlarm(true);  //是否开启警报音
              Bitmap bm = BitmapUtils.bytes2bitmap(reqOnlineSingleFaceMessage.getFaceImage(), reqOnlineSingleFaceMessage.getWidth(), reqOnlineSingleFaceMessage.getHeight());
              faceInfoBean.setFaceImage(ImageUtils.bitmap2Bytes(bm));   //在线识别后需要眼镜端展示的人员头像图片数据，此处只是mock了从眼镜端截取的图片数据
              respOnlineSingleFaceMessage.setTrackId(reqOnlineSingleFaceMessage.getTrackId());
              respOnlineSingleFaceMessage.setFaceInfoBean(faceInfoBean);
              respOnlineSingleFaceMessage.setServerCode(RespOnlineSingleFaceMessage.ServerErrorCode.OK);
              OnlineRecgHelper.getInstance().onFaceOnlineResp(respOnlineSingleFaceMessage);   //调用此接口将在线识别结果返回给眼镜
          }

          @Override
          public void sendPlateInfo(ReqCarRecognizeMessage reqCarRecognizeMessage) {
              //TODO: 将车牌信息上传云端做比对
              // 此处模拟结果返回，实际要比对完成后再返回
              RespCarRecognizeMessage respCarRecognizeMessage = new RespCarRecognizeMessage();
              respCarRecognizeMessage.setErrorCode(0);
              CarRecognizeInfoBean carRecognizeInfoBean = new CarRecognizeInfoBean();
              carRecognizeInfoBean.setPlate("浙ADA0178");  //车牌号
              carRecognizeInfoBean.setOwner("xxxx");  // 车主姓名
              carRecognizeInfoBean.setBrand("BYD");  //品牌
              carRecognizeInfoBean.setColor("红");  //车身颜色
              carRecognizeInfoBean.setTag("xxxxxxx");  //标签信息，比如"违章3次"/"失踪车牌" 等
              respCarRecognizeMessage.setCarRecognizeInfoBean(carRecognizeInfoBean);
              respCarRecognizeMessage.setErrorCode(0);
              OnlineRecgHelper.getInstance().onPlateOnlineResp(respCarRecognizeMessage);  //调用此接口将在线识别结果返回给眼镜
          }
      });
  }

  @Override
  protected void onDestroy() {
      super.onDestroy();
      // 在onDestroy中做相应的资源释放
      RKAlliance.getInstance().releasePlateSdk();
      RKAlliance.getInstance().releaseFaceSdk();
      RKGlassDevice.getInstance().deInit();
      OnlineRecgHelper.getInstance().init(null);
  }
  ```

7. 离线人脸识别

	> 新建相关的监听回调

  ```java
  /*
   * 预览的监听回调
   */
  final AbstractUVCCameraHandler.OnPreViewResultListener onPreviewFrameListener = new AbstractUVCCameraHandler.OnPreViewResultListener() {
      @Override
      public void onPreviewResult(byte[] bytes) {
          RKAlliance.getInstance().setData(bytes);
      }
  };

  /**
   * 人脸识别成功监听回调
   */
  final Callback<RKFaceModel> faceCallback = new Callback<RKFaceModel>() {
      @Override
      public void onDataResult(RKFaceModel rkFaceModel, byte[] bytes) {
          if (rkFaceModel.getFaceList() == null) {
              return;
          }
          RKFaceDO faceDO = rkFaceModel.getMaxFace();
          Log.d(TAG, "onDataResult: ::: 【离线识别成功过】");
          if (faceDO.featid != null) {
              tvNameResult.post(() -> {
                  UserInfo userInfo = FaceIdManager.getInstance().getUserInfoByFid(faceDO.featid);
                  // 显示识别到的信息
                  Bitmap bm = FaceIdManager.getInstance().getUserImageByFid(faceDO.featid);
                  bm = BitmapUtils.GetRoundedCornerBitmap(bm);
                  if (bm != null) {
                      imageHeadResult.setImageBitmap(bm);
                  }
                  tvNameResult.setText(userInfo.getName());
                  tvCardResult.setText(userInfo.getCardno());
              });
          }
      }
  };
  ```

	> 加载人脸模型，初始化人脸SDK，注册人脸监听识别

  ```java
  /**
   * 初始化离线识别
   */
  private void initOfflineGlass() {
      // 加载人脸模型
      RKAlliance.getInstance().loadFaceModel(getApplicationContext(), new PreparedListener() {
          @Override
          public void onPrepared() {
              // 初始化人脸数据库
              FaceIdManager.getInstance().init(getApplicationContext());
              FaceDataManager.getInstance().init(getApplicationContext());
          }
      });

      // 初始化人脸SDK
      RKAlliance.getInstance().initFaceSDK(getApplicationContext(), Utils.getInstance().getRoi(), new PreparedListener() {
          @Override
          public void onPrepared() {
              RKGlassDevice.getInstance().setOnPreviewFrameListener(onPreviewFrameListener);
          }
      });

      // 注册人脸识别监听
      RKAlliance.getInstance().registerFaceListener(faceCallback);
  }
  ```

	> 添加人脸到数据库中，并重新loadsdk

  ```java
  /**
   * 保存离线人脸数据
   */
  private void addImportData() {
      Person person = new Person();
      person.setName("姓名");
      person.setCardNo("身份证号");

      // 图片路径
      String faceFilePath = Utils.getRealFilePath(getApplicationContext(), faceUri);
      Log.d(TAG, "addImportData: faceFilePath:::" + faceFilePath);
      final List<FeatFileInfo> featFileInfos = new ArrayList<>();
      // 提取特征的返回值
      final ExtractFeatResult extractFeatResult = FaceDataManager.getInstance().extractFeat(BitmapFactory.decodeFile(faceFilePath));
      if (extractFeatResult.getResultCode() == 0) {
          // 特征提取成功添加到数据库中
          FeatFileInfo featFileInfo = new FeatFileInfo();
          featFileInfo.setFilePath(faceFilePath);
          featFileInfos.add(featFileInfo);
          // 添加离线人脸数据
          FaceDataManager.getInstance().addPerson(person, featFileInfos, null, true);
          Toast.makeText(this, "离线人脸数据添加成功", Toast.LENGTH_LONG).show();
          // 重新加载数据模型
          reloadSdk();
      } else {
          Toast.makeText(this, extractFeatResult.getResultMsg() + "", Toast.LENGTH_LONG).show();
      }
  }

  /**
   * 新增数据时需要重新loadsdk
   */
  private void reloadSdk() {
      RKAlliance.getInstance().releaseFaceSdk();
      RKAlliance.getInstance().loadFaceModel(getApplicationContext(), new PreparedListener() {
          @Override
          public void onPrepared() {

          }
      });

      RKAlliance.getInstance().initFaceSDK(getApplicationContext(), Utils.getInstance().getRoi(), new PreparedListener() {
          @Override
          public void onPrepared() {

          }
      });

      RKAlliance.getInstance().registerFaceListener(faceCallback);
  }
  ```

	> 释放相关资源

  ```java
  @Override
  protected void onDestroy() {
      super.onDestroy();
      // 在onDestroy中对相应的资源做释放；
      RKAlliance.getInstance().releaseFaceSdk();
      RKGlassDevice.getInstance().removeOnPreviewFrameListener(onPreviewFrameListener);
      RKGlassDevice.getInstance().deInit();
  }
  ```

8. 离线车牌识别

	> 相关的监听回调

  ```java
  /**
   * 车牌识别监听回调
   */
  final Callback<RKLPRModel> plateCallBack = new Callback<RKLPRModel>() {

      @Override
      public void onDataResult(RKLPRModel lprModel, byte[] bytes) {
          if (lprModel.lps == null || lprModel.lps.size() == 0){
              return;
          }
          Log.d(TAG, "onDataResult: ::: 【车牌识别成功】");
          for (RKLPRDO lprItem: lprModel.lps) {
              if (lprItem.score > 0.97){
                  tvPlateResult.post(() -> {
                      String plateNum = lprItem.licensePlate;
                      tvPlateResult.setText(plateNum);
                      Bitmap bm = BitmapUtils.nv21ToBitmap(bytes, PREVIEW_WIDTH, PREVIEW_HEIGHT, lprItem.toRect(PREVIEW_WIDTH, PREVIEW_HEIGHT));
                      imgPlateResult.setImageBitmap(bm);

                      PlateInfo plateInfo = PlateManager.getInstance().queryPlateInfo(plateNum);
                      if (plateInfo !=null){
                          tvOwnerResult.setText("品牌：" + plateInfo.getBrand() + "， 车主：" + plateInfo.getOwner());
                      }else{
                          tvOwnerResult.setText("离线数据库暂无其他信息");
                      }
                  });
              }
          }
      }
  };
  ```

	> 识别设置

  ```java

  private void initGlassView() {
      BaseLibrary.initialize(getApplication());

      // 设置为离线车牌识别
      BaseLibrary.getInstance().setRecogType(RecognizeType.IS_PLATE_RECOGNIZE);
      BaseLibrary.getInstance().setIsOnline(false);
      RKGlassUI.getInstance().initGlassUI(getApplicationContext());

      // 注册识别监听
      RKAlliance.getInstance().registerLPRCallback(plateCallBack);

      // 加载车牌模型
      RKAlliance.getInstance().loadLPRModel(getApplicationContext(), new PreparedListener() {
          @Override
          public void onPrepared() {

          }
      });

      // 初始化车牌sdk
      RKAlliance.getInstance().initPlateSDK(new PreparedListener() {
          @Override
          public void onPrepared() {

          }
      });
  }

  @Override
  protected void onDestroy() {
      super.onDestroy();
      RKAlliance.getInstance().releasePlateSdk();
      RKGlassDevice.getInstance().deInit();
  }
  ```



## 进阶内容

### 离线人脸数据库操作

> 添加离线人脸数据时，会将人物信息保存在tbl_user表中，而将人脸图片保存在tbl_mapping表中；
>
> tbl_user表：数据模型为UserInfo.java；
>
> tbl_mapping表：数据模型为œFaceMapping.java；

- 添加数据:: ErrorCode addPerson(Person person, List<FeatFileInfo> featFileInfos, String coverId, boolean needSave)；

| 参数          | 类型               | 能否为空 | 说明               |
| ------------- | ------------------ | -------- | ------------------ |
| person        | Person             | False    | 人员信息           |
| featFileInfos | List<FeatFileInfo> | False    | 人脸图片的特征信息 |
| coverId       | String             | True     | 作为底图的图片id   |
| needSave      | boolean            | False    | 是否需要保存       |

  ```java
  private void addData() {
      // 数据存入数据库
      Person person = new Person();
      person.setName("姓名");
      person.setCardNo("身份证号");
    	// 图片路径
  		String faceFilePath = Utils.getRealFilePath(getApplicationContext(), faceUri);
  		List<FeatFileInfo> featFileInfos = new ArrayList<>();
  		// 提取特征的返回值
  		ExtractFeatResult extractFeatResult = FaceDataManager.getInstance().extractFeat(BitmapFactory.decodeFile(faceFilePath));
  		if (extractFeatResult.getResultCode() == 0) {
      		// 特征提取成功添加到数据库中
      		FeatFileInfo featFileInfo = new FeatFileInfo();
      		featFileInfo.setFilePath(faceFilePath);
      		featFileInfos.add(featFileInfo);
      		// 添加离线人脸数据
      		FaceDataManager.getInstance().addPerson(person, featFileInfos, null, true);
      		// 重新加载数据模型
      		reloadSdk();
  		} else {
      		// 人脸特征提取失败
  		}
  }
  ```

- 查询数据:: DeployTaskListInfo getDeployTaskListByOffset(String searchString, int offset, int pageSize)；

| 参数         | 类型   | 能否为空 | 说明                                         |
| ------------ | ------ | -------- | -------------------------------------------- |
| searchString | String | True     | 关键词，根据姓名或者身份证号信息进行模糊查询 |
| offset       | int    | False    | 数据起始位置                                 |
| pageSize     | int    | False    | 查询数量                                     |

  ```java
  private void queryData() {
      int dataCount = FaceIdManager.getInstance().getAllUserNum();
      // 查询数据
      DeployTaœskListInfo deployTaskList = FaceDataManager.getInstance().getDeployTaskListByOffset(null,0,dataCount);
      List<DeployTask> deployTasks = deployTaskList.getDeployTasks();
    
      StringBuffer stringBuffer = new StringBuffer();
      for (DeployTask deployTask : deployTasks) {
          // 查询到的姓名和身份证号
          stringBuffer.append(deployTask.getName() + "," + deployTask.getCardNo() + "\n");
          // 根据图片的特征id 从tbl_mapping表中来查询人脸图片
          Bitmap bitmap = FaceIdManager.getInstance().getUserImageByFid(deployTask.getCoverId());
      }
      tvDBdata.setText("数据库查询结果为：：\n " + stringBuffer.toString());
  }
  ```

- 修改数据:: ErrorCode updatePerson(String uid, Person person, List<FeatFileInfo> addList)

| 参数    | 类型               | 能否为空 | 说明               |
| ------- | ------------------ | -------- | ------------------ |
| uid     | String             | False    | uuid               |
| person  | Person             | False    | 人员信息           |
| addList | List<FeatFileInfo> | True     | 人脸图片的特征信息 |

  ```java
  private void updateData() {
      // demo默认修改第一条数据
      DeployTaskListInfo deployTaskList = FaceDataManager.getInstance().getDeployTaskListByOffset(null, 0, 1);
      List<DeployTask> deployTasks = deployTaskList.getDeployTasks();
      if (deployTasks.size()>0){
          Person person = new Person();
          person.setName("新名字");
          person.setCardNo("77");
          // uuid 为数据添加时自动生成的唯一随机id；
          String uuid = deployTasks.get(0).getId();
          // 更新数据, 【如需要修改图片，则可以参考addData()中的featFileInfos 作为第三个参数传入】
          ErrorCode errorCode = FaceDataManager.getInstance().updatePerson(uuid, person, null);
          if (errorCode.getCode() == 0) {
              Toast.makeText(this, "离线人脸数据添加成功", Toast.LENGTH_LONG).show();
              queryData();
          }
      }
  }
  ```

- 删除数据:: ErrorCode deletePersons(List<String> uids);

| 参数 | 类型         | 能否为空 | 说明 |
| ---- | ------------ | -------- | ---- |
| uids | List<String> | False    | Uuid |

  ```java
  **
   * 删除数据
   */
  private void deleteData() {
      List<String> deleteUidList = new ArrayList<>();
      DeployTaskListInfo deployTaskList = FaceDataManager.getInstance().getDeployTaskListByOffset(null, 0, 1);
      List<DeployTask> deployTasks = deployTaskList.getDeployTasks();
      for (DeployTask item: deployTasks) {
          // uuid 为数据添加时自动生成的唯一随机id；
          deleteUidList.add(item.getId());
      }
      ErrorCode errorCode = FaceDataManager.getInstance().deletePersons(deleteUidList);
      if (errorCode.getCode() == 0){
          Toast.makeText(this, "离线人脸数据删除成功", Toast.LENGTH_LONG).show();
      }
  }
  ```

### 离线车牌数据库操作

- 添加数据:: int addPlateInfo(PlateInfo info) ；

| 参数      | 类型      | 说明     |
| --------- | --------- | -------- |
| PlateInfo | PlateInfo | 车牌对象 |

  ```java
  private void addPlate() {
      // com.rokid.alliance.base.model.plate.PlateInfo;
      PlateInfo plateInfo = new PlateInfo();
      plateInfo.setPlate(plateNumStr);
      plateInfo.setBrand("品牌");
      plateInfo.setOwner("车主");
      PlateManager.getInstance().addPlateInfo(plateInfo);
  }
  ```

- 查询数据:: 

  >  方式一：List<PlateInfo> queryPlateInfoListByOffset(int start, int pageSize, String searchKey);

| 参数      | 类型   | 说明                                      |
| --------- | ------ | ----------------------------------------- |
| start     | int    | 数据库第几条数据；                        |
| pageSize  | int    | 查询的数据数目；                          |
| searchKey | String | 查询的关键词,针对车牌号和所有者的模糊查询 |

  ```java
  private void queryPlate() {
      int plateDbCount = PlateManager.getInstance().getPlateCount();
      List<PlateInfo> plateInfoList = PlateManager.getInstance().queryPlateInfoListByOffset(0, plateDbCount, null);
  }
  ```

- > 方式二：PlateInfo queryPlateInfo(String plate);

| 参数  | 类型   | 说明   |
| ----- | ------ | ------ |
| Plate | String | 车牌号 |

  ```java
  private void queryPlate() {
      PlateManager.getInstance().queryPlateInfo(plate);
  }
  ```

- 删除数据::  int deletePlates(boolean isAll, List<String> plates)；

| 参数   | 类型         | 说明             |
| ------ | ------------ | ---------------- |
| isAll  | boolean      | 是否删除所有数据 |
| plates | List<String> | 要删除的车牌号   |

  ```java
  private void deletePlate(String plate) {
      List<String> deleteIdList = new ArrayList<>();
      deleteIdList.add(plate);
      PlateManager.getInstance().deletePlates(false, deleteIdList);
  }
  ```

- 更新数据:: int updatePlateInfo(PlateInfo info);

| 参数      | 类型      | 说明     |
| --------- | --------- | -------- |
| PlateInfo | PlateInfo | 车牌对象 |

  ```java
  private void updatePlate(String plate) {
      PlateInfo plateInfo = PlateManager.getInstance().queryPlateInfo(plate);
      if (plateInfo == null){
          Toast.makeText(this, "没有该车牌数据信息", Toast.LENGTH_LONG).show();
          return;
      }
      plateInfo.setBrand(etBrand.getText().toString());
      plateInfo.setOwner(etOwner.getText().toString());
      PlateManager.getInstance().updatePlateInfo(plateInfo);
  }
  ```

## 相关的数据模型

RecognizeType

| 字段                | 类型 | 说明     |
| ------------------- | ---- | -------- |
| IS_SINGLE_RECOGNIZE | int  | 单人核查 |
| IS_MULTI_RECOGNIZE  | int  | 多人布控 |
| IS_PLATE_RECOGNIZE  | int  | 车牌识别 |

RKFaceModel

| 字段   | 类型     | 说明     |
| ------ | -------- | -------- |
| width  | int      | 图片宽度 |
| height | int      | 图片高度 |
| data   | byte[]   | 人脸图片 |
| Faces  | RKFaceDO | 人脸信息 |

> RKFaceDO getMaxFace();
>
> 一张图片可能对应多张人脸，getMaxFace() 返回的是相对图片信息质量最好的一张人脸信息；

Person:

| 字段       | 类型    | 说明             |
| ---------- | ------- | ---------------- |
| name       | String  | 姓名             |
| cardNo     | String  | 身份证号码       |
| birthPlace | String  | 出生地           |
| tag        | String  | 标签（如逃犯等） |
| isAlarm    | boolean | 是否告警         |

DeployTask

| 字段       | 类型           | 说明           |
| ---------- | -------------- | -------------- |
| id         | Srtring        | uuid           |
| name       | String         | 姓名           |
| cardNo     | String         | 身份证号       |
| birthPlace | String         | 祖籍           |
| tag        | String         | 标签           |
| coverId    | String         | 底图id         |
| featListy  | List<FeatInfo> | 特征信息       |
| isAlarm    | Boolean        | 是否是告警人员 |

FeatFileInfo：

| 字段     | 类型   | 说明                           |
| -------- | ------ | ------------------------------ |
| featId   | String | 人脸图片特征id                 |
| filePath | String | 人脸图片存储路径，用于识别展示 |

UserInfo：

| 字段        | 类型    | 说明                     |
| ----------- | ------- | ------------------------ |
| uid         | String  | 添加人脸生成的userid     |
| name        | String  | 添加人脸时输入的姓名     |
| cardno      | String  | 添加人脸是输入的身份证号 |
| nativeplace | String  | 添加人脸时输入的住址信息 |
| description | String  | 添加人脸时输入的其他信息 |
| isAlarm     | boolean | 是否告警，添加人脸时输入 |

RKLPRModel

| 字段   | 类型          | 说明     |
| ------ | ------------- | -------- |
| width  | int           | 图片宽度 |
| height | int           | 图片高度 |
| lps    | List<RKLPRDO> | 车牌信息 |

PlateInfo 

- com.rokid.alliance.base.model.plate

| 字段     | 类型   | 说明   |
| -------- | ------ | ------ |
| plate    | String | 车牌号 |
| owner    | String | 车主   |
| idcard   | String | 身份号 |
| address  | String | 地址   |
| phoneNum | String | 手机号 |
| brand    | String | 品牌   |
| color    | String | 颜色   |
| status   | String | 状态   |
| date     | String | 日期   |
| tag      | String | 标签   |


## 最佳实践

**[参考Demo工程](https://github.com/RokidGlass/RokidGlassMobileDemo)**

