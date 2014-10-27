package cerebro.probe.services;

import retrofit.http.GET;
import retrofit.http.Query;

public interface Cerebro {
	@GET("/report")
	String report(
		@Query("lat") double lat, 
		@Query("lon") double lon, 
		@Query("name") String name, 
		@Query("number") String number
	);
}
