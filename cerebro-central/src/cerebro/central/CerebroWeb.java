package cerebro.central;

import retrofit.http.GET;
import retrofit.http.Query;

public interface CerebroWeb {
	@GET("/rep")
	String report(@Query("lat") double lat, @Query("lon") double lon, @Query("name") String name);
}
