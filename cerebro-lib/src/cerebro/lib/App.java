package cerebro.lib;

import java.lang.Thread.UncaughtExceptionHandler;

import android.app.Application;
import android.util.Log;

import com.parse.Parse;
import com.parse.ParseInstallation;
import com.parse.ParsePush;

public class App extends Application implements UncaughtExceptionHandler {
	protected Config.Read config;

	@Override
	public void onCreate() {
		super.onCreate();
		config = new Config.Read(this);

		Parse.initialize(this, "GFkfk3rwmiBmuXWrA39xq8h7Phvc9ThUSLGc97c5", "OkWz5Pm0z6xOwLn2ZnanYGueAId8syU1fFcaA6ys");
		setupParse();
		Thread.setDefaultUncaughtExceptionHandler(this);
	}
	
	public void setupParse() {
		ParseInstallation.getCurrentInstallation().saveInBackground();
		ParsePush.subscribeInBackground((String) Config.PUSH_CHANNEL.defValue);
	}


	@Override
	public void uncaughtException(Thread thread, Throwable ex) {
		Log.e("APP", "unhandled", ex);
		Utils.handle(ex, this);
	}

}
