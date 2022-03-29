package tv.hasanabi.chat;

import com.google.auth.oauth2.AccessToken;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ChatApplication {

	public static void main(String[] args) {
		SpringApplication.run(ChatApplication.class, args);
		FirebaseOptions options = FirebaseOptions.builder()
				.setDatabaseUrl("https://hasanabi-tv.firebaseio.com/")
				.setCredentials(GoogleCredentials.newBuilder().setAccessToken(new AccessToken("", null)).build())
				.build();
		FirebaseApp.initializeApp(options);
	}

}
