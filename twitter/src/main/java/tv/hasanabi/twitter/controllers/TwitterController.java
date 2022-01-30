package tv.hasanabi.twitter.controllers;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;
import tv.hasanabi.twitter.api.Data;
import tv.hasanabi.twitter.api.objects.Feed;
import tv.hasanabi.twitter.api.objects.MediaContent;
import tv.hasanabi.twitter.api.objects.User;
import tv.hasanabi.twitter.nosql.objects.Media;
import tv.hasanabi.twitter.nosql.objects.Profile;
import tv.hasanabi.twitter.nosql.repos.RepoMedia;
import tv.hasanabi.twitter.nosql.repos.RepoProfile;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@RestController
public class TwitterController {
    private final WebClient webClient;
    private final RepoMedia repoMedia;
    private final RepoProfile repoProfile;

    TwitterController(WebClient webClient, RepoMedia repoMedia, RepoProfile repoProfile) {
        this.webClient = webClient;
        this.repoMedia = repoMedia;
        this.repoProfile = repoProfile;
    }

    @GetMapping("profile/{id}")
    public ResponseEntity<Profile> getProfile(@PathVariable String id) {
        Profile profile = new Profile(Objects.requireNonNull(webClient.get().uri(String.format("users/%s?user.fields=profile_image_url,url", id))
                .retrieve().bodyToMono(new ParameterizedTypeReference<Data<User>>() {
                }).block()).data);
        repoProfile.save(profile);
        return ResponseEntity.ok(profile);
    }

    @GetMapping("media")
    public ResponseEntity<List<Media>> getMedia(@RequestParam String id) {
        Data<Feed> data = Objects.requireNonNull(webClient.get().uri(
                        String.format("tweets/%s?expansions=attachments.media_keys" +
                                "&media.fields=media_key,type,url,preview_image_url,alt_text", String.join(",", id)))
                .retrieve().bodyToMono(new ParameterizedTypeReference<Data<Feed>>() {
                }).block());
        List<Media> mediaList = new ArrayList<>();
        for(MediaContent m : data.includes.media)
            mediaList.add(new Media(m));
        repoMedia.saveAll(mediaList);
        return ResponseEntity.ok(mediaList);
    }
}
