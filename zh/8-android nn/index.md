## Android NN使用说明

#### 背景
- [Android Neural Networks API (NNAPI)](https://developer.android.com/ndk/guides/neuralnetworks) 是一个 Android C API，专为在 Android 设备上运行计算密集型运算从而实现机器学习而设计。NNAPI 旨在为更高层级的机器学习框架（如 TensorFlow Lite 和 Caffe2）提供一个基本功能层，用来建立和训练神经网络。搭载 Android 8.1（API 级别 27）或更高版本的所有 Android 设备上都提供该 API
- Android 不仅提供了NN API框架， 同时也接入了tensorflow的移动版tflite，不同框架对不同模型架构的加速性能不一样, 但对APP层的使用API都是一致的， 只有一个参数上的区别(--use_nnapi=true)
- Rokid OS将底层的NPU硬件接入了Android NN框架， APP层只需要使用标准的NNAPI就可以使用NPU硬件的能力，具体开发API操作见[Android NN API](https://github.com/android/ndk-samples/tree/main/nn-samples)
- 基于Android NN 官方介绍掌握的基础上， 可将自己的模型按如下步骤转换为tflite模型， Android NN框架会根据APP层的设置来决定是用底层的tensorflow跑模型， 还是使用NN API运行; 两种框架都是使用tflite模型格式来运行

#### 一、模型转换
- 需要参考Android官网把推理模型转换到tflite模型

#### 二、验证模型是否提速

- 下载benchmark用户模型的Android Tools，用来确定该模型使用移动版tflite和NPU加速的效率对比(点击该网址https://www.tensorflow.org/lite/performance/measurement, 在Download or build the binary这行下面，下载android_arm_benchmark_model可执行程序)
- 把tflite模型和android_arm_benchmark_model程序，推送到设备: /data/local/tmp路径下
- 进入设备/data/local/tmp路径下: adb shell; cd /data/local/tmp
- 执行程序：./android_arm_benchmark_model --num_threads=1 --graph=模型.tflite --use_nnapi=true

  参数说明：--graph:设置要推理的模型；--use_nnapi:是否开启nnapi代理，true表示开启, 使用NPU进行加速;false代表不使用NPU，使用tflite框架进行加速；
- 查看是否运行在了npu上，通过指令查看NPUinterrupt触发次数：cat /proc/interrupts |grep galcore

  如果发现第二列的数字一直在增加，表示运行在了npu设备上；
- 可以通过use_nnapi的开启和关闭来测试运行在npu上，模型是否得到了提速；目前提速比较好的是mobilenet系列

#### 三、对tflite模型进行推理

- 参考例子：https://github.com/tensorflow/examples/tree/master/lite/examples
