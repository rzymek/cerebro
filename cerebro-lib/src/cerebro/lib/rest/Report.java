package cerebro.lib.rest;

import java.util.Date;

public class Report extends DeviceInfo {
	public static class Location {
		public double lat;
		public double lon;
	}

	public String requestedBy;
	public String battery;
	public String signal;

	public Float speed;
	public Float accuracy;

	public Date timestamp_gps;
	public Location location = new Location();
	public String bridgeId;
}
