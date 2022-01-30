package tv.hasanabi.backend.config;

import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Setter
@Configuration
@ConfigurationProperties(prefix = "twitch")
public class TwitchConfig {
    private String api;

    @Bean("twitch")
    WebClient twitchWebClient() {
        return WebClient.builder()
                .baseUrl(api)
                .build();
    }
}
