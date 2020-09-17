<!-- toc -->

# 人脸sdk
人脸sdk主要功能包含人脸检测、人脸跟踪、人脸得分、人脸质量、离线人脸识别。

## 人脸sdk集成
**如果双屏异显直接采用Rokid显示方案，也可以直接参考在线人脸识别集成**

1. [sdk集成](glass_hw.md#sdk集成步骤)

2. build.gradle集成人脸车牌sdk
   
    ```groovy
    implementation 'com.rokid.alliance.magicsdk:magicsdk:1.1.6'
    ```

3. 加载模型
   
    函数：
    
    ```java
    RKAlliance.getInstance().loadFaceModel(getApplicationContext(), new PreparedListener() {
                    @Override
                    public void onPrepared() {
                        //TODO
                   }
    ```
    
    参数：
    
    <table>
	<tr>
		<th>字段</th>
		<th>类型</th>
		<th>说明</th>
 	</tr>
 	<tr>
    		<td>context</td>
      		<td>Context</td>
		<td>ApplicationContext</td>
 	</tr>
	<tr>
    		<td>preparedListener</td>
      		<td>PreparedListener</td>
		<td>加载模型成功回调函数</td>
 	  </tr>
    </table>    

4. 初始化人脸sdk
   
    函数：
    
    ```java
    RKAlliance.getInstance().initFaceSDK(getApplicationContext(), roi, new PreparedListener() {
                @Override
                public void onPrepared() {
                    //TODO
                }
            });
    ```

    参数：
    
    <table>
	<tr>
		<th>字段</th>
		<th>类型</th>
		<th>说明</th>
 	</tr>
 	<tr>
    		<td>context</td>
      		<td>Context</td>
		<td>ApplicationContext</td>
 	</tr>
	<tr>
    		<td>roi</td>
      		<td>Rect</td>
		<td>人脸识别有效区域，传null为所有区域有效</td>
 	  </tr>
 	  <tr>
    		<td>preparedListener</td>
      		<td>PreparedListener</td>
		<td>初始化成功回调函数</td>
 	  </tr>
    </table>

5. 注册人脸回调

    函数：
    
    ```java
    RKAlliance.getInstance().registerFaceListener(new Callback<RKFaceModel>() {
                @Override
                public void onDataResult(RKFaceModel rkFaceModel, byte[] bytes) {
                    //TODO
                }
            });
    ```
    
    RKFaceModel：
    
    <table>
    <tr>
        <td>字段</td>
        <td>类型</td>
        <td>说明</td>
    </tr>
    <tr>
        <td>width</td>
        <td>int</td>
        <td>原始图片宽（可以理解为Camera出来的数据）</td>
    </tr>
    <tr>
        <td>height</td>
        <td>int</td>
        <td>原始图片高</td>
    </tr>
    <tr>
        <td>data</td>
        <td>byte[]</td>
        <td>原始图片数据</td>
    </tr>
    <tr>
        <td>faces</td>
        <td>List</td>
        <td>对应图片包含的人脸</td>
    </tr>
    </table>
        
    RKFaceDO：<div id="rkfacedo"></div>
    
    <table>
    <tr>
        <td>字段</td>
        <td>类型</td>
        <td>说明</td>
    </tr>
    <tr>
        <td>faceRectF</td>
        <td>RectF</td>
        <td>人脸对应原图的位置</td>
    </tr>
    <tr>
        <td>trackId</td>
        <td>int</td>
        <td>人脸追踪id，每个id的生命周期为从检测到新的人脸开始到此人脸不存在摄像头画面</td>
    </tr>
    <tr>
        <td>data</td>
        <td>byte[]</td>
        <td>原始图片数据</td>
    </tr>
    <tr>
        <td>quality</td>
        <td>float</td>
        <td>人脸质量分，过滤掉非人脸图片建议quality&gt;=40</td>
    </tr>
    <tr>
        <td>faceScore</td>
        <td>float</td>
        <td>人脸得分（相似度）</td>
    </tr>
    <tr>
        <td>recogBitmap</td>
        <td>Bitmap</td>
        <td>人脸抠图</td>
    </tr>
    <tr>
        <td>featid</td>
        <td>String</td>
        <td>人脸特征，**用于离线人脸**</td>
    </tr>
    </table>
    
## 离线人脸识别

### 添加离线人脸数据

1. [人脸sdk集成](glass_hw.md#sdk集成步骤)
2. 添加离线人脸
   
    示例：
    
    ```java
    ExtractFeatResult featResult = FaceDataManager.getInstance().extractFeat(Bitmap: bitmap);
    if (featResult.getResultCode() == 0) {//图片特征提取成功 
        FaceDataManager.getInstance().addPerson(Person: person, List<FeatFileInfo> featFileInfos, null, true);//添加到数据库
    }
    ```
    
    API说明：
    
    ExtractFeatResult featResult = FaceDataManager.getInstance().extractFeat(Bitmap: bitmap);
    
    参数：
        
    <table>
        <tr>
            <td>字段</td>
            <td>类型</td>
            <td>说明</td>
            </tr>
            <tr>
            <td>bitmap</td>
            <td>Bitmap</td>
            <td>需要提取人脸特征的人脸照片（正脸）</td>
            </tr>
            <tr>
            <td>featResult</td>
            <td>ExtractFeatResult</td>
            <td>提取特征的返回值</td>
            </tr>
    </table>
        
    ExtractFeatResult：
    
    <table>
    <tr>
        <td>字段</td>
        <td>类型</td>
        <td>说明</td>
    </tr>
    <tr>
        <td>resultCode</td>
        <td>int</td>
        <td>0为成功提取，其他为提取失败</td>
    </tr>
    <tr>
        <td>resultMsg</td>
        <td>String</td>
        <td>提取失败原因</td>
    </tr>
    </table>
    
    ```java
    ErrorCode errorCode = FaceDataManager.getInstance().addPerson(Person: person, List<FeatFileInfo> featFileInfos, String covertId, boolean needSave);
```
    参数：
        
    <table>
    <tr>
        <td>字段</td>
        <td>类型</td>
        <td>说明</td>
    </tr>
    <tr>
        <td>person</td>
        <td>Person</td>
        <td>添加人脸个人信息</td>
    </tr>
    <tr>
        <td>featFileInfos</td>
        <td>List&lt;FeatFileInfo&gt;</td>
        <td>添加人脸特征及保存图片路径集合(每个人可以添加多张图片)</td>
    </tr>
    <tr>
        <td>covertId</td>
        <td>String</td>
        <td>封面id（与需要作为封面的照片featid一致），当识别到该人时UI将展示此coverId对应的照片</td>
    </tr>
    <tr>
        <td>needSave</td>
        <td>boolean</td>
        <td>添加单人脸使用true</td>
    </tr>
    <tr>
        <td>errorCode</td>
        <td>ErrorCode</td>
        <td>添加人脸到数据库返回值</td>
    </tr>
</table>
        
    Person：
        
    <table>
    <tr>
        <td>字段</td>
        <td>类型</td>
        <td>说明</td>
    </tr>
    <tr>
        <td>name</td>
        <td>String</td>
        <td>姓名</td>
    </tr>
    <tr>
        <td>cardNo</td>
        <td>String</td>
        <td>身份证号码</td>
    </tr>
    <tr>
        <td>birthPlace</td>
        <td>String</td>
        <td>出生地</td>
    </tr>
    <tr>
        <td>tag</td>
        <td>String</td>
        <td>标签（如逃犯等）</td>
    </tr>
    <tr>
        <td>isAlarm</td>
        <td>boolean</td>
        <td>是否告警</td>
    </tr>
</table>
        
    FeatFileInfo：
        
    <table>
    <tr>
        <td>字段</td>
        <td>类型</td>
        <td>说明</td>
    </tr>
    <tr>
        <td>featId</td>
        <td>String</td>
        <td>人脸图片特征id</td>
    </tr>
    <tr>
        <td>filePath</td>
        <td>String</td>
        <td>人脸图片存储路径，用于识别展示</td>
    </tr>
</table>
        
    ErrorCode：
        
    <table>
    <tr>
        <td>字段</td>
        <td>类型</td>
        <td>说明</td>
    </tr>
    <tr>
        <td>code</td>
        <td>int</td>
        <td>0为成功，其他为失败</td>
    </tr>
    <tr>
        <td>msg</td>
        <td>String</td>
        <td>添加失败信息</td>
    </tr>
</table>
    
3. 根据识别结果查询数据库
   
    示例：
    
    ```java
    final UserInfo info = FaceIdManager.getInstance().getUserInfoByFid(RKFaceDO.featid);
    ```
    
    参数：
    
    <table>
    <tr>
        <td>字段</td>
        <td>类型</td>
        <td>说明</td>
    </tr>
    <tr>
        <td>featid</td>
        <td>String</td>
        <td>识别到的人脸的特征id</td>
    </tr>
    <tr>
        <td>info</td>
        <td>UserInfo</td>
        <td>从离线人脸数据库根据特征id查询到的人员信息</td>
    </tr>
</table>
    
    UserInfo：
    
    <table>
    <tr>
        <td>字段</td>
        <td>类型</td>
        <td>说明</td>
    </tr>
    <tr>
        <td>uid</td>
        <td>String</td>
        <td>添加人脸生成的userid</td>
    </tr>
    <tr>
        <td>name</td>
        <td>String</td>
        <td>添加人脸时输入的姓名</td>
    </tr>
    <tr>
        <td>cardno</td>
        <td>String</td>
        <td>添加人脸是输入的身份证号</td>
    </tr>
    <tr>
        <td>nativeplace</td>
        <td>String</td>
        <td>添加人脸时输入的住址信息</td>
    </tr>
    <tr>
        <td>description</td>
        <td>String</td>
        <td>添加人脸时输入的其他信息</td>
    </tr>
    <tr>
        <td>isAlarm</td>
        <td>boolean</td>
        <td>是否告警，添加人脸时输入</td>
    </tr>
</table>

    
    
## 在线人脸识别
如果需要自行定义人脸识别UI交互，此部分可以仅作为参考。
集成Rokid maven库则不需要开发双屏异显，或者可以获取源码进行部分ui调整。[在线识别参考](glass_ai_presentation.md#sdk集成方式)。



# 车牌sdk
车牌sdk主要包含车牌号码识别功能。车牌的sdk和人脸sdk在同一个仓库。

## 车牌sdk集成

1. [车牌sdk集成](glass_hw.md#sdk集成步骤)

2. 加载模型
   
    函数：
    
    ```java
        RKAlliance.getInstance().loadLPRModel(getApplicationContext(), new PreparedListener() {
                    @Override
                    public void onPrepared() {
    
                    }
                });
    ```
    
    参数：
    
    <table>
    <tr>
        <td>字段</td>
        <td>类型</td>
        <td>说明</td>
    </tr>
    <tr>
        <td>context</td>
        <td>Context</td>
        <td>ApplicationContext</td>
    </tr>
    <tr>
        <td>preparedListener</td>
        <td>PreparedListener</td>
        <td>加载模型成功回调函数</td>
    </tr>
</table>

3. 初始化车牌sdk

    函数：
    
    ```java
     RKAlliance.getInstance().initPlateSDK(new PreparedListener() {
                @Override
                public void onPrepared() {

                }
            });
    ```

    参数：
    
    <table>
    <tr>
        <td>字段</td>
        <td>类型</td>
        <td>说明</td>
    </tr>
    <tr>
        <td>preparedListener</td>
        <td>PreparedListener</td>
        <td>初始化成功回调函数</td>
    </tr>
</table>

4. 注册车牌回调

    函数：
    
    ```java
    RKAlliance.getInstance().registerLPRCallback(new Callback<RKLPRModel>() {
                @Override
                public void onDataResult(RKLPRModel rklprModel, byte[] bytes) {
                    
                }
            });
    ```

    RKLPRModel：
    
    <table>
    <tr>
        <td>字段</td>
        <td>类型</td>
        <td>说明</td>
    </tr>
    <tr>
        <td>width</td>
        <td>int</td>
        <td>原始图片宽（可以理解为Camera出来的数据）</td>
    </tr>
    <tr>
        <td>height</td>
        <td>int</td>
        <td>原始图片高</td>
    </tr>
    <tr>
        <td>lps</td>
        <td>List&lt;RKLPRDO&gt;</td>
        <td>所有检测到的车牌</td>
    </tr>
</table>
    
    RKLPRDO：
    
    <table>
    <tr>
        <td>字段</td>
        <td>类型</td>
        <td>说明</td>
    </tr>
    <tr>
        <td>position</td>
        <td>RectF</td>
        <td>车牌在原始图的位置</td>
    </tr>
    <tr>
        <td>licensePlate</td>
        <td>String</td>
        <td>车牌号码</td>
    </tr>
    <tr>
        <td>score</td>
        <td>float</td>
        <td>相似度</td>
    </tr>
</table>


## 离线车牌识别
导入离线车牌数据后，按照[sdk集成](#车牌sdk集成)第4步回调中即可拿到识别的车牌号码，从导入的车牌数据库查询号牌信息展示即可，如果集成Rokid开发好的[双屏异显](glass_ai_presentation.md#双屏异显人脸车牌识别)，离线识别这部分只需要进行数据导入即可。

