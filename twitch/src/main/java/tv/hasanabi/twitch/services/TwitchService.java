package tv.hasanabi.twitch.services;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Objects;

import tv.hasanabi.twitch.nosql.objects.Active;
import tv.hasanabi.twitch.nosql.repos.RepoActive;
import tv.hasanabi.twitch.api.Data;
import tv.hasanabi.twitch.api.objects.Profile;
import tv.hasanabi.twitch.api.objects.Stream;

@Service
public class TwitchService {
    private final WebClient webClient;
    private final Profile hasanProfile;
    private final RepoActive repoActive;

    TwitchService(WebClient webClient, RepoActive repoActive) {
        this.webClient = webClient;
        this.hasanProfile = Objects.requireNonNull(webClient.get()
                .uri("users?login=hasanabi")
                .retrieve().bodyToMono(new ParameterizedTypeReference<Data<Profile>>() {
                }).block()).getElement();
        this.repoActive = repoActive;
    }

    @Scheduled(fixedRate = 10000)
    private void updateHasanStatus() {
        Stream stream = Objects.requireNonNull(webClient.get()
                .uri("streams?user_id=" + hasanProfile.id)
                .retrieve().bodyToMono(new ParameterizedTypeReference<Data<Stream>>() {
                }).block()).getElement();
        repoActive.save(new Active(stream));
    }
}