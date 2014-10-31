package cerebro.probe.utils;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import cerebro.probe.R;

public class GoToSettingsDialog {	
	public static void show(final Context ctx, String title, String message, final Intent intent) {
		AlertDialog.Builder alertDialog = new AlertDialog.Builder(ctx);
		alertDialog.setTitle(title);
		alertDialog.setMessage(message);
		alertDialog.setIcon(R.drawable.ic_launcher);
		alertDialog.setPositiveButton("OK", new DialogInterface.OnClickListener() {
			public void onClick(DialogInterface dialog, int which) {
				ctx.startActivity(intent);
			}
		});
		alertDialog.setNegativeButton("Anuluj", new DialogInterface.OnClickListener() {
			public void onClick(DialogInterface dialog, int which) {

				dialog.cancel();
			}
		});

		alertDialog.show();
	}
}
