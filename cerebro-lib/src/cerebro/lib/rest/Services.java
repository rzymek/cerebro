package cerebro.lib.rest;

import java.util.Date;

import retrofit.RestAdapter;
import retrofit.converter.GsonConverter;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.internal.bind.DateTypeAdapter;

public class Services {
	public static CerebroService cerebro = createService();

	protected static CerebroService createService() {
		Gson gson = new GsonBuilder()
	    	.registerTypeAdapter(Date.class, new DateTypeAdapter())
	    	.create();

		return new RestAdapter.Builder()
			.setEndpoint("http://cerebro.meteor.com")
			.setConverter(new GsonConverter(gson))
			.build()
			.create(CerebroService.class);
	}

}
