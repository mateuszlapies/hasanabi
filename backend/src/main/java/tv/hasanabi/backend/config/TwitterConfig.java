package tv.hasanabi.backend.config;

import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Setter
@Configuration
@ConfigurationProperties(prefix = "twitter.api")
public class TwitterConfig {
    private String bearer_token;

    @Bean("twitter")
    WebClient twitterWebClient() {
        return WebClient.builder()
                .baseUrl("https://api.twitter.com/2/")
                .defaultHeader("Authorization", String.format("Bearer %s", bearer_token))
                .build();
    }
}
