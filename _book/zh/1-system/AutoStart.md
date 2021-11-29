**Version：V1.0**


<h2 id="1">1. 应用开机自启</h2>

如有需要开机后快速进入自己的应用，可以在AndroidManifest.xml中静态注册系统开机广播，并在onReceive方法中启动应用的主activity，我们的系统并未限制应用的开机自启行为，参考方法如下：

```
<receiver 
    android:name=".BootBroadcastReceiver" 
    android:enabled="true" 
    android:exported="true" 
    android:permission="android.permission.RECEIVE_BOOT_COMPLETED"> 
    <intent-filter android:priority="1000”>//提高广播的优先级 
        <!--.接收启动完成的广播--> 
        <category android:name="android.intent.category.DEFAULT" /> 
        <action android:name="android.intent.action.BOOT_COMPLETED" /> 
    </intent-filter> 
</receiver> 


private static final String ACTION_BOOT = "android.intent.action.BOOT_COMPLETED";
@Override
public void onReceive(Context context, Intent intent) { 
    if (intent.getAction().equals(ACTION_BOOT)) { //开机启动完成后，要做的事情 
        Log.d("BootBroadcastReceiver", "BootBroadcastReceiver onReceive(), Do thing!"); 
        Intent playIntent = new Intent(context, MainActivity.class); 
        playIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK); 
        context.startActivity(playIntent); 

    } 
}
```
**注：应用安装后需要手动启动一次，才能实现下次开机后自动启动**





