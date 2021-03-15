# Face and License Plate SDK

## A brief introduction

The face and license plate SDK provides the functions of face and license plate detection, face tracking, face quality, and offline face and license plate recognition. The SDK can quickly recognize the face and license plate data in front of the eyes, compare the data with that in the database, and send out alerts if special faces or license plates are found.

## Prerequisite for use

- [Before installing the facial and license plate recognition SDK, you need to first install the glass hardware SDK. For more details, refer to the glass (v1.0) hardware document.](glass_hardware.md)

## Quick start guide

1. Add the following configurations in the build.gradle file of the project:

```java
 allprojects {
         repositories {
             maven { url = 'https://dl.bintray.com/rokid/alliance/' }
         }
 }
```

2. Import the following dependencies to build.gradle of modules of the project:

```java
dependencies {
  .......
  // Integrate face and license plate sdk
  implementation 'com.rokid.alliance.magicsdk:magicsdk:1.1.9'
}
```

3. Other configuration and precautions:

```java
 defaultConfig {
        applicationId "......"
        // minSdkVersion >= 21
        minSdkVersion 21
        // targetSdkVersion <= 27
        targetSdkVersion 27
    }
//Require specified java 8 version
compileOptions {
    sourceCompatibility JavaVersion.VERSION_1_8
    targetCompatibility JavaVersion.VERSION_1_8
}
```

4. The following permissions need to be applied for dynamically in devices of above 6.0:

```java
private static final String[] REQUIRED_PERMISSION_LIST = new String[]{
         Manifest.permission.WRITE_EXTERNAL_STORAGE,
         Manifest.permission.READ_EXTERNAL_STORAGE,
         Manifest.permission.RECORD_AUDIO,
         Manifest.permission.CAMERA,
         Manifest.permission.READ_PHONE_STATE,
 }
```

5. Initialize the SDK and devices.

    > Initialize the devices and set the recognition mode.

  ```java
  private void initGlass(){
    // initUsb device needs to uploaded to CameraViewInterface. If you don't need the view to be visible, set its width and height to 1dp.
    RKGlassDevice.RKGlassDeviceBuilder.buildRKGlassDevice().build().initUsbDevice(this, findViewById(R.id.uvc_preview), new OnGlassConnectListener() {
        @Override
        public void onGlassConnected(UsbDevice usbDevice, GlassInfo glassInfo) {
            // Glass connection success callback
        }

        @Override
        public void onGlassDisconnected() {
            // Glass disconnection callback
        }
    });

    BaseLibrary.initialize(getApplication());

  	RKGlassUI.getInstance().initGlassUI(getApplicationContext());
    // Set the recognition type and determine whether it is online mode.
    // This function must be invoked for the first time before the initGlassUI function is invoked, and can be invoked in the normal way after the recognition mode is switched later.
    //  RecognizeType.IS_SINGLE_RECOGNIZE single-person recognition
    //  RecognizeType.IS_MULTI_RECOGNIZE multi-person recognition 
    // RecognizeType.IS_PLATE_RECOGNIZE license plate recognition
    RKGlassUI.getInstance().recogSettingChanged(RecognizeType.IS_MULTI_RECOGNIZE, true);
    
  }
  ```

6. Online face and license plate recognition
   
   > For online recognition, the recognized images are uploaded to the cloud for comparison and the comparison result is returned. Then, the corresponding callback is used to send the returned result to the glass for display.

