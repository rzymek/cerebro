package cerebro.probe.activities;

import android.os.Bundle;
import android.preference.PreferenceActivity;
import cerebro.probe.R;

public class SettingsActivity extends PreferenceActivity {
	
	@SuppressWarnings("deprecation")
	@Override 
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		addPreferencesFromResource(R.xml.settings);
	}
}
