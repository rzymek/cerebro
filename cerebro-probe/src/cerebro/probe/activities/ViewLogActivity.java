package cerebro.probe.activities;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.DialogInterface.OnClickListener;
import android.database.Cursor;
import android.os.Bundle;
import android.support.v7.app.ActionBarActivity;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.TextView;
import cerebro.probe.App;
import cerebro.probe.Logger;
import cerebro.probe.R;

public class ViewLogActivity extends ActionBarActivity {
		private Logger logger;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		Thread.setDefaultUncaughtExceptionHandler((App) getApplication());
		setContentView(R.layout.activity_view_log);
		logger = ((App) getApplication()).logger;
	}

	@Override
	protected void onResume() {
		super.onResume();
		int limit = 500;
		Cursor cursor = logger.getLog(limit);
		try {
			StringBuilder buf = new StringBuilder();
			SimpleDateFormat fmt = new SimpleDateFormat("MM.dd HH:mm:ss", Locale.ENGLISH);
			while (cursor.moveToNext()) {
				String msg = cursor.getString(0);
				long timestamp = cursor.getLong(1);
				String date = fmt.format(new Date(timestamp));
				buf.append(date).append(" ").append(msg).append("\n");
			}
			TextView logView = (TextView) findViewById(R.id.logView);
			logView.setText(buf);
		} finally {
			cursor.close();
		}
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.view_log, menu);
		return true;
	}

	@Override
	public boolean onOptionsItemSelected(MenuItem item) {
		// Handle action bar item clicks here. The action bar will
		// automatically handle clicks on the Home/Up button, so long
		// as you specify a parent activity in AndroidManifest.xml.
		int id = item.getItemId();
		switch (id) {
		case R.id.action_refresh:
			onResume();
			break;
		case R.id.action_reset:
			AlertDialog.Builder builder = new AlertDialog.Builder(this);
			builder.setTitle("Mortar");
			builder.setMessage(R.string.reset_log);
			builder.setPositiveButton(android.R.string.ok, new OnClickListener() {
				@Override
				public void onClick(DialogInterface arg0, int arg1) {
					logger.reset();
					onResume();
				}
			});
			builder.setNegativeButton(android.R.string.cancel, null);
			builder.create().show();
			break;
		default:
			return super.onOptionsItemSelected(item);
		}
		return true;
	}
}
