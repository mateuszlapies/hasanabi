package tv.hasanabi.backend.config;

import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Setter
@Configuration
@ConfigurationProperties(prefix = "twitter")
public class TwitterConfig {
    private String api;

    @Bean("twitter")
    WebClient twitchWebClient() {
        return WebClient.builder()
                .baseUrl(api)
                .build();
    }
}
