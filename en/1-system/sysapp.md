**Version：V1.0**


<h2 id="2">1. System pre-installed applications</h2>

Applications such as Quick Scan, Camera, Gallery, Document and Settings are pre-installed in the system. Among them, some functions of Quick Scan, Camera and Document support extended and customized development and users can conveniently call system applications to realize functions such as taking pictures and videos, browsing videos and viewing documents, and the specific methods are as follows: 

<h2 id="3">2. Supported functions and calling methods</h2>

### 2.1 Quick Scan
Quick Scan provides an interface for other applications to call, so as to realize the functions of network configuration and return the relevant results. The example code is as follows: 

```
Intent intent = new Intent();
ComponentName comp = new ComponentName("com.rokid.glass.scan2",
	"com.rokid.glass.scan2.ScanActivity");
intent.putExtra("scan_model","wifi_connect");
intent.setComponent(comp);
this.startActivityForResult(intent, REQUEST_CODE_QR_SCAN_WIFI);
```

### 2.2 Camera

The Camera application pre-installed in the system is a customized application adapted to AR content, which still supports basic functions such as taking pictures and videos and return relevant results.

[FYI](https://developer.android.com/training/camera/photobasics)


### 2.3 Document

Document is a built-in file browser of the system, which supports browsing videos, pictures and PDF documents and other common formats. Support other applications to open the specified local file by passing parameters.  
The calling method is as follows:

```
ComponentName component = new ComponentName("com.rokid.glass.document2",
	"com.rokid.glass.document2.activity.MainActivity");
Intent intent = new Intent();
intent.setComponent(component);
intent.putExtra("file_name", fileName);//File name with extensions
intent.putExtra("file_path_floder", floder);//The file directory only supports local files, not network URLs
intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK);
startActivity(intent);
```

Usually, Document will display the supported files in the /sdcard/Documents directory by default, or they can display the supported files in the user-defined file directory by calling method as follows:

```
ComponentName component = new ComponentName("com.rokid.glass.document2",
	"com.rokid.glass.document2.activity.MainActivity");
Intent intent = new Intent();
intent.setComponent(component);
intent.putExtra("file_path_floder", "floder");
intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK);
startActivity(intent);
```




