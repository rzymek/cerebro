package cerebro.lib.rest;

import java.util.Date;

public class Report {
	public static class Location {
		public double lat;
		public double lon;
	}

	public String deviceId;
	public String type;
	
	public String requestedBy;
	public String battery;
	public String signal;

	public String number;
	public Float speed;
	public Float accuracy;

	public Date timestamp_gps;
	public Location location = new Location();
	public String bridgeId;
}
