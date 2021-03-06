package cerebro.probe.services;

import static android.location.LocationManager.GPS_PROVIDER;

import java.util.Date;

import org.joda.time.DateTime;

import android.app.Notification;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.AsyncTask;
import android.os.IBinder;
import android.support.v4.app.NotificationCompat;
import android.support.v4.app.TaskStackBuilder;
import cerebro.lib.AbstractLocationListener;
import cerebro.lib.Utils;
import cerebro.lib.rest.CerebroService;
import cerebro.lib.rest.Report;
import cerebro.lib.rest.Services;
import cerebro.probe.App;
import cerebro.probe.Logger;
import cerebro.probe.R;
import cerebro.probe.activities.LuncherActivity;
import cerebro.probe.activities.SettingsActivity;
import cerebro.probe.msg.Activate;

import com.parse.ParseObject;

public class GPSListenerService extends Service {
	private static final int NOTIFIFACTION_ID = 8126318;
	private static final float GPS_MIN_DISTANCE = 0;
	public static final String EXTRA_REQUEST = "request";
	protected static final float MIN_ACCURACY = 50;

	private LocationManager gps;
	protected Logger logger;

	private Activate request;
	private DateTime started = new DateTime(0);

	private LocationListener gpsListener = new AbstractLocationListener() {

		@Override
		public void onLocationChanged(Location location) {
			reportLocation(location);
			if (started.plusMinutes(request.gpsOnMinutes).isBeforeNow()) {
				stopGps();
			}
		}
	};

	@Override
	public void onCreate() {
		super.onCreate();
		Thread.setDefaultUncaughtExceptionHandler((App) getApplication());
		logger = ((App) getApplication()).logger;
		gps = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
		logger.log("listener created\n" + Utils.getSystemInfo());
	}

	protected void reportLocation(final Location location) {
		logger.log("reporting location: acc:" + location.getAccuracy());

		ParseObject report = new ParseObject("locrep");
		report.put("lat", location.getLatitude());
		report.put("lon", location.getLongitude());
		report.put("acc", location.getAccuracy());
		report.put("time", new Date(location.getTime()));
		report.put("device", Utils.getDeviceId(this));
		report.saveInBackground();

		final CerebroService cerebro = Services.createService(this);
		new AsyncTask<Void, Void, String>() {
			@Override
			protected String doInBackground(Void... params) {
				GPSListenerService ctx = GPSListenerService.this;
				Report report = new Report();
				report.deviceId = Utils.getDeviceId(ctx);
				report.type = getApplicationInfo().packageName;
				report.location.lat = location.getLatitude();
				report.location.lon = location.getLongitude();
				report.number = Utils.getPhoneNumber(ctx);
				report.speed = location.getSpeed();
				report.accuracy = location.getAccuracy();
				report.timestamp_gps = new Date(location.getTime());
				return cerebro.report(report, Utils.getUsername(ctx));
			}
		}.execute();

	}

	@Override
	public int onStartCommand(Intent intent, int flags, int startId) {
		logger.log("start command");
		request = intent.getParcelableExtra(EXTRA_REQUEST);
		if (request != null) {
			started = new DateTime();
			logger.log("GPS service: " + request);
			if (request.gpsOnMinutes == 0 && request.checkIntervalSec == 0) {
				return START_NOT_STICKY;
			}
			startGPS();
		}
		startForeground(NOTIFIFACTION_ID, createNotification());
		return START_NOT_STICKY;
	}

	private Notification createNotification() {
		Intent resultIntent = new Intent(this, SettingsActivity.class);
		resultIntent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);

		/*
		 * The stack builder object will contain an artificial back stack for
		 * the started Activity. This ensures that navigating backward from the
		 * Activity leads out of your application to the Home screen.
		 */
		TaskStackBuilder stackBuilder = TaskStackBuilder.create(this);
		// Adds the back stack for the Intent (but not the Intent itself)
		stackBuilder.addParentStack(LuncherActivity.class);
		// Adds the Intent that starts the Activity to the top of the stack
		stackBuilder.addNextIntent(resultIntent);
		PendingIntent resultPendingIntent = stackBuilder.getPendingIntent(0, PendingIntent.FLAG_UPDATE_CURRENT);

		NotificationCompat.Builder builder = new NotificationCompat.Builder(this);
		builder.setContentIntent(resultPendingIntent);
		builder.setSmallIcon(R.drawable.ic_launcher);
		builder.setContentTitle(getString(R.string.app_name));
		builder.setContentText(Utils.getUsername(this));

		Notification notification = builder.build();
		notification.flags |= Notification.FLAG_NO_CLEAR;
		return notification;
	}

	@Override
	public void onDestroy() {
		super.onDestroy();
		logger.log("shutting down");
		stopGps();
		stopForeground(true);
	}

	protected void stopGps() {
		logger.log("GPS: stop");
		gps.removeUpdates(gpsListener);

	}

	@Override
	public IBinder onBind(Intent intent) {
		return (null);
	}

	private void startGPS() {
		logger.log("GPS ON");
		gps.requestLocationUpdates(GPS_PROVIDER, request.checkIntervalSec * 1000, GPS_MIN_DISTANCE, gpsListener);
	}
}
