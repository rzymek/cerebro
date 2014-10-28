package cerebro.central;

import java.util.Date;
import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;

public class Tk106Sms {
	public Double lat;
	public Double lon;
	public String imei;
	public Float speed;
	public String requestedBy;
	public Date date;
	public String battery;
	public String signal;

	private static final DateTimeFormatter DATE_FORMAT = DateTimeFormat.forPattern("dd/MM/yy HH:mm").withLocale(Locale.ENGLISH);
	private static final Pattern PATTERN = Pattern.compile("" +
		"([^,]*)," + //1
		"lat:([0-9]+[.][0-9]+)N," + //2
		"long:([0-9]+[.][0-9]+)E," + //3
		"speed:([0-9]+[.][0-9]+)," + //4
		"([0-9]+/[0-9]+/[0-9]+ [0-9]+:[0-9]+)," + //5
		"Batt:([0-9]+%)," + //6
		"Signal:(.)," + //7
		"[^,]*," +
		"imei:([0-9]{15})," + //8
		"[^,]*," +
		"[^,]*," +
		"[^,]*," +
		"[^,]*," +
		"[^,]*"
	);

	public static Tk106Sms create(String sms) {
		Matcher matcher = PATTERN.matcher(sms);
		if(matcher.matches()) {
			//fully parse
			Tk106Sms value = new Tk106Sms();
			value.requestedBy = matcher.group(1);
			value.lat = toDouble(matcher.group(2));
			value.lon = toDouble(matcher.group(3));
			value.speed = toFloat(matcher.group(4));
			value.date = toDate(matcher.group(5));
			value.battery= matcher.group(6);
			value.signal = matcher.group(7);
			value.imei = matcher.group(8);
			return value;
		}else{
			//fallback - minimal pars
			String[] fields = sms.split(",");
			Tk106Sms value = new Tk106Sms();
			value.lat = toDouble(getMatching(fields, "lat:([0-9]+[.][0-9]+)N"));
			value.lon = toDouble(getMatching(fields, "long:([0-9]+[.][0-9]+)E"));
			value.imei = getMatching(fields, "imei:([0-9]{15})");
			if (value.isValid()) {
				return value;
			} else {
				return null;
			}
		}
	}

	private static Date toDate(String s) {
		try {
			if (s == null) {
				return null;
			}else{
				return DATE_FORMAT.parseDateTime(s).toDate();
			}
		} catch (IllegalArgumentException ex) {
			return null;
		}
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

	private static Float toFloat(String s) {
		try {
			return s == null ? null : Float.valueOf(s);
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

}
