# 人脸识别在线SDK
**Version: 3.0.1**  

---
## 一、介绍

### 1.1 概述
  * 为方便开发者基于Rokid Glass开发在线人脸识别功能，定义此接口规范。  

### 1.2 适用范围
  * 开发者：开发者有自己的云端人脸库，并有云端开发能力。
  * 开发目的：可以根据此Rokid Glass接口协议，开发满足自身需求的Rokid Glass在线人脸识别产品

---
## 二、集成说明

1.&nbsp;根据接口规范实现云端识别接口  
2.&nbsp;编辑配置文件

  - 2.1 配置文件文件名固定为`config.json`
  - 2.2 配置文件内容示例，默认为：

    ```json
    {
      "recognizeOn" : false,
      "serverUrl" : "http://10.88.1.127:8848/faceRecognize"
    }
    ```

  - 2.3 配置说明

字段         | 说明 
------------|--------------------------------
recognizeOn | true表示在线识别打开，false表示关闭 
serverUrl   | 可以根据下面的接口规范，修改实际的在线识别服务地址 

3.&nbsp;导入修改后的配置文件

  将修改后的配置文件 `config.json` 存放到眼镜端 `/sdcard/rokid/faceRecognize/` 目录下。如果首次运行人脸识别应用前，未导入自定义配置文件，对应目录会生成一个默认配置文件，默认配置在线识别关闭。

4.&nbsp;运行人脸识别应用

  完成上述步骤之后，重新启动人脸识别应用，即可运行人脸识别应用进行在线识别

---
## 三、接口规范

### 设备端请求
1. 请求地址: `http(s)://${ip}:${port}/${suffix}`

    - ip, port, suffix 不做限制，眼镜端会读取`config.json`配置文件向云端发送请求

2. 请求方式： `POST`

3. 请求示例：

    ```json
    {
      "imageInfo" : {
        "size" : 3686400,
        "width" : 1280,
        "height" : 720,
        "type" : "JPG",
        "imageFileStr" : "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMVt+KZ3DEdqysreMn/9k=\n"
        },
      "deviceInfo" : "0611061920000161",
      "trackId" : 34,
    }
    ```

4. 请求参数说明:
 
参数名      | 参数类型 | 必须 | 说明
---------- | ------ | ---- | --- 
imageInfo  | Object | 是   | 上传的人脸图像信息
deviceInfo | String | 否   | 设备SN
trackId    | int    | 是   | 人脸跟踪id

    - imageInfo 结构说明:

参数名        | 参数类型 | 必须  | 说明
-------------|--------|-------|----------- 
size         | int    | 否    | 人脸抠图大小
width        | int    | 否    | 人脸抠图宽度 
height       | int    | 否    | 人脸抠图高度 
type         | String | 否    | 固定使用JPG 
imageFileStr | String | 是    | 人脸抠图文件二进制数据，<br/>Base64(NO_WRAP)编码生成的字符串

### 云端响应
1. 响应JSON示例:

     - 正确时返回：

     ```json
     {
       "code" : 0,
       "message" : "调用服务成功",
       "faceInfo" : {
         "imageFileStr" : "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMVt+KZ3DEdqysreMn/9k=\n",
         "name" : "张三",
         "tag" : "通过",
         "trackId" : 34
       }
     }
     ```

     - 错误时返回：

     ```json
     {
       "code" : 1,
       "message" : "未检测到人脸",
       "faceInfo" : {
       }
     }
     ```

2. 返回参数说明：

参数名    | 参数类型  | 必须 | 说明
---------|---------|------|------------------------------ 
code     | int     | 是    | 返回码（0：正确，其他见错误码列表）
message  | String  | 是    | 返回状态描述
faceInfo | Object  | 是    | 人脸信息，元素结构如下

- faceInfo 结构说明

参数名        | 参数类型 | 必须 | 说明
-------------|---------|-----|------------------------------------------------ 
imageFileStr | String  | 是   | 识别结果人脸图（**要求JPG或PNG类型**）文件二进制数据,<br/> Base64(NO_WRAP)编码生成的字符串 
name         | String  | 是   | 人脸对应名字 
tag          | String  | 否   | 自定义标签
trackId      | int     | 是   | 请求携带的人脸跟踪id

---
## 四、备注

- 错误码说明：

错误码 | 说明
------|------------------------
0     | 返回正确                     
1     | 未匹配到人脸信息（人脸不在库中）         
2     | 未检测到人脸（提取人脸特征失败等等）       
3     | 上传的图片不符合要求（分辨率、大小等不符合要求） 
4     | 其他错误                     
