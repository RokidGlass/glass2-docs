<!-- toc -->

# 双屏异显+人脸车牌识别
此部分sdk已实现人脸车牌识别、人脸车牌双屏异显UI。**目前暂不支持UI对UI进行修改，后续更新支持！**

## sdk集成方式

1. project build.gradle配置

    ```groovy
    allprojects {
            repositories {
                maven { url = 'https://dl.bintray.com/rokid/alliance/' }
            }
    }
    ```

2. build.gradle配置maven库

    ```groovy
     implementation 'com.rokid.alliance.glassui:glassui:1.0.0.0'
    ```

3. sdk依赖权限申请

    ```java
    private static final String[] REQUIRED_PERMISSION_LIST = new String[]{
            Manifest.permission.WRITE_EXTERNAL_STORAGE,
            Manifest.permission.READ_EXTERNAL_STORAGE,
            Manifest.permission.RECORD_AUDIO,
            Manifest.permission.CAMERA,
            Manifest.permission.READ_PHONE_STATE,
    }
    ```

4. sdk初始化

    ```java
    RKAlliance.getInstance().loadFaceModel(getApplicationContext(), null);
    RKAlliance.getInstance().loadLPRModel(getApplicationContext(), null);
    RKGlassUI.getInstance().initGlassUI(getApplicationContext());
    ```

5. 人脸、车牌识别
    
    1. 在线识别
    
        ```java
        OnlineRecgHelper.getInstance().init(new OnlineRequest() {
                @Override
                public void sendFaceInfo(ReqOnlineSingleFaceMessage reqOnlineSingleFaceMessage) {
                    //TODO: 将人脸信息上传云端做比对
                    // 此处mock结果返回，实际要比对完成后再返回
                    RespOnlineSingleFaceMessage respOnlineSingleFaceMessage = new RespOnlineSingleFaceMessage();
                    respOnlineSingleFaceMessage.setServerCode(RespOnlineSingleFaceMessage.ServerErrorCode.OK);  //设置返回码，正常返回OK，异常详见ServerErrorCode定义
                    FaceInfoBean faceInfoBean = new FaceInfoBean();
                    faceInfoBean.setName("xxx");  //在线识别 人员名字
                    faceInfoBean.setNativeplace("浙江.杭州");  // 在线识别 人员籍贯，比如"浙江.杭州"
                    faceInfoBean.setCardno("xxxxxxxxxxxxxxxx");  //在线识别 人员身份证信息
                    faceInfoBean.setTag("上访人员");    //在线识别 人员标签信息，比如"逃犯"/"可疑人员"/"上访人员"
                    faceInfoBean.setAlarm(true);  //是否开启警报音
                    Bitmap bm = BitmapUtils.bytes2bitmap(reqOnlineSingleFaceMessage.getFaceImage(), reqOnlineSingleFaceMessage.getWidth(),reqOnlineSingleFaceMessage.getHeight());
                    faceInfoBean.setFaceImage(ImageUtils.bitmap2Bytes(bm));   //在线识别后需要眼镜端展示的人员头像图片数据，此处只是mock了从眼镜端截取的图片数据
                    respOnlineSingleFaceMessage.setTrackId(reqOnlineSingleFaceMessage.getTrackId());
                    respOnlineSingleFaceMessage.setFaceInfoBean(faceInfoBean);
                    respOnlineSingleFaceMessage.setServerCode(RespOnlineSingleFaceMessage.ServerErrorCode.OK);
                    OnlineRecgHelper.getInstance().onFaceOnlineResp(respOnlineSingleFaceMessage);   //调用此接口将在线识别结果返回给眼镜
                }
    
                @Override
                public void sendPlateInfo(ReqCarRecognizeMessage reqCarRecognizeMessage) {
                    //TODO: 将车牌信息上传云端做比对
                    // 此处mock结果返回，实际要比对完成后再返回
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
        ```

    2. 离线识别
        离线识别只需要添加导入连线人脸数据即可，导入接口[参考](ai.md#添加离线人脸数据)。批量导入人脸数据方式待更新

5. sdk释放

    ```java
    RKAlliance.getInstance().releasePlateSdk();
    RKAlliance.getInstance().releaseFaceSdk();
    ```




