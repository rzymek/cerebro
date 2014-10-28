package cerebro.lib;

import java.lang.Thread.UncaughtExceptionHandler;

import android.app.Application;
import android.util.Log;

public class App extends Application implements UncaughtExceptionHandler {
	protected Config.Read config;

	@Override
	public void onCreate() {
		super.onCreate();
		config = new Config.Read(this);
		Thread.setDefaultUncaughtExceptionHandler(this);
	}

	@Override
	public void uncaughtException(Thread thread, Throwable ex) {
		Log.e("APP", "unhandled", ex);
		Utils.handle(ex, this);
	}

}
