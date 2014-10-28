package cerebro.central;

import cerebro.lib.Utils;

public class App extends cerebro.lib.App {
	public Logger logger;

	@Override
	public void onCreate() {
		super.onCreate();
		logger = new Logger(this);
	}
	
	@Override
	public void uncaughtException(Thread thread, Throwable ex) {
		logger.log(Utils.getStackString(ex));
		super.uncaughtException(thread, ex);
	}

}
