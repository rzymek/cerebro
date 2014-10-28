package cerebro.lib.rest;

import retrofit.http.GET;

public interface CerebroService {
	@GET("/report")
	String report(Report report);
}
