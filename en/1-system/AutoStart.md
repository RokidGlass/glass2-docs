**Version：V1.0**


<h2 id="1">1. Auto start application after booting</h2>

If you need to quickly enter your application after booting, you can register the system boot broadcast in AndroidManifest.xml, and start the main activity of the application in the ``onReceive`` method. Our system does not restrict the application's self-starting behavior. The reference method is as follows :

```
<receiver 
    android:name=".BootBroadcastReceiver" 
    android:enabled="true" 
    android:exported="true" 
    android:permission="android.permission.RECEIVE_BOOT_COMPLETED"> 
    <intent-filter android:priority="1000”>//set the broadcast priority 
        <!--.receive the BOOT_COMPLETED broadcast--> 
        <category android:name="android.intent.category.DEFAULT" /> 
        <action android:name="android.intent.action.BOOT_COMPLETED" /> 
    </intent-filter> 
</receiver> 


private static final String ACTION_BOOT = "android.intent.action.BOOT_COMPLETED";
@Override
public void onReceive(Context context, Intent intent) { 
    if (intent.getAction().equals(ACTION_BOOT)) { //start your main activity 
        Log.d("BootBroadcastReceiver", "BootBroadcastReceiver onReceive(), Do thing!"); 
        Intent playIntent = new Intent(context, MainActivity.class); 
        playIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK); 
        context.startActivity(playIntent); 

    } 
}
```
**Note: After the application is installed, you need to manually start it once and then the application will automatic start after the next boot**





