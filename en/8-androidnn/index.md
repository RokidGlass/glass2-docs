## Android NN usage guide

#### 1. Model conversion

- You need to convert the inference model to TFLite model.

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