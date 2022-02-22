package tv.hasanabi.backend.controllers;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import tv.hasanabi.backend.api.twitch.Profile;
import tv.hasanabi.backend.nosql.objects.twitch.Active;
import tv.hasanabi.backend.nosql.objects.twitch.ActiveGrouped;
import tv.hasanabi.backend.nosql.objects.twitch.ActiveGroupedCounter;
import tv.hasanabi.backend.nosql.repos.twitch.RepoActive;

import java.util.List;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.*;

@RestController()
@RequestMapping("twitch")
@CrossOrigin(origins = {"http://localhost:3000", "https://localhost", "https://hasanabi.tv"})
public class TwitchController {
    private final WebClient webClient;
    private final RepoActive repoActive;
    private final MongoTemplate mongoTemplate;

    TwitchController(@Qualifier("twitch") WebClient webClient, RepoActive repoActive, MongoTemplate mongoTemplate) {
        this.webClient = webClient;
        this.repoActive = repoActive;
        this.mongoTemplate = mongoTemplate;
    }

    @GetMapping("status")
    private ResponseEntity<Active> IsActive() {
        return ResponseEntity.ok(repoActive.getFirstByOrderByTimestampDesc());
    }

    @GetMapping("timeline")
    private ResponseEntity<List<ActiveGrouped>> Timeline() {
        MatchOperation firstFilter = match(new Criteria("type").ne(null));
        GroupOperation firstGroup = group("title")
                .max("timestamp").as("timestamp_max")
                .min("timestamp").as("timestamp_min")
                .max("viewer_count").as("viewer_count_max")
                .avg("viewer_count").as("viewer_count_avg")
                .min("viewer_count").as("viewer_count_min");
        SortOperation firstSort = sort(Sort.Direction.ASC, "timestamp_min");
        Aggregation firstAggregation = newAggregation(firstFilter, firstGroup, firstSort);
        AggregationResults<ActiveGrouped> firstResult =
                mongoTemplate.aggregate(firstAggregation, "active", ActiveGrouped.class);
        firstResult.getMappedResults().forEach(e -> {
            MatchOperation secondFilter = match(new Criteria("title").is(e.title));
            GroupOperation secondGroup = group("viewer_count")
                    .first("viewer_count").as("value").count().as("count");
            SortOperation secondSort = sort(Sort.Direction.DESC, "value");
            Aggregation secondAggregation = newAggregation(secondFilter, secondGroup, secondSort);
            AggregationResults<ActiveGroupedCounter> secondResult =
                    mongoTemplate.aggregate(secondAggregation, "active", ActiveGroupedCounter.class);
            e.vp_data = secondResult.getMappedResults();
        });
        return ResponseEntity.ok(firstResult.getMappedResults());
    }

    @GetMapping("profile")
    private ResponseEntity<Profile> Profile() {
        return webClient.get().uri("profile").retrieve().toEntity(Profile.class).block();
    }
}
