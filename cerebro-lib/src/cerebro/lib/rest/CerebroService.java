package cerebro.lib.rest;

import retrofit.http.Body;
import retrofit.http.POST;

public interface CerebroService {
	@POST("/report")
	String report(@Body Report report);
}
