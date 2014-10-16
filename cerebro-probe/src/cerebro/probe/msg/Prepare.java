package cerebro.probe.msg;

import android.content.Context;
import android.content.Intent;
import cerebro.probe.services.GPSListenerService;

public class Prepare extends cerebro.lib.msg.Prepare implements ReceivedMessage {
	@Override
	public void onReceive(Context context) {
		Intent prepare = new Intent(context, GPSListenerService.class);
		prepare.putExtra(GPSListenerService.EXTRA_HIGH_ALERT, seconds);
		context.startService(prepare);
	}

}
