package cerebro.probe.msg;

import cerebro.probe.services.GPSListenerService;
import android.content.Context;
import android.content.Intent;
import android.os.Parcel;
import android.os.Parcelable;

public class Activate implements Parcelable, ReceivedMessage {
	public int gpsOnMinutes = 0;
	public int checkIntervalSec = 0;

	@Override
	public int describeContents() {
		return 0;
	}

	@Override
	public void writeToParcel(Parcel dest, int flags) {
		dest.writeInt(gpsOnMinutes);
		dest.writeInt(checkIntervalSec);
	}

	@Override
	public void onReceive(Context ctx) {
		Intent intent = new Intent(ctx, GPSListenerService.class);
		intent.putExtra(GPSListenerService.EXTRA_REQUEST, this);
		ctx.startService(intent);
	}
}
