package cerebro.lib.rest;

import retrofit.RestAdapter;

public class Services {
	public static CerebroService cerebro = createService();

	protected static CerebroService createService() {
		return new RestAdapter.Builder()
			.setEndpoint("http://cerebro.meteor.com")
			.build()
			.create(CerebroService.class);
	}

}
