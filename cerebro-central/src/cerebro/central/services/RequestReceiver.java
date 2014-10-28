package cerebro.central.services;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.telephony.SmsMessage;
import cerebro.central.Logger;
import cerebro.central.Tk106Sms;
import cerebro.lib.Utils;
import cerebro.lib.rest.Services;

public class RequestReceiver extends BroadcastReceiver {
	public RequestReceiver() {
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

	private void onReceiveSMS(final Context context, Intent intent, final Logger logger) throws Exception {
		try {
			Bundle pudsBundle = intent.getExtras();
			Object[] pdus = (Object[]) pudsBundle.get("pdus");
			final SmsMessage sms = SmsMessage.createFromPdu((byte[]) pdus[0]);
			logger.log(String.format("sms: [%s] %s", sms.getOriginatingAddress(), sms.getMessageBody()));

			Tk106Sms message = Tk106Sms.create(sms.getMessageBody());
			if (message != null) {
				new AsyncTask<Tk106Sms, Void, String>() {
					protected String doInBackground(Tk106Sms... params) {
						Tk106Sms message = params[0];
						for (int i = 0; i < 5; i++) {
							try {
								return Services.cerebro.report(
										message.lat, 
										message.lon, 
										message.imei, 
										sms.getOriginatingAddress(),
										Utils.getDeviceId(context));
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
		} catch (Exception ex) {
			logger.log(ex + "\n" + Utils.getStackString(ex));
		}
	}
}
