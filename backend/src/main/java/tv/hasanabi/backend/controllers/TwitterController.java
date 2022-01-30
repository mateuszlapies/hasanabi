package tv.hasanabi.backend.controllers;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import tv.hasanabi.backend.nosql.objects.twitter.Media;
import tv.hasanabi.backend.nosql.objects.twitter.Profile;
import tv.hasanabi.backend.nosql.objects.twitter.Ratio;
import tv.hasanabi.backend.nosql.objects.twitter.Tweet;
import tv.hasanabi.backend.nosql.repos.twitter.RepoMedia;
import tv.hasanabi.backend.nosql.repos.twitter.RepoProfile;
import tv.hasanabi.backend.nosql.repos.twitter.RepoRatio;
import tv.hasanabi.backend.nosql.repos.twitter.RepoTweet;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@RestController()
@RequestMapping("twitter")
@CrossOrigin(origins = {"http://localhost:3000", "https://hasanabi.tv"})
public class TwitterController {
    private final WebClient webClient;
    private final RepoRatio repoRatio;
    private final RepoTweet repoTweet;
    private final RepoMedia repoMedia;
    private final RepoProfile repoProfile;

    TwitterController(@Qualifier("twitter") WebClient webClient, RepoRatio repoRatio, RepoTweet repoTweet, RepoMedia repoMedia, RepoProfile repoProfile) {
        this.webClient = webClient;
        this.repoRatio = repoRatio;
        this.repoTweet = repoTweet;
        this.repoMedia = repoMedia;
        this.repoProfile = repoProfile;
    }

    @GetMapping("ratios")
    public ResponseEntity<List<Ratio>> getRatios() {
        return ResponseEntity.ok(repoRatio.findAll());
    }

    @GetMapping("tweets")
    public ResponseEntity<List<Tweet>> getTweets() {
        return ResponseEntity.ok(repoTweet.findAll());
    }

    @GetMapping("latest")
    public ResponseEntity<Tweet> getLatest() {
        return ResponseEntity.ok(repoTweet.findFirstByOrderByCreatedDesc());
    }

    @GetMapping("profile/{id}")
    public ResponseEntity<Profile> getProfile(@PathVariable String id) {
        Optional<Profile> profile = repoProfile.findById(id);
        return profile.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.ok(webClient.get().uri("profile/" + id)
                .retrieve().bodyToMono(new ParameterizedTypeReference<Profile>() {
                }).block()));
    }

    @GetMapping("media")
    public ResponseEntity<List<Media>> getMedia(@RequestParam String id, @RequestParam String[] ids) {
        List<Media> mediaList = (List<Media>) repoMedia.findAllById(Arrays.asList(ids));
        if(mediaList.size() == 0) {
            mediaList = webClient.get().uri("media?id=" + id)
                    .retrieve().bodyToMono(new ParameterizedTypeReference<List<Media>>() {}).block();
        }
        return ResponseEntity.ok(mediaList);
    }
}
