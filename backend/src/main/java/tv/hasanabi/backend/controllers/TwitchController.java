package tv.hasanabi.backend.controllers;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import tv.hasanabi.backend.api.twitch.*;
import tv.hasanabi.backend.nosql.objects.twitch.Active;
import tv.hasanabi.backend.nosql.repos.twitch.RepoActive;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
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

    @GetMapping("brush")
    private ResponseEntity<Brush> Brush() {
        MatchOperation filter = match(new Criteria("type").ne(null));
        GroupOperation group = group("title")
                .min("timestamp").as("timestamp")
                .max("viewer_count").as("viewers");
        SortOperation sort = sort(Sort.Direction.ASC, "timestamp");
        Aggregation aggregation = newAggregation(filter, group, sort);
        AggregationResults<ViewsGraphBrush> result = mongoTemplate.aggregate(aggregation, "active", ViewsGraphBrush.class);
        return ResponseEntity.ok(new Brush(result.getMappedResults()));
    }

    @GetMapping("viewsgraph")
    private ResponseEntity<List<ViewsGraph>> getViewsGraph(@RequestParam(required = false, defaultValue = "0") long after, @RequestParam(required = false, defaultValue = "0") long before) {
        MatchOperation firstFilter = match(Criteria.where("type").ne(null));
        MatchOperation dateFilter = after > 0 && before > 0 ? match(Criteria.where("timestamp").gte(new Date(after)).andOperator(Criteria.where("timestamp").lte(new Date(before)))) : match(new Criteria());
        GroupOperation firstGroup = group("title")
                .max("timestamp").as("timestamp_max")
                .min("timestamp").as("timestamp_min")
                .max("viewer_count").as("viewer_count_max")
                .avg("viewer_count").as("viewer_count_avg")
                .min("viewer_count").as("viewer_count_min");
        SortOperation firstSort = sort(Sort.Direction.ASC, "timestamp_min");
        Aggregation firstAggregation = newAggregation(firstFilter, dateFilter, firstGroup, firstSort);
        AggregationResults<ViewsGraph> firstResult =
                mongoTemplate.aggregate(firstAggregation, "active", ViewsGraph.class);
        firstResult.getMappedResults().forEach(e -> {
            MatchOperation secondFilter = match(new Criteria("title").is(e.title));
            GroupOperation secondGroup = group("viewer_count")
                    .first("viewer_count").as("value").count().as("count");
            SortOperation secondSort = sort(Sort.Direction.DESC, "value");
            Aggregation secondAggregation = newAggregation(secondFilter, dateFilter, secondGroup, secondSort);
            AggregationResults<ViewsGraphCounter> secondResult =
                    mongoTemplate.aggregate(secondAggregation, "active", ViewsGraphCounter.class);
            e.vp_data = secondResult.getMappedResults();
        });
        return ResponseEntity.ok(firstResult.getMappedResults());
    }

    @GetMapping("timegraph")
    private ResponseEntity<List<TimeGraph>> getTimeGraph() {
        MatchOperation filter = match(Criteria.where("type").ne(null)
                .andOperator(Criteria.where("timestamp").gte(Instant.now().minus(7, ChronoUnit.DAYS).truncatedTo(ChronoUnit.DAYS))));
        ProjectionOperation project = project()
                .andExpression("dateToString('%Y-%m-%d', timestamp)").as("date");
        GroupOperation group = group("date").count().as("data");
        ProjectionOperation time = project()
                .andExpression("_id").as("date")
                .andExpression("data * 10 / 3600").as("time");
        SortOperation sort = sort(Sort.Direction.ASC, "date");
        Aggregation aggregation = newAggregation(filter, project, group, time, sort);
        return ResponseEntity.ok(mongoTemplate.aggregate(aggregation, "active", TimeGraph.class).getMappedResults());
    }

    @GetMapping("profile")
    private ResponseEntity<Profile> Profile() {
        return webClient.get().uri("profile").retrieve().toEntity(Profile.class).block();
    }
}
