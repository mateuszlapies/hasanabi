package tv.hasanabi.twitch.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import tv.hasanabi.twitch.api.objects.Profile;
import tv.hasanabi.twitch.services.TwitchService;

@RestController
public class TwitchController {
    @GetMapping("profile")
    public ResponseEntity<Profile> getProfile() {
        return ResponseEntity.ok(TwitchService.hasanProfile);
    }
}
