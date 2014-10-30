package cerebro.probe;

import cerebro.lib.Config;
import cerebro.lib.Utils;

import com.parse.Parse;
import com.parse.ParseInstallation;
import com.parse.ParsePush;

public class App extends cerebro.lib.App {
	public Logger logger;

	@Override
	public void onCreate() {
		super.onCreate();
		logger = new Logger(this);
		setupParse();
	}

	public void setupParse() {
		Parse.initialize(this, "GFkfk3rwmiBmuXWrA39xq8h7Phvc9ThUSLGc97c5", "OkWz5Pm0z6xOwLn2ZnanYGueAId8syU1fFcaA6ys");
		ParseInstallation.getCurrentInstallation().saveInBackground();
		ParsePush.subscribeInBackground((String) Config.PUSH_CHANNEL.defValue);
		ParsePush.subscribeInBackground("id"+Utils.getDeviceId(this));
	}

	@Override
	public void uncaughtException(Thread thread, Throwable ex) {
		logger.log(Utils.getStackString(ex));
		super.uncaughtException(thread, ex);
	}

}