```java
/*
 * Online recognition
 */
private void initOnlineRecog() {
    // Load face models.
    RKAlliance.getInstance().loadFaceModel(getApplicationContext(), null);
    // Load license plate models.
    RKAlliance.getInstance().loadLPRModel(getApplicationContext(), null);

    //Return results of face and license plate online recognition and monitoring
    OnlineRecgHelper.getInstance().init(new OnlineRequest() {
        @Override
        public void sendFaceInfo(ReqOnlineSingleFaceMessage reqOnlineSingleFaceMessage) {
            //TODO: Upload the face information to the cloud for comparison
            // Here returned is the simulation result. In actual situation, the result is returned after comparison.
            RespOnlineSingleFaceMessage respOnlineSingleFaceMessage = new RespOnlineSingleFaceMessage();
            respOnlineSingleFaceMessage.setServerCode(RespOnlineSingleFaceMessage.ServerErrorCode.OK);  //Set the return code. "OK" is returned if normal. If it is abnormal, refer to the definition of ServerErrorCode.
            FaceInfoBean faceInfoBean = new FaceInfoBean();
            faceInfoBean.setName("xxx");  //Name of the online recognized person
            faceInfoBean.setNativeplace("Hangzhou city, Zhejiang province");  //Origin of online recognized person, for example,  "Hangzhou city, Zhejiang province"
            faceInfoBean.setCardno("xxxxxxxxxxxxxxxx");  //ID card information of online recognized person
            faceInfoBean.setTag("visitor from the localities appealing to the higher authorities for help");    //Tag information of online recognized person, such as "escaped criminal" / "suspicious" / "visitor from the localities appealing to the higher authorities for help"
            faceInfoBean.setAlarm(true);  //Whether to turn on the alarm tone
            Bitmap bm = BitmapUtils.bytes2bitmap(reqOnlineSingleFaceMessage.getFaceImage(), reqOnlineSingleFaceMessage.getWidth(), reqOnlineSingleFaceMessage.getHeight());
            faceInfoBean.setFaceImage(ImageUtils.bitmap2Bytes(bm));   //Face image data of online recognized persons that need to be displayed on the glass. Here the image data intercepted from the glass is mocked.
            respOnlineSingleFaceMessage.setTrackId(reqOnlineSingleFaceMessage.getTrackId());
            respOnlineSingleFaceMessage.setFaceInfoBean(faceInfoBean);
            respOnlineSingleFaceMessage.setServerCode(RespOnlineSingleFaceMessage.ServerErrorCode.OK);
            OnlineRecgHelper.getInstance().onFaceOnlineResp(respOnlineSingleFaceMessage);   //Invoke this interface to return the online recognition result to the glass
        }

        @Override
        public void sendPlateInfo(ReqCarRecognizeMessage reqCarRecognizeMessage) {
            //TODO: Upload the license plate information to the cloud for comparison
            // Here returned is the simulation result. In actual situation, the result is returned after comparison.
            RespCarRecognizeMessage respCarRecognizeMessage = new RespCarRecognizeMessage();
            respCarRecognizeMessage.setErrorCode(0);
            CarRecognizeInfoBean carRecognizeInfoBean = new CarRecognizeInfoBean();
            carRecognizeInfoBean.setPlate("Zhejiang ADA0178");  //License plate information
            carRecognizeInfoBean.setOwner("xxxx");  // Name of vehicle owner
            carRecognizeInfoBean.setBrand("BYD");  //Brand
            carRecognizeInfoBean.setColor("Red");  //Color of vehicle body
            carRecognizeInfoBean.setTag("xxxxxxx");  //Tag information, for example, "three violations of regulations" and "missing license plate"
            respCarRecognizeMessage.setCarRecognizeInfoBean(carRecognizeInfoBean);
            respCarRecognizeMessage.setErrorCode(0);
            OnlineRecgHelper.getInstance().onPlateOnlineResp(respCarRecognizeMessage);  //Invoke this information to return the online recognition result to the glass
        }
    });
}

@Override
protected void onDestroy() {
    super.onDestroy();
    // Release corresponding resources in onDestroy.
    RKAlliance.getInstance().releasePlateSdk();
    RKAlliance.getInstance().releaseFaceSdk();
    RKGlassDevice.getInstance().deInit();
    OnlineRecgHelper.getInstance().init(null);
}
```

7. Offline face recognition
  
    > Create related monitoring callback.

  ```java
  /*
   * Previewed monitoring callback
   */
  final AbstractUVCCameraHandler.OnPreViewResultListener onPreviewFrameListener = new AbstractUVCCameraHandler.OnPreViewResultListener() {
      @Override
      public void onPreviewResult(byte[] bytes) {
          RKAlliance.getInstance().setData(bytes);
      }
  };

/**
 * Face recognition success monitoring callback
 */
final Callback<RKFaceModel> faceCallback = new Callback<RKFaceModel>() {
    @Override
    public void onDataResult(RKFaceModel rkFaceModel, byte[] bytes) {
        if (rkFaceModel.getFaceList() == null) {
            return;
        }
        RKFaceDO faceDO = rkFaceModel.getMaxFace();
        Log.d(TAG, "onDataResult: ::: 【offline recognition succeeded】");
        if (faceDO.featid != null) {
            tvNameResult.post(() -> {
                UserInfo userInfo = FaceIdManager.getInstance().getUserInfoByFid(faceDO.featid);
                // Display recognized information
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

    > Load face models, initialize face SDK, and register face monitoring recognition.

```java
/**
 * Initialize offline recognition.
 */
