package tv.hasanabi.backend.controllers;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;
import tv.hasanabi.backend.api.twitch.Profile;
import tv.hasanabi.backend.nosql.objects.twitch.Active;
import tv.hasanabi.backend.nosql.repos.twitch.RepoActive;

@RestController()
@RequestMapping("twitch")
@CrossOrigin(origins = {"http://localhost:3000", "https://localhost", "https://hasanabi.tv"})
public class TwitchController {
    private final WebClient webClient;
    private final RepoActive repoActive;

    TwitchController(@Qualifier("twitch") WebClient webClient, RepoActive repoActive) {
        this.webClient = webClient;
        this.repoActive = repoActive;
    }

    @GetMapping("status")
    private ResponseEntity<Active> IsActive() {
        return ResponseEntity.ok(repoActive.getFirstByOrderByTimestampDesc());
    }

    @GetMapping("profile")
    private ResponseEntity<Profile> Profile() {
        return webClient.get().uri("profile").retrieve().toEntity(Profile.class).block();
    }
}
