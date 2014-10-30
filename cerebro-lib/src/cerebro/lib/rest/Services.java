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
import android.content.Context;
import android.content.SharedPreferences;
import android.preference.PreferenceManager;
import cerebro.lib.R;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonSyntaxException;
import com.google.gson.TypeAdapter;
import com.google.gson.stream.JsonReader;
import com.google.gson.stream.JsonToken;
import com.google.gson.stream.JsonWriter;

public class Services {
	private static final Gson GSON = new GsonBuilder().registerTypeAdapter(Date.class, new TypeAdapter<Date>() {

		@Override
		public synchronized Date read(JsonReader in) throws IOException {
			if (in.peek() == JsonToken.NULL) {
				in.nextNull();
				return null;
			}
			String json = in.nextString();
			try {
				return ISO_8601.parse(json);
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
			String dateFormatAsString = ISO_8601.format(value);
			out.value(dateFormatAsString);
		}

	}).create();

	private final static DateFormat ISO_8601 = buildIso8601Format();
	
	private static DateFormat buildIso8601Format() {
		DateFormat iso8601Format = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.US);
		iso8601Format.setTimeZone(TimeZone.getTimeZone("UTC"));
		return iso8601Format;
	}

	public static CerebroService createService(Context ctx) {
		SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(ctx);
		String endpoint = prefs.getString(ctx.getString(R.string.pref_server),ctx.getString(R.string.pref_default_server));
		RestAdapter.Builder builder = new RestAdapter.Builder();
		builder.setEndpoint(endpoint);
		builder.setConverter(new GsonConverter(GSON));
		return builder.build().create(CerebroService.class);
	}

}
