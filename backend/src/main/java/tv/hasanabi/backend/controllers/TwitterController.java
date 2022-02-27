package tv.hasanabi.backend.controllers;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import tv.hasanabi.backend.api.twitter.*;
import tv.hasanabi.backend.nosql.objects.twitter.*;
import tv.hasanabi.backend.nosql.repos.twitter.*;

import java.util.*;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.*;

@RestController()
@RequestMapping("twitter")
@CrossOrigin(origins = {"http://localhost:3000", "https://localhost", "https://hasanabi.tv"})
public class TwitterController {
    private final WebClient webClient;
    private final RepoRatio repoRatio;
    private final RepoOwned repoOwned;
    private final RepoTweet repoTweet;
    private final RepoMedia repoMedia;
    private final RepoProfile repoProfile;
    private final MongoTemplate mongoTemplate;

    TwitterController(@Qualifier("twitter") WebClient webClient, RepoRatio repoRatio, RepoOwned repoOwned,
                      RepoTweet repoTweet, RepoMedia repoMedia, RepoProfile repoProfile, MongoTemplate mongoTemplate) {
        this.webClient = webClient;
        this.repoRatio = repoRatio;
        this.repoOwned = repoOwned;
        this.repoTweet = repoTweet;
        this.repoMedia = repoMedia;
        this.repoProfile = repoProfile;
        this.mongoTemplate = mongoTemplate;
    }

    @GetMapping("tweets")
    public ResponseEntity<Page<Tweet>> getTweets(@RequestParam Integer page) {
        Pageable pageable = PageRequest.of(page, 10);
        return ResponseEntity.ok(repoTweet.findAll(pageable));
    }

    @GetMapping("ratios")
    public ResponseEntity<Page<Ratio>> getRatios(@RequestParam Integer page) {
        Pageable pageable = PageRequest.of(page, 10);
        return ResponseEntity.ok(repoRatio.findAll(pageable));
    }

    @GetMapping("ownes")
    public ResponseEntity<Page<Owned>> getOwnes(@RequestParam Integer page) {
        Pageable pageable = PageRequest.of(page, 10);
        return ResponseEntity.ok(repoOwned.findAll(pageable));
    }

    @GetMapping("latest")
    public ResponseEntity<Tweet> getLatest() {
        return ResponseEntity.ok(repoTweet.findFirstByOrderByIdDesc());
    }

    private final Aggregation aggregation = newAggregation(sort(Sort.Direction.DESC, "created_at"), limit(10));

    @GetMapping("ratio")
    public ResponseEntity<List<Ratio>> getRatio() {
        return ResponseEntity.ok(mongoTemplate.aggregate(aggregation, "ratio", Ratio.class).getMappedResults());
    }

    @GetMapping("owned")
    public ResponseEntity<List<Owned>> getOwned() {
        return ResponseEntity.ok(mongoTemplate.aggregate(aggregation, "owned", Owned.class).getMappedResults());
    }

    @GetMapping("profile/{id}")
    public ResponseEntity<Profile> getProfile(@PathVariable String id) {
        Optional<Profile> optional = repoProfile.findById(id);
        if(optional.isEmpty()) {
            Profile profile = new Profile(Objects.requireNonNull(webClient.get().uri(String.format("users/%s?user.fields=profile_image_url,url", id))
                    .retrieve().bodyToMono(new ParameterizedTypeReference<Data<User>>() {
                    }).block()).data);
            repoProfile.save(profile);
            optional = Optional.of(profile);
        }
        return ResponseEntity.ok(optional.get());
    }

    @GetMapping("media")
    public ResponseEntity<List<Media>> getMedia(@RequestParam String id, @RequestParam String[] ids) {
        Iterable<MediaContent> mediaList = repoMedia.findAllById(Arrays.asList(ids));
        if(mediaList.iterator() == 0) {
            Data<Feed> data = Objects.requireNonNull(webClient.get().uri(
                            String.format("tweets/%s?expansions=attachments.media_keys" +
                                    "&media.fields=media_key,type,url,preview_image_url,alt_text", String.join(",", id)))
                    .retrieve().bodyToMono(new ParameterizedTypeReference<Data<Feed>>() {
                    }).block());
            for(MediaContent m : data.includes.media)
                mediaList.add(new Media(m));
            repoMedia.saveAll(mediaList);
        }
        return ResponseEntity.ok(mediaList);
    }
}