private void initOfflineGlass() {
    // Load face models. loadFaceModel involves initialization of the face-related database.
    RKAlliance.getInstance().loadFaceModel(getApplicationContext(), new PreparedListener() {
        @Override
        public void onPrepared() {
         
        }
    });

    // Initialize face SDK.
    RKAlliance.getInstance().initFaceSDK(getApplicationContext(), Utils.getInstance().getRoi(), new PreparedListener() {
        @Override
        public void onPrepared() {
            RKGlassDevice.getInstance().setOnPreviewFrameListener(onPreviewFrameListener);
        }
    });

    // Register face recognition monitoring.
    RKAlliance.getInstance().registerFaceListener(faceCallback);
  
    RKGlassUI.getInstance().initGlassUI(getApplicationContext());
    // Single-person offline recognition
    RKGlassUI.getInstance().recogSettingChanged(RecognizeType.IS_SINGLE_RECOGNIZE, false);
    // Multi-person offline recognition
    // RKGlassUI.getInstance().recogSettingChanged(RecognizeType.IS_MULTI_RECOGNIZE, false);
}
```

    > Add faces to the database, and load sdk again.

```java
/**
 * Save offline face data.
 */
private void addImportData() {
    Person person = new Person();
    person.setName("Name");
    person.setCardNo("ID card number");

    // Image path
    String faceFilePath = Utils.getRealFilePath(getApplicationContext(), faceUri);
    Log.d(TAG, "addImportData: faceFilePath:::" + faceFilePath);
    final List<FeatFileInfo> featFileInfos = new ArrayList<>();
    // Extract feature return value
    final ExtractFeatResult extractFeatResult = FaceDataManager.getInstance().extractFeat(BitmapFactory.decodeFile(faceFilePath));
    if (extractFeatResult.getResultCode() == 0) {
        // Add extracted features to the database.
        FeatFileInfo featFileInfo = new FeatFileInfo();
        featFileInfo.setFilePath(faceFilePath);
        featFileInfos.add(featFileInfo);
        * Add offline face data.
        FaceDataManager.getInstance().addPerson(person, featFileInfos, null, true);
        Toast.makeText(this, "Adding offline face data succeeded", Toast.LENGTH_LONG).show();
        // Load data models again.
        reloadSdk();
    } else {
        Toast.makeText(this, extractFeatResult.getResultMsg() + "", Toast.LENGTH_LONG).show();
    }
}

/**
 * Load sdk again when adding data.
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

    > Release related resources.

 ```java
 @Override
 protected void onDestroy() {
    super.onDestroy();
    // Release corresponding resources in onDestroy.
    RKAlliance.getInstance().releaseFaceSdk();
    RKGlassDevice.getInstance().removeOnPreviewFrameListener(onPreviewFrameListener);
    RKGlassDevice.getInstance().deInit();
 }
 ```

8. Offline license plate recognition
   
    > Related monitoring callback

```java
/**
 * license plate recognition monitoring callback
 */
final Callback<RKLPRModel> plateCallBack = new Callback<RKLPRModel>() {

    @Override
    public void onDataResult(RKLPRModel lprModel, byte[] bytes) {
        if (lprModel.lps == null || lprModel.lps.size() == 0){
            return;
        }
        Log.d(TAG, "onDataResult: ::: 【License plate recognition succeeded】");
        for (RKLPRDO lprItem: lprModel.lps) {
            if (lprItem.score > 0.97){
                tvPlateResult.post(() -> {
                    String plateNum = lprItem.licensePlate;
                    tvPlateResult.setText(plateNum);
                    Bitmap bm = BitmapUtils.nv21ToBitmap(bytes, PREVIEW_WIDTH, PREVIEW_HEIGHT, lprItem.toRect(PREVIEW_WIDTH, PREVIEW_HEIGHT));
                    imgPlateResult.setImageBitmap(bm);

                    PlateInfo plateInfo = PlateManager.getInstance().queryPlateInfo(plateNum);
                    if (plateInfo !=null){
                        tvOwnerResult.setText("Brand:" + plateInfo.getBrand() + "， vehicle owner:" + plateInfo.getOwner());
                    }else{
                        tvOwnerResult.setText("No other information currently in offline database");
                    }
                });
            }
        }
    }
};
```

    > Recognition setting

```java

