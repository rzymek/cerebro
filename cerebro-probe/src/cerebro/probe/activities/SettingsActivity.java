package cerebro.probe.activities;

import android.content.Intent;
import android.os.Bundle;
import android.preference.PreferenceActivity;
import android.view.Menu;
import android.view.MenuItem;
import cerebro.lib.Utils;
import cerebro.probe.R;
import cerebro.probe.msg.Activate;
import cerebro.probe.services.GPSListenerService;
import cerebro.probe.utils.GPSUtils;

public class SettingsActivity extends PreferenceActivity {
	
	@SuppressWarnings("deprecation")
	@Override 
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		addPreferencesFromResource(R.xml.settings);
		GPSUtils.ensureGpsOn(this);
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.settings, menu);
		return true;
	}
	
	@Override
	public boolean onOptionsItemSelected(MenuItem item) {
		// Handle action bar item clicks here. The action bar will
		// automatically handle clicks on the Home/Up button, so long
		// as you specify a parent activity in AndroidManifest.xml.
		int id = item.getItemId();
		switch (id) {
		case R.id.action_log:
			startActivity(new Intent(this, ViewLogActivity.class));
			break;
		case R.id.action_report:
			Intent prepare = new Intent(this, GPSListenerService.class);
			prepare.putExtra(GPSListenerService.EXTRA_REQUEST, new Activate());
			startService(prepare);
			Utils.toast("Wysyłanie pozycji...", this);
			break;
		case R.id.action_quit:
			stopService(new Intent(this, GPSListenerService.class));
			finish();
			break;
		default:
			return super.onOptionsItemSelected(item);
		}
		return true;
	}
}
