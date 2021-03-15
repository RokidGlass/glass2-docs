<!-- toc -->
# Face SDK

The main functions of the face SDK include face detection, face tracking, face score, face quality, and offline face recognition.

## Face SDK integration

**If the dual screens with different displays directly use the Rokid display solution, you can also directly refer to the online face recognition integration.**

1. [SDK integration](glass_hw.md#SDK integration steps)

2. Modify build.gradle to integrate face and license plate SDK.
   
    ```groovy
    implementation 'com.rokid.alliance.magicsdk:magicsdk:1.1.7’
    ```

3. Load model.
   
    function:
   
    ```java
    RKAlliance.getInstance().loadFaceModel(getApplicationContext(), new PreparedListener() {
                   @Override
                   public void onPrepared() {
                       //TODO
                  }
    ```
   
    Parameters:
   
    <table>
    <tr>
    	<th>Field</th>
    	<th>Type</th>
    	<th>Note</th>
    </tr>
    <tr>
    		<td>context</td>
      		<td>Context</td>
    	<td>ApplicationContext</td>
    </tr>
    <tr>
    		<td>preparedListener</td>
      		<td>PreparedListener</td>
    	<td>Callback function for loading model successfully</td>
      </tr>
    </table>    

4. Initialize the face SDK.
   
    function:
   
    ```java
    RKAlliance.getInstance().initFaceSDK (getApplicationContext(), roi, new PreparedListener() {
               @Override
               public void onPrepared() {
                   //TODO
               }
           });
    ```
   
    Parameters:
   
    <table>
    <tr>
    	<th>Field</th>
    	<th>Type</th>
    	<th>Note</th>
    </tr>
    <tr>
    		<td>context</td>
      		<td>Context</td>
    	<td>ApplicationContext</td>
    </tr>
    <tr>
    		<td>roi</td>
      		<td>Rect</td>
    	<td>The effective area of face recognition. Assign null for all areas is effective</td>
      </tr>
      <tr>
    		<td>preparedListener</td>
      		<td>PreparedListener</td>
    	<td>Successfully initialize callback function</td>
      </tr>
    </table>

5. Register face callback.
   
    function:
   
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
        <td>Field</td>
        <td>Type</td>
        <td>Note</td>
    </tr>
    <tr>
        <td>width</td>
        <td>int</td>
        <td>The original picture width, is the data from Camera.</td>
    </tr>
    <tr>
        <td>height</td>
        <td>int</td>
        <td>The original picture height</td>
    </tr>
    <tr>
        <td>data</td>
        <td>byte[]</td>
        <td>Original image data</td>
    </tr>
    <tr>
        <td>faces</td>
        <td>List</td>
        <td>The face contained in the corresponding picture</td>
    </tr>
    </table>
   RKFaceDO：<div id="rkfacedo"></div>
   
    <table>
    <tr>
        <td>Field</td>
        <td>Type</td>
        <td>Note</td>
    </tr>
    <tr>
        <td>faceRectF</td>
        <td>RectF</td>
        <td>The position of the face corresponding to the original image</td>
    </tr>
    <tr>
        <td>trackId</td>
        <td>int</td>
        <td>Face tracking id, the life cycle of each id is from the detection of a new face until the face does not exist in the camera image</td>
    </tr>
    <tr>
        <td>data</td>
        <td>byte[]</td>
        <td>Original image data</td>
    </tr>
    <tr>
        <td>quality</td>
        <td>float</td>
        <td>Face quality score, it is recommended to filter out non-face images quality&gt;=40</td>
    </tr>
    <tr>
        <td>faceScore</td>
        <td>float</td>
        <td>Face similarity score</td>
    </tr>
    <tr>
        <td>recogBitmap</td>
        <td>Bitmap</td>
        <td>Face Cutout</td>
    </tr>
    <tr>
        <td>featid</td>
        <td>String</td>
        <td>Face features, **for offline faces**</td>
    </tr>
    </table>


## Offline face recognition

### Add offline face data

1. [Face SDK integration](glass_hw.md#SDK integration steps)

2. Add offline face
   
    Sample configuration:
   
    ```java
    ExtractFeatResult featResult = FaceDataManager.getInstance().extractFeat(Bitmap: bitmap);
    if (featResult.getResultCode() == 0) {//Picture feature extraction is successful 
       FaceDataManager.getInstance().addPerson(Person: person, List<FeatFileInfo> featFileInfos, null, true);//Add to database
    }
    ```
   
    Note for API:
   
    ExtractFeatResult featResult = FaceDataManager.getInstance().extractFeat(Bitmap: bitmap);
   
    Parameters:
   
    <table>
        <tr>
            <td>Field</td>
            <td>Type</td>
            <td>Note</td>
            </tr>
            <tr>
            <td>bitmap</td>
            <td>Bitmap</td>
            <td>Front face photos that need to extract facial features</td>
            </tr>
            <tr>
            <td>featResult</td>
            <td>ExtractFeatResult</td>
            <td>Return value of extracted feature</td>
            </tr>
    </table>
    ExtractFeatResult：
   
    <table>
    <tr>
        <td>Field</td>
        <td>Type</td>
        <td>Note</td>
    </tr>
    <tr>
        <td>resultCode</td>
        <td>int</td>
        <td>The return value of 0 means successful extraction, others mean failed extraction</td>
    </tr>
    <tr>
        <td>resultMsg</td>
        <td>String</td>
        <td>Reason for failed extraction</td>
    </tr>
    </table>
    ```java
    ErrorCode errorCode = FaceDataManager.getInstance().addPerson(Person: person, List<FeatFileInfo> featFileInfos, String covertId, boolean needSave);
```
    Parameters:
        
    <table>
    <tr>
        <td>Field</td>
        <td>Type</td>
        <td>Note</td>
    </tr>
    <tr>
        <td>person</td>
        <td>Person</td>
        <td>Add personal face information</td>
    </tr>
    <tr>
        <td>featFileInfos</td>
        <td>List&lt;FeatFileInfo&gt;</td>
        <td>Add face features and save image paths, and each person can add multiple images.</td>
    </tr>
    <tr>
        <td>covertId</td>
        <td>String</td>
        <td>Cover id, which is consistent with the cover photo featid. When the person is recognized, the UI will display the photo corresponding to this coverId</td>
    </tr>
    <tr>
        <td>needSave</td>
        <td>boolean</td>
        <td>Add single face usage and assign the value to true</td>
    </tr>
    <tr>
        <td>errorCode</td>
        <td>ErrorCode</td>
        <td>Add face to database return value</td>
    </tr>
</table>
        
    Person：
        
    <table>
    <tr>
        <td>Field</td>
        <td>Type</td>
        <td>Note</td>
    </tr>
    <tr>
        <td>name</td>
        <td>String</td>
        <td>Name</td>
    </tr>
    <tr>
        <td>cardNo</td>
        <td>String</td>
        <td>ID number</td>
    </tr>
    <tr>
        <td>birthPlace</td>
        <td>String</td>
        <td>Birthplace</td>
    </tr>
    <tr>
        <td>tag</td>
        <td>String</td>
        <td>Tags, such as fugitives, etc.</td>
    </tr>
    <tr>
        <td>isAlarm</td>
        <td>boolean</td>
        <td>Whether to alert or not</td>
    </tr>
</table>
        
    FeatFileInfo：
        
    <table>
    <tr>
        <td>Field</td>
        <td>Type</td>
        <td>Note</td>
    </tr>
    <tr>
        <td>featId</td>
        <td>String</td>
        <td>Face image feature id</td>
    </tr>
    <tr>
        <td>filePath</td>
        <td>String</td>
        <td>Face image storage path, which used for identification and display</td>
    </tr>
</table>
        
    ErrorCode：
        
    <table>
    <tr>
        <td>Field</td>
        <td>Type</td>
        <td>Note</td>
    </tr>
    <tr>
        <td>code</td>
        <td>int</td>
        <td>The return value of 0 means successful extraction, others mean failed extraction</td>
    </tr>
    <tr>
        <td>msg</td>
        <td>String</td>
        <td>Add failure information</td>
    </tr>
</table>
    
3. Query the database based on the recognition results
   
    Sample configuration:
    
    ```java
    final UserInfo info = FaceIdManager.getInstance().getUserInfoByFid(RKFaceDO.featid);
    ```
    
    Parameters:
    
    <table>
    <tr>
        <td>Field</td>
        <td>Type</td>
        <td>Note</td>
    </tr>
    <tr>
        <td>featid</td>
        <td>String</td>
        <td>The feature id of the recognized face</td>
    </tr>
    <tr>
        <td>info</td>
        <td>UserInfo</td>
        <td>Personal information queried according to feature id from offline face database</td>
    </tr>
</table>
    
    UserInfo：
    
    <table>
    <tr>
        <td>Field</td>
        <td>Type</td>
        <td>Note</td>
    </tr>
    <tr>
        <td>uid</td>
        <td>String</td>
        <td>Add userid generated by face</td>
    </tr>
    <tr>
        <td>name</td>
        <td>String</td>
        <td>The name entered when adding a face</td>
    </tr>
    <tr>
        <td>cardno</td>
        <td>String</td>
        <td>The ID number entered when adding a face</td>
    </tr>
    <tr>
        <td>nativeplace</td>
        <td>String</td>
        <td>The address information entered when adding a face</td>
    </tr>
    <tr>
        <td>description</td>
        <td>String</td>
        <td>Other information entered when adding a face</td>
    </tr>
    <tr>
        <td>isAlarm</td>
        <td>boolean</td>
        <td>Whether to alert or not, which entered when adding a face</td>
    </tr>
</table>

    
    
## Online face recognition
If you need to define your own UI interaction of face recognition, this section can be used as a reference only.
Integrating the Rokid maven library does not require the development of dual screens with different displays, or you can obtain the source code for UI adjustments. [Online identification reference] (glass_ai_presentation.md#SDK integration method).



# License plate SDK
The license plate SDK mainly contains the function of license plate number recognition. The SDK of the license plate and the face SDK are in the same database.

## License plate SDK integration

1. [license plate SDK integration] (glass_hw.md#SDK integration steps)

2. Load the model
   
    function:
    
    ```java
        RKAlliance.getInstance().loadLPRModel(getApplicationContext(), new PreparedListener() {
                    @Override
                    public void onPrepared() {
    
                    }
                });
    ```
    
    Parameters:
    
    <table>
    <tr>
        <td>Field</td>
        <td>Type</td>
        <td>Note</td>
    </tr>
    <tr>
        <td>context</td>
        <td>Context</td>
        <td>ApplicationContext</td>
    </tr>
    <tr>
        <td>preparedListener</td>
        <td>PreparedListener</td>
        <td>Callback function for loading model successfully</td>
    </tr>
</table>

3. Initialize the license plate SDK

    function:
    
    ```java
     RKAlliance.getInstance().initPlateSDK(new PreparedListener() {
                @Override
                public void onPrepared() {

                }
            });
    ```

    Parameters:
    
    <table>
    <tr>
        <td>Field</td>
        <td>Type</td>
        <td>Note</td>
    </tr>
    <tr>
        <td>preparedListener</td>
        <td>PreparedListener</td>
        <td>Successfully initialize callback function</td>
    </tr>
</table>

4. Registered license plate callback

    function:
    
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
        <td>Field</td>
        <td>Type</td>
        <td>Note</td>
    </tr>
    <tr>
        <td>width</td>
        <td>int</td>
        <td>The original picture width, is the data from Camera.</td>
    </tr>
    <tr>
        <td>height</td>
        <td>int</td>
        <td>The original picture height</td>
    </tr>
    <tr>
        <td>lps</td>
        <td>List&lt;RKLPRDO&gt;</td>
        <td>All detected license plates</td>
    </tr>
</table>
    
    RKLPRDO：
    
    <table>
    <tr>
        <td>Field</td>
        <td>Type</td>
        <td>Note</td>
    </tr>
    <tr>
        <td>position</td>
        <td>RectF</td>
        <td>The position of the license plate in the original image</td>
    </tr>
    <tr>
        <td>licensePlate</td>
        <td>String</td>
        <td>License plate number</td>
    </tr>
    <tr>
        <td>score</td>
        <td>float</td>
        <td>similarity</td>
    </tr>
</table>


## Offline license plate recognition
After importing the offline license plate data, you can get the recognized license plate number in the callback according to step 4 [SDK integration](#license plate integration), and query the license plate information display from the imported license plate database. If integrated Rokid developed [Dual screens with different displays](glass_ai_presentation.md#Dual screens with different displays for face license plate recognition), you only needs to import data for offline recognition.