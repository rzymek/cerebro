package cerebro.probe.msg;

import android.content.Context;
import android.content.SharedPreferences;
import android.content.SharedPreferences.Editor;
import android.preference.PreferenceManager;
import cerebro.lib.R;

public class ConfigMsg implements ReceivedMessage {
	public String server;
	public String channel;

	@Override
	public void onReceive(Context ctx) {
		SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(ctx);
		Editor edit = prefs.edit();
		if(server != null) {
			edit.putString(ctx.getString(R.string.pref_server), server);
		}
		if(channel != null) {
			edit.putString(ctx.getString(cerebro.probe.R.string.pref_channel), channel);
		}
		edit.commit();
	}
}
