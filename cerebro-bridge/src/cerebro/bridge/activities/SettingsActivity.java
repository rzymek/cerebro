package cerebro.bridge.activities;

import android.os.Bundle;
import android.preference.PreferenceActivity;
import cerebro.bridge.R;

public class SettingsActivity extends PreferenceActivity {
	
	@Override 
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		addPreferencesFromResource(R.xml.settings);
	}
}
