# Release notes

### version 4.16.3.3 - 2020/11/23

* The issue of returning an error constantly for front face detection in face recognition is fixed

### version 4.15.3.2 - 2020/10/13

* The CPU version and the 2G version of the Rokid glasses need to be integrated separately
* The IQA score is corrected
* The file size of the SDK package is reduced
* The extraction of facial features is improved for the CPU version
* Some known bugs are fixed

### version 4.5.3.1 - 2020/6/11

* The new algorithm quality model is used to ensure the accuracy of computation of facial quality
* The performance of recognition is optimized
* RGB is supported in the recognition of pictures
* The input camera data is returned in faceModel
* The related directory modifications are tested
* By default, the algorithm logging is closed
* The changes to the naming rules of dConfig() and sConfig()

## version 3.1.2

### version 3.1.2.2

* 1. faceDO: Add a property; faceRecogTime: The number of times that the faceRecog algorithm is performed on the face
* 2. The crash that occurs sometimes when the picture to be recognized is obtained is fixed
* 3. The algorithm NPU release version is integrated
* 4. The number of times of alignment per frame is optimized
* 5. The priority policy for the large face is added
* 6. The algorithm model is updated, and the face detection is optimized
* 7. 10,000 or more is supported for the database

## version 3.0.1

### 3.0.1.0

* 1. NPU is supported
* 2. The architecture of algorithm code is optimized

### 3.0.1.2

* 1. faceDo add a property recogBitmap (the picture for face recognition)

## version 2.2.2

### 2.2.2.0

* 1. The memory thrashing caused by frequent creation of objects is solved
* 2. The faceAlign logic is optimized (the original logic: perform faceAlign on the face with the minimum number of times of faceAlign; the current logic: perform faceAlign on the face with badQulity)
* 3. The face database is re-constructed: the face information database is not maintained by this SDK any more, and the database is maintained by the application layer
* 4. The single-person recognition mode is added (perform faceAlign on the largest face for each frame)

## version 2.2.1

### 2.2.1.11

* 1. The issue of failure of init without the privilege is fixed (no need to call init in application)
* 2. The second-time editing of the database is supported
* 3. The issue of probable crash when a delay is set to prevent exit is fixed

### 2.2.1.8

* 1.Parameter configuration is added:
    * Detect maxFaceSize
    * Detect minFaceSize
    * The maximum number of faces detected each time
* 2. The problem of memory leak is solved
* 3. The problem of inaccuracy of position in the resolution of 1080p is solved
* 4. The bug of recognition failure due to a very small buffer in multi-person recognition is fixed
* 5. The issue of memory leak is fixed
* 6. The face model is updated (optimization of the recognition of people wearing glasses)

### 2.2.1.3

* 1. The path to the database is dynamically set
* 2. The demo is optimized
* 3. The issue of crash in detection
* 4. The issue of displaying the previous recognition result after the second-time recognition is fixed
* 5. The database query interface is fixed
* 7. The exception in adding a database
* 8. The speed of recognition is optimized
* 9. The issue of memory leak in initialization is fixed
* 10. The issue of memory leak in adding a face is fixed
* 11. The speed of initialization is optimized

## version 2.2.0

### 2.2.0.4

* 1. A database of features is added

### 2.2.0.1

* 1. The process of faceAlign is optimized
* 2. The process of faceRecog is optimized
* 3. The interface for setting a recognition threshold is added
* 4. The interface for setting a recognition timeout is added
* 5. The interface for setting a recognition time interval is added