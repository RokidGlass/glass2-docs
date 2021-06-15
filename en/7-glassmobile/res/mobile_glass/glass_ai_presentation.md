<!-- toc -->
# Dual screen display + face and license plate recognition

This SDK supports face and license plate recognition and face and license plate dual screen display UI. **UI modification is not supported currently, and will be supported in future update.**

## SDK integration method

1. project build.gradle configuration
   
    ```groovy
    allprojects {
           repositories {
               maven { url = 'https://dl.bintray.com/rokid/alliance/' }
           }
    }
    ```

2. build.gradle configuration maven library
   
    ```groovy
    implementation 'com.rokid.alliance.glassui:glassui:1.1.9'
    ```

3. SDK dependency permission application
   
    ```java
    private static final String[] REQUIRED_PERMISSION_LIST = new String[]{
           Manifest.permission.WRITE_EXTERNAL_STORAGE,
           Manifest.permission.READ_EXTERNAL_STORAGE,
           Manifest.permission.RECORD_AUDIO,
           Manifest.permission.CAMERA,
           Manifest.permission.READ_PHONE_STATE,
    }
    ```

4. SDK initialization
   
    ```java
    RKAlliance.getInstance().loadFaceModel(getApplicationContext(), null);
    RKAlliance.getInstance().loadLPRModel(getApplicationContext(), null);
    RKGlassUI.getInstance().recogSettingChanged(RecognizeType.IS_MULTI_RECOGNIZE, true);
    RKGlassUI.getInstance().initGlassUI(getApplicationContext());
    ```

5. Face and license plate recognition
   
   1. Online recognition
      
        ```java
        OnlineRecgHelper.getInstance().init(new OnlineRequest() {
              @Override
              public void sendFaceInfo(ReqOnlineSingleFaceMessage reqOnlineSingleFaceMessage) {
                  //TODO: Upload the face information to the cloud for comparison
                  //The mock result is returned here. In actual situation, the result is returned after comparison.
                  RespOnlineSingleFaceMessage respOnlineSingleFaceMessage = new RespOnlineSingleFaceMessage();
                  respOnlineSingleFaceMessage.setServerCode(RespOnlineSingleFaceMessage.ServerErrorCode.OK);  //Set the return code. "OK" is returned if normal. If it is abnormal, refer to the definition of ServerErrorCode.
                  FaceInfoBean faceInfoBean = new FaceInfoBean();
                  faceInfoBean.setName("xxx");  //Name of the online recognized person
                  faceInfoBean.setNativeplace("Hangzhou city, Zhejiang province");  //Origin of online recognized person, for example,  "Hangzhou city, Zhejiang province"
                  faceInfoBean.setCardno("xxxxxxxxxxxxxxxx");  //ID card information of online recognized person
                  faceInfoBean.setTag("visitor from the localities appealing to the higher authorities for help");    //Tag information of online recognized person, such as "escaped criminal" / "suspicious" / "visitor from the localities appealing to the higher authorities for help"
                  faceInfoBean.setAlarm(true);  //Whether to turn on the alarm tone
                  Bitmap bm = BitmapUtils.bytes2bitmap(reqOnlineSingleFaceMessage.getFaceImage(), reqOnlineSingleFaceMessage.getWidth(),reqOnlineSingleFaceMessage.getHeight());
                  faceInfoBean.setFaceImage(ImageUtils.bitmap2Bytes(bm));   //Face image data of online recognized persons that need to be displayed on the glass. Here the image data intercepted from the glass is mocked.
                  respOnlineSingleFaceMessage.setTrackId(reqOnlineSingleFaceMessage.getTrackId());
                  respOnlineSingleFaceMessage.setFaceInfoBean(faceInfoBean);
                  respOnlineSingleFaceMessage.setServerCode(RespOnlineSingleFaceMessage.ServerErrorCode.OK);
                  OnlineRecgHelper.getInstance().onFaceOnlineResp(respOnlineSingleFaceMessage);   //Invoke this interface to return the online recognition result to the glass
              }
      
              @Override
              public void sendPlateInfo(ReqCarRecognizeMessage reqCarRecognizeMessage) {
                  //TODO: Upload the license plate information to the cloud for comparison
                  //The mock result is returned here. In actual situation, the result is returned after comparison.
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
        ```
   
   2. Offline recognition Offline recognition requires only importing the face data. For the importing interface, see [Reference](ai.md#Add offline face data). The method of importing face data in batches will be updated.

6. SDK release
   
    ```java
    RKAlliance.getInstance().releasePlateSdk();
    RKAlliance.getInstance().releaseFaceSdk();
    ```