## Android NN usage guide
#### Background
- [The Android Neural Networks API (NNAPI)](https://developer.android.com/ndk/guides/neuralnetworks)) is an Android C API designed for running computationally intensive operations for machine learning on Android devices. NNAPI is designed to provide a base layer of functionality for higher-level machine learning frameworks, such as TensorFlow Lite and Caffe2, that build and train neural networks. The API is available on all Android devices running Android 8.1 (API level 27) or higher.

- Android provides not only NN API, but also tflite architecture. Different frameworks have different acceleration performances for different model architectures. Fortunately, the APIs used in APP Layer are all the same except only one parameters(--use_nnapi=true)

- Rokid has integrated NPU hardware into Android frameworks, in order for user in APP Layer to use it by the standard NNAPI. For specific development API operations, see [Android NN API](https://github.com/android /ndk-samples/tree/main/nn-samples)

- Based on official introduction of Android NNAPI, you can convert your model to a 'tflite' model according to the following steps. The Android NN frameworks will decided whether to run tflite arch or NNAPI framework according to the user APP parameters. Emphasized to say, both of them run model using 'tflite' format.

#### 1. Model conversion
- Convert your private model to TFLite model according to standard Android description.

#### 2. Verify whether the model is speeding up inference

- Click on the URL https://www.tensorflow.org/lite/performance/measurement, and download the executable program named "android\_arm\_benchmark\_model" under the section heading "Download or build the binary".

- Push the TFLite model and the program "android\_arm\_benchmark\_model" to the path "/data/local/tmp" in the device.

- Enter the path "/data/local/tmp" in the device: adb shell; cd /data/local/tmp

- Execute the program: ./android\_arm\_benchmark\_model --num\_threads=1 --graph=model.tflite --use\_nnapi=true
  
  Notes for the parameters: --graph: Path to the TFLite model file; --use\_nnapi: Specifies whether to switch on the nnapi agent (set to "true" to switch it on)

- Check whether the program is running on an NPU using the command: cat /proc/interrupts \|grep galcore
  
  If the number in the second column has been increasing, it means the program is running on an NPU device.

- You can find out whether the model is speeding up inference when the program is running on an NPU by switching on and off "use\_nnapi". At the moment, the MobileNet series can result in good speed-up.

#### 3. Perform inference with the TFLite model

- Examples that you can reference: https://github.com/tensorflow/examples/tree/master/lite/examples
