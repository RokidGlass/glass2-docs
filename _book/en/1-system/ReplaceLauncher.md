**Version：V1.0**

<h2 id="1">1. Replace default Launcher</h2>

If the requirement is to run only your own application and do not need other system applications, we also support developers to use their own application as the default Launcher. To replace the system Launcher, you need to follow the steps below:

1. First，your application must have category ``android.intent.category.HOME``,
2. Install your application via adb,
3. Set the system prop via adb,

	```
	adb shell setprop persist.boot.defaultlauncher YourPackageName
	adb shell setprop persist.boot.defaultactivity MainActivityName
	```
4. Restart the glass.





