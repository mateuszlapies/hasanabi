package tv.hasanabi.twitch.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import tv.hasanabi.twitch.nosql.objects.Active;
import tv.hasanabi.twitch.nosql.repos.RepoActive;

@RestController
public class TwitchController {
    private final RepoActive repoActive;

    public TwitchController(RepoActive repoActive) {
        this.repoActive = repoActive;
    }

    @GetMapping
    public ResponseEntity<Active> IsActive() {
        return ResponseEntity.ok(repoActive.getFirstByOrderByTimestamp());
    }
}
