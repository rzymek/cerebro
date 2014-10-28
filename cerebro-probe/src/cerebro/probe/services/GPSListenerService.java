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
import android.telephony.TelephonyManager;
import cerebro.lib.AbstractLocationListener;
import cerebro.lib.SateliteListener;
import cerebro.lib.Utils;
import cerebro.lib.rest.Report;
import cerebro.lib.rest.Services;
import cerebro.probe.App;
import cerebro.probe.Logger;
import cerebro.probe.R;
import cerebro.probe.activities.LuncherActivity;
import cerebro.probe.activities.ViewLogActivity;
import cerebro.probe.msg.Activate;
import cerebro.probe.utils.GPSUtils;

import com.parse.ParseObject;

public class GPSListenerService extends Service {
	private static final int NOTIFIFACTION_ID = 8126318;

	private static final float GPS_MIN_DISTANCE = 0;

	public static final String EXTRA_REQUEST = "request";

	protected static final float MIN_ACCURACY = 50;

	private LocationManager gps;

	private SateliteListener sateliteListener;

	protected Logger logger;

	// ========================================================================================================

	private Activate request;
	private DateTime started = new DateTime(0);
	private DateTime lastReport = null;
	private Location lastReportLocation;

	private LocationListener gpsListener = new AbstractLocationListener() {

		@Override
		public void onLocationChanged(Location location) {
			boolean lastReportNotSufficientlyAccurate = lastReportLocation == null || lastReportLocation.getAccuracy() > MIN_ACCURACY;
			if (GPSUtils.isBetterLocation(location, lastReportLocation)) {
				boolean sufficientlyAccurate = location.getAccuracy() <= MIN_ACCURACY;
				boolean moreAccurate = lastReportLocation == null || location.getAccuracy() > lastReportLocation.getAccuracy();
				boolean timeForNewReport = lastReport == null || lastReport.plusSeconds(request.checkIntervalSec).isBeforeNow();
				logger.log(
					(lastReportNotSufficientlyAccurate?"lastReportNotSufficientlyAccurate ":"#")+
					(sufficientlyAccurate?"sufficientlyAccurate ":"#")+
					(moreAccurate?"moreAccurate ":"#")+
					(timeForNewReport?"timeForNewReport ":"#")+
					""
				);
				if (timeForNewReport || (lastReportNotSufficientlyAccurate && sufficientlyAccurate && moreAccurate)) {
					reportLocation(location);
				}
				lastReportLocation = location;
				logger.put(location);
				lastReportNotSufficientlyAccurate = !sufficientlyAccurate;
			}
			if (!lastReportNotSufficientlyAccurate && lastReport != null && started.plusMinutes(request.gpsOnMinutes).isBeforeNow()) {
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
		gps.addGpsStatusListener(sateliteListener);

		sateliteListener = new SateliteListener(gps) {
			@Override
			protected void onSatelitesChanged(int used, int max) {
				logger.log("sat: " + used + "/" + max);
			}
		};
		logger.log("listener created\n" + Utils.getSystemInfo());
	}

	protected void reportLocation(final Location location) {
		logger.log("reporting location: acc:" + location.getAccuracy());
		lastReport = new DateTime();
		
		ParseObject report = new ParseObject("locrep");
		report.put("lat", location.getLatitude());
		report.put("lon", location.getLongitude());
		report.put("acc", location.getAccuracy());
		report.put("time", new Date(location.getTime()));
		report.put("device", Utils.getDeviceId(this));
		report.saveInBackground();
		
		new AsyncTask<Void, Void, String>() {

			@Override
			protected String doInBackground(Void... params) {
				Report report = new Report();
				report.deviceId = Utils.getDeviceId(GPSListenerService.this);
				report.type = getApplicationInfo().packageName; 
				report.location.lat = location.getLatitude();
				report.location.lon = location.getLongitude();
				report.number = getPhoneNumber();
				report.speed = location.getSpeed();
				report.accuracy = location.getAccuracy();
				report.timestamp_gps = new Date(location.getTime());
				return Services.cerebro.report(report);
			}

		}.execute();
		
	}

	protected String getPhoneNumber() {
		TelephonyManager telephony = (TelephonyManager) getSystemService(TELEPHONY_SERVICE);
		return telephony.getLine1Number();
	}

	@Override
	public int onStartCommand(Intent intent, int flags, int startId) {
		logger.log("start command");
		request = intent.getParcelableExtra(EXTRA_REQUEST);
		if (request == null) {

		} else {
			started = new DateTime();
			lastReport = null;
			logger.log("GPS: activate");

			gps.removeUpdates(gpsListener);
			gps.requestLocationUpdates(GPS_PROVIDER, request.checkIntervalSec, GPS_MIN_DISTANCE, gpsListener);
		}
		startForeground(NOTIFIFACTION_ID, createNotification(null, null));
		return START_NOT_STICKY;
	}

	private Notification createNotification(CharSequence title, CharSequence msg) {
		Intent resultIntent = new Intent(this, ViewLogActivity.class);
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
		if (msg != null) {
			builder.setContentText(msg);
		}

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
		gps.removeGpsStatusListener(sateliteListener);
	}

	@Override
	public IBinder onBind(Intent intent) {
		return (null);
	}
}
