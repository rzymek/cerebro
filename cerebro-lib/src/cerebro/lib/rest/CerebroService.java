package cerebro.lib.rest;

import retrofit.http.GET;
import retrofit.http.Query;

public interface CerebroService {
	@GET("/report")
	String report(
		@Query("lat") double lat, 
		@Query("lon") double lon, 
		@Query("name") String name, 
		@Query("number") String number
	);
	
	@GET("/report")
	String report(
		@Query("lat") double lat, 
		@Query("lon") double lon, 
		@Query("name") String name, 
		@Query("number") String number,
		@Query("bridge") String bridge
	);

}
