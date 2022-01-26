package tv.hasanabi.twitch.config;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.ResponseEntity;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Instant;
import java.util.Date;

@Setter
@Configuration
@ConfigurationProperties(prefix = "twitch.api")
public class TwitchConfig {
    private String clientId;
    private String clientSecret;
    private String authorizationGrantType;
    private String scope;
    private String tokenUri;

    @Getter(AccessLevel.NONE)
    @Setter(AccessLevel.NONE)
    private TwitchToken token;

    @Bean
    WebClient twitchWebClient() {
        if(token == null || token.expiresOn.before(Date.from(Instant.now()))) {
            token = refreshToken().getBody();
        }
        return WebClient.builder()
                .baseUrl("https://api.twitch.tv/helix/")
                .defaultHeader("Client-Id", clientId)
                .defaultHeader("Authorization", String.format("Bearer %s", token.access_token))
                .build();
    }

    private ResponseEntity<TwitchToken> refreshToken() {
        return WebClient.builder()
                .build().post().uri(tokenUri + getVariables()).retrieve().toEntity(TwitchToken.class).block();
    }

    private String getVariables() {
        return String.format("?client_id=%s&client_secret=%s&grant_type=%s&scope=%s",
                clientId, clientSecret, authorizationGrantType, scope);
    }
}
