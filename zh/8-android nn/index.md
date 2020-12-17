## android nn使用说明

#### 一、模型转换

- 需要把推理模型转换到tflite模型

#### 二、验证模型是否提速

- 点击该网址https://www.tensorflow.org/lite/performance/measurement, 在Download or build the binary这行下面，下载android_arm_benchmark_model可执行程序
- 把tflite模型和android_arm_benchmark_model程序，推送到设备：/data/local/tmp路径下
- 进入设备/data/local/tmp路径下：adb shell; cd /data/local/tmp
- 执行程序：./android_arm_benchmark_model --num_threads=1 --graph=模型.tflite --use_nnapi=true

  参数说明：--graph:设置要推理的模型；--use_nnapi:是否开启nnapi代理，true表示开启；
- 查看是否运行在了npu上，通过指令查看：cat /proc/interrupts |grep galcore

  如果发现第二列的数字一直在增加，表示运行在了npu设备上；
- 可以通过use_nnapi的开启和关闭来测试运行在npu上，模型是否得到了提速；目前提速比较好的是mobilenet系列

#### 三、对tflite模型进行推理

- 参考例子：https://github.com/tensorflow/examples/tree/master/lite/examples
