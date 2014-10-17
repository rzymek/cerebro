package cerebro.probe.msg;

import cerebro.probe.services.GPSListenerService;
import android.content.Context;
import android.content.Intent;
import android.os.Parcel;
import android.os.Parcelable;

public class Activate implements Parcelable, ReceivedMessage {
	public int gpsOnMinutes = -1;
	public int checkIntervalSec = Integer.MAX_VALUE;

	@Override
	public void onReceive(Context ctx) {
		Intent intent = new Intent(ctx, GPSListenerService.class);
		intent.putExtra(GPSListenerService.EXTRA_REQUEST, this);
		ctx.startService(intent);
	}

	public static final Parcelable.Creator<Activate> CREATOR = new Parcelable.Creator<Activate>() {
		public Activate createFromParcel(Parcel in) {
			Activate activate = new Activate();
			activate.gpsOnMinutes = in.readInt();
			activate.checkIntervalSec = in.readInt();
			return activate;
		}

		public Activate[] newArray(int size) {
			return new Activate[size];
		}
	};

	@Override
	public int describeContents() {
		return 0;
	}

	@Override
	public void writeToParcel(Parcel dest, int flags) {
		dest.writeInt(gpsOnMinutes);
		dest.writeInt(checkIntervalSec);
	}

}
