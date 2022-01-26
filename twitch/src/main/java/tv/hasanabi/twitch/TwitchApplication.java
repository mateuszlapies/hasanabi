package tv.hasanabi.twitch;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;
import tv.hasanabi.twitch.config.TwitchConfig;

@EnableScheduling
@SpringBootApplication
@EnableMongoRepositories
@EnableConfigurationProperties(TwitchConfig.class)
public class TwitchApplication {

	public static void main(String[] args) {
		SpringApplication.run(TwitchApplication.class, args);
	}

}
