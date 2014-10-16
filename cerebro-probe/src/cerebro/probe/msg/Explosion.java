package cerebro.probe.msg;

import android.content.Context;
import cerebro.probe.App;

public class Explosion extends cerebro.lib.msg.Explosion implements ReceivedMessage {
	@Override
	public void onReceive(Context context) {
		App app = (App) context.getApplicationContext();
		app.explosionEvent(this);
	}
}
