package cerebro.probe.msg;

import cerebro.probe.App;

import android.content.Context;

public class Explosion extends org.mortar.common.msg.Explosion implements ReceivedMessage {
	@Override
	public void onReceive(Context context) {
		App app = (App) context.getApplicationContext();
		app.explosionEvent(this);
	}
}
