package cerebro.central;

import java.util.Arrays;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Tk106Sms {
	public Double lat;
	public Double lon;
	public String imei;

	public static Tk106Sms create(String sms) {
		String[] fields = sms.split(",");
		Tk106Sms value = new Tk106Sms();
		value.lat = toDouble(getMatching(fields, "lat:([0-9]+[.][0-9]+)N"));
		value.lon = toDouble(getMatching(fields, "long:([0-9]+[.][0-9]+)E"));
		value.imei = getMatching(fields, "imei:([0-9]{15})");
		return value.isValid() ? value : null;
	}

	private boolean isValid() {
		return lat != null && lon != null && imei != null && imei.trim().length() > 0;
	}

	private static Double toDouble(String s) {
		try {
			return s == null ? null : Double.valueOf(s);
		} catch (NumberFormatException ex) {
			return null;
		}
	}

	private static String getMatching(String[] fields, String regex) {
		Pattern pattern = Pattern.compile(regex);
		for (String field : fields) {
			Matcher matcher = pattern.matcher(field);
			if (matcher.matches()) {
				return matcher.group(1);
			}
		}
		return null;
	}

	@Override
	public String toString() {
		return Arrays.asList(lat,lon,imei).toString();
	}
}
