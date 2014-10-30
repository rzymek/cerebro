package cerebro.probe;

import android.content.SharedPreferences;
import android.content.SharedPreferences.OnSharedPreferenceChangeListener;
import android.preference.PreferenceManager;
import cerebro.lib.Utils;

import com.parse.Parse;
import com.parse.ParseInstallation;
import com.parse.ParsePush;

public class App extends cerebro.lib.App {
	public Logger logger;
	private String currentChannel = null; 
	@Override
	public void onCreate() {
		super.onCreate();
		logger = new Logger(this);
		setupParse();
	}

	public void setupParse() {
		Parse.initialize(this, "GFkfk3rwmiBmuXWrA39xq8h7Phvc9ThUSLGc97c5", "OkWz5Pm0z6xOwLn2ZnanYGueAId8syU1fFcaA6ys");
		ParseInstallation.getCurrentInstallation().saveInBackground();
		
		SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(this);
		prefs.registerOnSharedPreferenceChangeListener(new OnSharedPreferenceChangeListener() {			
			@Override
			public void onSharedPreferenceChanged(SharedPreferences prefs, String key) {
				if(currentChannel != null) {
					ParsePush.unsubscribeInBackground(currentChannel);
				}
				currentChannel = prefs.getString(key, getString(R.string.pref_channel));
				ParsePush.subscribeInBackground(currentChannel);
			}
		});
		
		ParsePush.subscribeInBackground("id"+Utils.getDeviceId(this));
	}

	@Override
	public void uncaughtException(Thread thread, Throwable ex) {
		logger.log(Utils.getStackString(ex));
		super.uncaughtException(thread, ex);
	}

}
