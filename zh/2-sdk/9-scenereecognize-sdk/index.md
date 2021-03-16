# ARMaz 场景识别SDK使用

## 依赖
#### 根目录build.gradle添加：
```groovy
allprojects {
    repositories {
        ...
        maven { url 'https://dl.bintray.com/rokid/components' }
    }
}
```
#### module的build.gradle添加：
```groovy
implementation 'com.rokid.glass.scenerecog:rkarmaz:1.0.5'
```


    
## SDK使用
1.  创建识别引擎实例：
    ```
    ExhibitionEngine<R> mExhibitionEngine = new ExhibitionEngineImpl<>();
    ```
2.  初始化识别引擎，设置状态回调：
    ```
    mExhibitionEngine.setEngineCallback(new EngineCallback<R>);
    mExhibitionEngine.init(this, modelPath, resourceMap, focusMode);
    ```
3. 开始识别：
    ```
    mExhibitionEngine.startEngine();
    ```
4. 停止识别：
    ```
    mExhibitionEngine.stopEngine();
    ```
5. 销毁
    ```
    mExhibitionEngine.unInit();
    ```
## 接口文档
### ExhibitionEngine 识别引擎
| Return  | Method                                                                                  | 说明 
|---------|-----------------------------------------------------------------------------------------|----|
| void    | init(Context context, String modelPath, Map resourceConfig, FocusMode cameraFocusMode);| 初始化识别引擎
| void    | setEngineCallback(EngineCallback engineCallback);                                       |设置识别状态回调
| void    | startEngineWithPreview(TextureView textureView);                                        |启动识别（带相机预览）
| void    | startEngine();                                                                          |启动识别（不带相机预览）
| void    | stopEngine();                                                                           |停止识别
| void    | unInit();                                                                               |解注册
| void    | stopCurrent();                                                                          |停止当前识别
| void    | setShowing(boolean showing);                                                            |设置是否显示
| boolean | isShowing();                                                                            |获取识别是否显示状态
| boolean | isRunning();                                                                            |获取是否运行状态
| boolean | isInitialed();                                                                          |获取是否初始化


### EngineCallback<R> 引擎回调
| Return  | Method                                                                                  | 说明 
|---------|-----------------------------------------------------------------------------------------|----|
| void    | onBeforeInit(); | 引擎初始化前
| void    | onAfterInit();                                  | 引擎初始化后
| boolean    | onIntercept(DetectResult var1, R var2); |是否拦截
| void    | onPrepareCurrent(R var1, EnginePrepareCallback var2); | 识别当前POI完成，展示前准备
| void    | onShowCurrent(DetectResult var1, R var2);  | 展示当前POI
| void    | onPrepareNext(R var1, EnginePrepareCallback var2);  | 识别下一个POI完成，展示前准备
| void    | onSwitchNext(DetectResult var1, R var2); | 切换展示下一个POI
| void    | onTracking(DetectResult var1, R var2);  |设置是否显示
| void    | onStopCurrent(); | 当前展示已停止

### EnginePrepareCallback 内容展示前处理回调
| Return  | Method                                                                                  | 说明 
|---------|-----------------------------------------------------------------------------------------|----|
| void    | onPrepareDone();| 展示poi媒体资源前，可以进行前处理，比如动画、音效播放，准备完成必须调用EnginePrepareCallback.onPrepareDone()通知引擎

## 名词解释
 - `R` 是java中的泛型，在声明ExhibitionEngine对象时，传入具体类型，引擎的回调就会输出该类型，例如（只包含部分内容，仅供参考）：
 ```
 public class ResourceBean {

    /**
     * poi名称
     */
    private String name;

    /**
     * poi类型 {@link ResourceType}
     */
    private int type;

    /**
     * 展示资源名
     */
    private String resName;

    /**
     * poi缩略图
     */
    private String thumb;
}
 ```

## 注意事项
- EngineCallback的接口均在子线程中回调，不可以在回调中直接更新UI，需要切换到UI线程