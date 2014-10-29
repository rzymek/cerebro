package cerebro.lib.rest;

import java.io.IOException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;

import retrofit.RestAdapter;
import retrofit.converter.GsonConverter;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonSyntaxException;
import com.google.gson.TypeAdapter;
import com.google.gson.stream.JsonReader;
import com.google.gson.stream.JsonToken;
import com.google.gson.stream.JsonWriter;

public class Services {
	public static CerebroService cerebro = createService();
	private final static DateFormat iso8601Format = buildIso8601Format();

	private static DateFormat buildIso8601Format() {
		DateFormat iso8601Format = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.US);
		iso8601Format.setTimeZone(TimeZone.getTimeZone("UTC"));
		return iso8601Format;
	}

	protected static CerebroService createService() {
		Gson gson = new GsonBuilder().registerTypeAdapter(Date.class, new TypeAdapter<Date>() {

			@Override
			public synchronized Date read(JsonReader in) throws IOException {
				if (in.peek() == JsonToken.NULL) {
					in.nextNull();
					return null;
				}
				String json = in.nextString();
				try {
					return iso8601Format.parse(json);
				} catch (ParseException e) {
					throw new JsonSyntaxException(json, e);
				}
			}

			@Override
			public synchronized void write(JsonWriter out, Date value) throws IOException {
				if (value == null) {
					out.nullValue();
					return;
				}
				String dateFormatAsString = iso8601Format.format(value);
				out.value(dateFormatAsString);
			}

		}).create();

		return new RestAdapter.Builder().setEndpoint("http://cerebro.meteor.com").setConverter(new GsonConverter(gson))
				.build().create(CerebroService.class);
	}

}
