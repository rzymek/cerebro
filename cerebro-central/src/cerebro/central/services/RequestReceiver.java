package cerebro.central.services;

import java.util.Date;

import retrofit.RestAdapter;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.telephony.SmsMessage;
import cerebro.central.CerebroWeb;
import cerebro.central.Logger;
import cerebro.central.Tk106Sms;
import cerebro.lib.Utils;

import com.parse.ParseObject;

public class RequestReceiver extends BroadcastReceiver {
	private final CerebroWeb cerebro;

	public RequestReceiver() {
		cerebro = new RestAdapter.Builder().setEndpoint("http://cerebro.meteor.com").build().create(CerebroWeb.class);
	}

	@Override
	public void onReceive(Context context, Intent intent) {
		Logger logger = new Logger(context);
		try {
			onReceiveSMS(context, intent, logger);
		} catch (Exception ex) {
			Utils.handle(ex, context);
		} finally {
			logger.close();
		}
	}

	private void onReceiveSMS(Context context, Intent intent, final Logger logger) throws Exception {
		try {
			Bundle pudsBundle = intent.getExtras();
			Object[] pdus = (Object[]) pudsBundle.get("pdus");
			SmsMessage sms = SmsMessage.createFromPdu((byte[]) pdus[0]);
			logger.log(String.format("sms: [%s] %s", sms.getOriginatingAddress(), sms.getMessageBody()));

			Tk106Sms message = Tk106Sms.create(sms.getMessageBody());
			if (message != null) {
				new AsyncTask<Tk106Sms, Void, String>() {
					protected String doInBackground(Tk106Sms... params) {
						Tk106Sms message = params[0];
						for (int i = 0; i < 5; i++) {
							try {
								return cerebro.report(message.lat, message.lon, message.imei);
							} catch (Exception ex) {
								logger.log(ex.toString());
								try {
									Thread.sleep(1000);
								} catch (InterruptedException e) {
									break;
								}
							}
						}
						return null;
					};
				}.execute(message);
			}

			ParseObject obj = new ParseObject("sms");
			obj.put("from", sms.getOriginatingAddress());
			obj.put("text", sms.getMessageBody());
			obj.put("time", new Date(sms.getTimestampMillis()));
			obj.saveInBackground();

		} catch (Exception ex) {
			logger.log(ex + "\n" + Utils.getStackString(ex));
		}
	}
}
