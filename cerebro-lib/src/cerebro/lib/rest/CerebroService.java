package cerebro.lib.rest;

import retrofit.http.Body;
import retrofit.http.POST;
import retrofit.http.Query;

public interface CerebroService {
	@POST("/report")
	String report(@Body Report report, @Query("name") String name);
	@POST("/register")
	String register(@Body DeviceInfo report, @Query("name") String name);
}