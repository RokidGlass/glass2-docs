# Rokid Glass 在线人脸识别接口规范

## 变更和历史修订记录

版本号   | 日期         | 修改人 | 修改记录
----- | ---------- | --- | ----
0.1.0 | 2019-09-16 | 庄再库 | 初稿

## 概述

为方便开发者基于Rokid Glass开发在线人脸识别功能，定义此在线人脸识别接口规范。

## 接口规范

- 在线识别接口规范

  1. 请求地址: `http(s)://${ip}:${port}/${prefix}/faceRecognize`

    - ip, port, prefix不做限制，根据实际项目确定

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
    "deviceInfo" : "0611061920000161"
    }
    ```

  4. 请求参数说明：

    参数名 | 参数类型 | 必须 | 说明
    --- | --- | --- | --- 
    imageInfo | Object | 否 | 上传的人脸图像信息
    deviceInfo | String | 否 | 设备SN

    - imageInfo 结构说明:

    参数名 | 参数类型 | 必须 | 说明
    | --- | --- | --- | --- 
    size | int | 否 | 人脸抠图大小
    width | int | 否 | 人脸抠图宽度 
    height | int | 否 | 人脸抠图高度 
    type | String | 否 | 固定使用JPG 
    imageFileStr | String | 是 | 人脸抠图文件二进制数据，Base64(DEFAULT)编码生成的字符串

  5. 响应JSON示例:

    - 正确时返回：

    ```json
    {
      "code" : 0,
      "message" : "调用服务成功",
      "faceInfo" : {
        "imageFileStr" : "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMVt+KZ3DEdqysreMn/9k=\n",
        "name" : "张三",
        "tag" : "缉捕"
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

  6. 返回参数说明：

    参数名 | 参数类型 | 是否必须 | 说明
    ---- | ---- | ---- | ---- 
    code | int | 是 | 返回码（0：正确，其他见错误码列表）
    message | String | 是 | 返回状态描述
    faceInfo | Object | 是 | 人脸信息，元素结构如下

    - faceInfo 结构说明

    参数名 | 参数类型 | 是否必须 | 说明
    ---- | ---- | ---- | ---- 
     imageFileStr | String | 是 | 识别结果人脸图（**要求JPG或PNG类型**）文件二进制数据,Base64(DEFAULT)编码生成的字符串 
     name | String | 是 | 人脸对应名字 
     tag | String | 否 | 自定义标签

​

## 集成步骤

1. 根据接口规范定义云端识别接口
2. 编辑配置文件

  - 2.1 配置文件文件名固定为`config.json`
  - 2.2 配置文件内容示例

    ```json
    {
      "recognizeOn" : true,
      "serverUrl" : "http://${ip}:${port}/${prefix}/faceRecoginze"
    }
    ```

  - 2.3 配置说明

    | 字段 | 说明 |
    | ---- | ---- 
    recognizeOn | true表示在线识别打开，false表示关闭 
    serverUrl | 根据接口规范开发的在线识别服务地址 

3. 导入配置文件

  将配置文件 `config.json` 存放到眼镜端 `/sdcard/rokid/faceRecognize/` 目录下。如果首次运行人脸识别应用前，未导入自定义配置文件，对应目录会生成一个默认配置文件，默认配置在线识别关闭。

4. 运行人脸识别应用

  完成上述步骤之后，重新启动人脸识别应用，即可运行人脸识别应用进行在线识别

## 备注

- 错误码说明：

错误码 | 说明
--- | ------------------------
0   | 返回正确                     
1   | 未匹配到人脸信息（人脸不在库中）         
2   | 未检测到人脸（提取人脸特征失败等等）       
3   | 上传的图片不符合要求（分辨率、大小等不符合要求） 
4   | 其他错误                     
