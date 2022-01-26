package tv.hasanabi.twitter;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;
import tv.hasanabi.twitter.config.TwitterConfig;

@EnableScheduling
@SpringBootApplication
@EnableMongoRepositories
@EnableConfigurationProperties(TwitterConfig.class)
public class TwitterApplication {

	public static void main(String[] args) {
		SpringApplication.run(TwitterApplication.class, args);
	}

}
