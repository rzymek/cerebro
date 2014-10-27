package cerebro.probe.services;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import cerebro.lib.Utils;
import cerebro.lib.data.GsmMessage;
import cerebro.probe.Logger;
import cerebro.probe.msg.ReceivedMessage;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

public class SMSReceiver extends BroadcastReceiver {
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

	private void onReceivePush(Context context, Intent intent, Logger logger) throws Exception {
		final String pkg = ReceivedMessage.class.getPackage().getName();
		String rawJson = intent.getExtras().getString("com.parse.Data");

		Gson gson = new Gson();
		JsonParser parser = new JsonParser();

		JsonElement json = parser.parse(rawJson);
		String type = json.getAsJsonObject().get("type").getAsString();
		Class<?> target = Class.forName(pkg + '.' + type);
		ReceivedMessage message = (ReceivedMessage) gson.fromJson(json, target);
		String msg = message.getClass().getSimpleName() + ":" + Utils.toString(intent.getExtras());
		logger.log("push: " + msg);
		message.onReceive(context);
	}

	private void onReceiveSMS(Context context, Intent intent, Logger logger) throws Exception {
		Bundle extras = intent.getExtras();
		GsmMessage sms = GsmMessage.createFromBundle(extras);
		if (sms == null) {
			sms = (GsmMessage) extras.getSerializable("mortar");
		}

		// String msg = message.getClass().getSimpleName() + " from " + sms.from
		// + " (" + new Date(sms.timestamp) + ")";
		// logger.log("sms: " + msg);
		// message.onReceive(context);
	}
}
