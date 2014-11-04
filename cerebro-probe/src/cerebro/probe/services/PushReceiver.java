package cerebro.probe.services;

import android.content.Context;
import android.content.Intent;
import android.util.Log;
import cerebro.lib.Utils;
import cerebro.probe.Logger;
import cerebro.probe.msg.ReceivedMessage;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import com.parse.ParsePushBroadcastReceiver;

public class PushReceiver extends ParsePushBroadcastReceiver {

	@Override
	protected void onPushReceive(Context ctx, Intent intent) {
		try {
			String json = intent.getExtras().getString("com.parse.Data");
			Log.i("PUSH",json);
			onPushReceive(ctx, json);
		} catch (Exception ex) {
			Utils.handle(ex, ctx);
		}
	}

	private void onPushReceive(Context ctx, String rawJson) throws Exception {
		final String pkg = ReceivedMessage.class.getPackage().getName();
		Gson gson = new Gson();
		JsonParser parser = new JsonParser();

		JsonElement json = parser.parse(rawJson);
		String type = json.getAsJsonObject().get("type").getAsString();
		Class<?> target = Class.forName(pkg + '.' + type);
		ReceivedMessage message = (ReceivedMessage) gson.fromJson(json, target);
		String msg = message.getClass().getSimpleName() + ":" + rawJson;
		Logger logger = new Logger(ctx);
		logger.log("push: " + msg);
		logger.close();
		message.onReceive(ctx);
	}
}
