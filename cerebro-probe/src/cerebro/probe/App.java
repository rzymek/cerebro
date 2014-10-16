package cerebro.probe;

import java.util.Date;

import android.location.Location;
import cerebro.lib.Utils;

import com.parse.ParseObject;

public class App extends cerebro.lib.App {
	private Location currentBestLocation;
	public Logger logger;

	@Override
	public void onCreate() {
		super.onCreate();
		logger = new Logger(this);
	}

	public Location getCurrentBestLocation() {
		return currentBestLocation;
	}

	public void setCurrentBestLocation(Location location) {
		this.currentBestLocation = location;
		
		ParseObject loc = new ParseObject("locrep");
		loc.put("lat", location.getLatitude());
		loc.put("lon", location.getLongitude());
		loc.put("accuracy", location.getAccuracy());
		loc.put("speed", location.getSpeed());
		loc.put("time", new Date(location.getTime()));
		loc.saveInBackground();
	}

	@Override
	public void uncaughtException(Thread thread, Throwable ex) {
		logger.log(Utils.getStackString(ex));
		super.uncaughtException(thread, ex);
	}

}