private void initGlassView() {
    BaseLibrary.initialize(getApplication());

    // Set offline license plate recognition.
    BaseLibrary.getInstance().setRecogType(RecognizeType.IS_PLATE_RECOGNIZE);
    BaseLibrary.getInstance().setIsOnline(false);
    RKGlassUI.getInstance().initGlassUI(getApplicationContext());

    // Register recognition monitoring
    RKAlliance.getInstance().registerLPRCallback(plateCallBack);

    // Load license plate models.
    RKAlliance.getInstance().loadLPRModel(getApplicationContext(), new PreparedListener() {
        @Override
        public void onPrepared() {

        }
    });

    // Initialize license plate sdk.
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

## Advanced topics

### Offline face database operations

> When offline face data is added, the information of persons is saved in the tbl\_user table, and face images are saved in the tbl\_mapping table.
> 
> tbl\_user table: The data model is UserInfo.java.
> 
> tbl\_mapping: The data model is FaceMapping.java.

- Add data:: ErrorCode addPerson(Person person, List<FeatFileInfo> featFileInfos, String coverId, boolean needSave);

Parameter| Type| Null?| Description
----------|----------|----------|----------
person| Person| False| Person information
featFileInfos| List<FeatFileInfo>| False| Feature information of face image
coverId| String| True| Image ID as the base
needSave| boolean| False| needSave

```java
private void addData() {
    // data saved into database
    Person person = new Person();
    person.setName("Name");
    person.setCardNo("ID card number");
  	// Image path
  	String faceFilePath = Utils.getRealFilePath(getApplicationContext(), faceUri);
  	List<FeatFileInfo> featFileInfos = new ArrayList<>();
  	// Extract feature return value
  	ExtractFeatResult extractFeatResult = FaceDataManager.getInstance().extractFeat(BitmapFactory.decodeFile(faceFilePath));
  	if (extractFeatResult.getResultCode() == 0) {
    		// Add extracted features to the database.
    		FeatFileInfo featFileInfo = new FeatFileInfo();
    		featFileInfo.setFilePath(faceFilePath);
    		featFileInfos.add(featFileInfo);
    		* Add offline face data.
    		FaceDataManager.getInstance().addPerson(person, featFileInfos, null, true);
    		// Load data models again.
    		reloadSdk();
  	} else {
    		// Extracting face features failed.
  	}
}
```

- Query data:: DeployTaskListInfo getDeployTaskListByOffset(String searchString, int offset, int pageSize);

Parameter| Type| Null?| Description
----------|----------|----------|----------
searchString| String| True| Key word, fuzzy query based on name or ID card number information
offset| int| False| Data start position
pageSize| int| False| Query quantity

```java
private void queryData() {
    int dataCount = FaceIdManager.getInstance().getAllUserNum();
    // Query data
    DeployTaskListInfo deployTaskList = FaceDataManager.getInstance().getDeployTaskListByOffset(null,0,dataCount);
    List<DeployTask> deployTasks = deployTaskList.getDeployTasks();
  
    StringBuffer stringBuffer = new StringBuffer();
    for (DeployTask deployTask : deployTasks) {
        // Queried name and ID card number
        stringBuffer.append(deployTask.getName() + "," + deployTask.getCardNo() + "\n");
        // Query face image from the tbl_mapping tabe based on the image feature ID.
        Bitmap bitmap = FaceIdManager.getInstance().getUserImageByFid(deployTask.getCoverId());
    }
    tvDBdata.setText("database query result is:: \n " + stringBuffer.toString());
}
```

- Modify data:: ErrorCode updatePerson(String uid, Person person, List<FeatFileInfo> addList)

Parameter| Type| Null?| Description
----------|----------|----------|----------
uid| String| False| uuid
person| Person| False| Person information
addList| List<FeatFileInfo>| True| Feature information of face image

```java
private void updateData() {
    // The first piece of data is modified by default in demo.
    DeployTaskListInfo deployTaskList = FaceDataManager.getInstance().getDeployTaskListByOffset(null, 0, 1);
    List<DeployTask> deployTasks = deployTaskList.getDeployTasks();
    if (deployTasks.size()>0){
        Person person = new Person();
        person.setName("new name");
        person.setCardNo("77");
        // uuid is the unique random ID automatically generated when data is added.
        String uuid = deployTasks.get(0).getId();
        // Update data【to change an image, refer to featFileInfos in addData() and load it as the third parameter】
        ErrorCode errorCode = FaceDataManager.getInstance().updatePerson(uuid, person, null);
        if (errorCode.getCode() == 0) {
            Toast.makeText(this, "Adding offline face data succeeded", Toast.LENGTH_LONG).show();
            queryData();
        }
    }
}
```

- Delete data:: ErrorCode deletePersons(List<String> uids);

Parameter| Type| Null?| Description
----------|----------|----------|----------
uids| List<String>| False| Uuid

  ```java
  /**
   * Delete data
   */
  private void deleteData() {
      List<String> deleteUidList = new ArrayList<>();
      DeployTaskListInfo deployTaskList = FaceDataManager.getInstance().getDeployTaskListByOffset(null, 0, 1);
      List<DeployTask> deployTasks = deployTaskList.getDeployTasks();
      for (DeployTask item: deployTasks) {
          // uuid is the unique random ID automatically generated when data is added.
          deleteUidList.add(item.getId());
      }
      ErrorCode errorCode = FaceDataManager.getInstance().deletePersons(deleteUidList);
      if (errorCode.getCode() == 0){
          Toast.makeText(this, "deleting offline face data succedded", Toast.LENGTH_LONG).show();
      }
   }
   ```
- Add face data in batches:: FaceDataManager.getInstance().addPersons(DeployInfo deployInfo, String filePath, List<BatchPersons> batchPersons, boolean isOverwrite) ;

Parameter| Type| Null?| Description
----------|----------|----------|----------
deployInfo| DeployInfo| False| Deploy package information
filePath| String| False| Path of face image compressed package
batchPersons| List<BatchPersons>| False| Offline person data information
isOverwrite| boolean| False| Override?
  ```java
 /**
   * Add face data in batches.
   */
    private void batchAddData() {
        // Here is the mocked deploy package data.
        DeployInfo deployInfo = new DeployInfo();
        deployInfo.setName("deploy package name");
        deployInfo.setExpireTime(System.currentTimeMillis() + 60 * 60 * 24 * 7 * 1000); // Expire time of deploy package
        deployInfo.setNewFriendAlarm(true);   //stranger alarm
        deployInfo.setNewFriendDesc(""); //stranger tag

      // Face image compressed file
        String fileName = "images.zip";
        String newFilePath = this.getFilesDir().getAbsolutePath() + File.separator + fileName;
        Logger.i("FileManager:: newFilePath:" + newFilePath);

        FileManager.copyAssetsFile2Phone(this, fileName, newFilePath);

        String batchDataJson = FileManager.getJson(this, "batchPerson.json");

        List<BatchPersons> batchPersonsList = new Gson().fromJson(batchDataJson, new TypeToken<List<BatchPersons>>() {
        }.getType());

        // Add face data information in batches.
        FaceDataManager.getInstance().addPersons  (deployInfo, newFilePath, batchPersonsList, true);
    }
  ```

### Offline license plate database operations

- Add data:: int addPlateInfo(PlateInfo info) ;

Parameter| Type| Description
----------|----------|----------
PlateInfo| PlateInfo| Plate owner

```java
private void addPlate() {
    // com.rokid.alliance.base.model.plate.PlateInfo;
    PlateInfo plateInfo = new PlateInfo();
    plateInfo.setPlate(plateNumStr);
    plateInfo.setBrand("Brand");
    plateInfo.setOwner("Owner");
    PlateManager.getInstance().addPlateInfo(plateInfo);
}
```

- Query data::
  
  > 1st method：List<PlateInfo> queryPlateInfoListByOffset(int start, int pageSize, String searchKey);

Parameter| Type| Description
----------|----------|----------
start| int| Data sequence number in database:
pageSize| int| Number of data queried:
searchKey| String| Key word for query, fuzzy query based on license plate number and owner

```java
private void queryPlate() {
    int plateDbCount = PlateManager.getInstance().getPlateCount();
    List<PlateInfo> plateInfoList = PlateManager.getInstance().queryPlateInfoListByOffset(0, plateDbCount, null);
}
```

- 2nd method: PlateInfo queryPlateInfo(String plate);

Parameter| Type| Description
----------|----------|----------
Plate| String| Plate number

```java
private void queryPlate() {
    PlateManager.getInstance().queryPlateInfo(plate);
}
```

- Delete data::  int deletePlates(boolean isAll, List<String> plates)；

Parameter| Type| Description
----------|----------|----------
isAll| boolean| Delete all data?
plates| List<String>| Plate number to be deleted

```java
private void deletePlate(String plate) {
    List<String> deleteIdList = new ArrayList<>();
    deleteIdList.add(plate);
    PlateManager.getInstance().deletePlates(false, deleteIdList);
}
```

- Update data:: int updatePlateInfo(PlateInfo info);

Parameter| Type| Description
----------|----------|----------
PlateInfo| PlateInfo| Plate owner

```java
private void updatePlate(String plate) {
    PlateInfo plateInfo = PlateManager.getInstance().queryPlateInfo(plate);
    if (plateInfo == null){
        Toast.makeText(this, "no plate data information", Toast.LENGTH_LONG).show();
        return;
    }
    plateInfo.setBrand(etBrand.getText().toString());
    plateInfo.setOwner(etOwner.getText().toString());
    PlateManager.getInstance().updatePlateInfo(plateInfo);
}
```

## Related data models

RecognizeType

Property| Type| Description
----------|----------|----------
IS_SINGLE_RECOGNIZE| int| Single-person recognition
IS_MULTI_RECOGNIZE| int| Multi-person recognition
IS_PLATE_RECOGNIZE| int| License plate recognition

RKFaceModel

Property| Type| Description
----------|----------|----------
width| int| Image width
height| int| Image height
data| byte[]| Face image
Faces| RKFaceDO| Face information

> RKFaceDO getMaxFace();
> 
> An image may correspond to multiple faces. getMaxFace() returns the face of the best image information quality.

Person:

Property| Type| Description
----------|----------|----------
name| String| Name
cardNo| String| ID card number
birthPlace| String| Birth place
tag| String| Tag (such as escaped criminal)
isAlarm| boolean| Alarm?

DeployTask

 Property| Type| Description
 ----------|----------|----------
 id| Srtring| uuid
 name| String| Name
 cardNo| String| ID card number
 birthPlace| String| Ancestral home
 tag| String| Tag
 coverId| String| Base image ID
 featListy| List<FeatInfo>| Feature information
 isAlarm| Boolean| Alarm person?

FeatFileInfo：

 Property| Type| Description
 ----------|----------|----------
 featId| String| Face image feature ID
 filePath| String| Face image storage path, for recognition and display

UserInfo：

 Property| Type| Description
----------|----------|----------
 uid| String| userid generated when adding the face
 name| String| Name input when adding face
 cardno| String| ID card number input when adding face
 nativeplace| String| Address info. input when adding face
 description| String| Other info. input when adding face
 isAlarm| boolean| Input whether to alarm when adding face

RKLPRModel

 Property| Type| Description
----------|----------|----------
 width| int| Image width
 height| int| Image height
 lps| List<RKLPRDO>| Plate information

PlateInfo

- com.rokid.alliance.base.model.plate

 Property| Type| Description
----------|----------|----------
 plate| String| Plate number
 owner| String| Owner
 idcard| String| ID card number
 address| String| Address
 phoneNum| String| Mobile number
 brand| String| Brand
 color| String| Color
 status| String| Status
 date| String| Date
 tag| String| Tag

DeployInfo (deploy package info)

 Property| Type| Description
----------|----------|----------
 name| String| Package name
 expireTime| String| Expire time
 updateTime| String| Update time
 personNum| String| Number of persons
 faceImgNum| String| Number of face images
 newFriendSwitch| boolean| Whether stranger?
 newFriendDesc| String| Stranger tag
 newFriendAlarm| boolean| Stranger alarm

BatchPersons (deploy person info)

 Property| Type| Description
----------|----------|----------
 name| String| Name of deploy person
 cardNo| String| ID card
 birthPlace| String| Place of origin
 tag| String| Tag
 pictureList| List<String>| Picture name
 isAlarm| boolean| Alarm?

## Best Practice

**[Reference Demo project](https://github.com/RokidGlass/RokidGlassMobileDemo)**