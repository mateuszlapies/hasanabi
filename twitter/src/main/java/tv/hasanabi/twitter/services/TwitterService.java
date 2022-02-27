package tv.hasanabi.twitter.services;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.aggregation.LimitOperation;
import org.springframework.data.mongodb.core.aggregation.SortOperation;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import tv.hasanabi.twitter.api.Data;
import tv.hasanabi.twitter.api.objects.Feed;
import tv.hasanabi.twitter.api.objects.User;
import tv.hasanabi.twitter.nosql.objects.Owned;
import tv.hasanabi.twitter.nosql.objects.Ratio;
import tv.hasanabi.twitter.nosql.objects.Tweet;
import tv.hasanabi.twitter.nosql.repos.RepoOwned;
import tv.hasanabi.twitter.nosql.repos.RepoRatio;
import tv.hasanabi.twitter.nosql.repos.RepoTweet;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.*;

@Service
public class TwitterService {
    private final User user;
    private final RepoTweet repoTweet;
    private final RepoRatio repoRatio;
    private final RepoOwned repoOwned;
    private final WebClient webClient;
    private final MongoTemplate mongoTemplate;
    private final DateTimeFormatter formatter;

    TwitterService(RepoTweet repoTweet, RepoRatio repoRatio, RepoOwned repoOwned, WebClient webClient, MongoTemplate mongoTemplate) {
        this.repoTweet = repoTweet;
        this.repoRatio = repoRatio;
        this.repoOwned = repoOwned;
        this.webClient = webClient;
        this.mongoTemplate = mongoTemplate;
        this.formatter = DateTimeFormatter
            .ofPattern("yyyy-MM-dd'T'HH:mm:ss'Z'")
            .withZone(ZoneId.of("UTC"));

        this.user = Objects.requireNonNull(webClient.get().uri("users/by/username/hasanthehun" +
                        "?user.fields=created_at,description,profile_image_url,url")
                .retrieve().bodyToMono(new ParameterizedTypeReference<Data<User>>() {
                }).block()).data;
    }

    @Scheduled(fixedRate = 30000)
    private void checkFeed() {
        Tweet tweet = repoTweet.findFirstByOrderByIdDesc();
        Data<Feed[]> feed = new Data<>();
        do {
            String next_token = "";
            String since_id = "";
            if(tweet != null)
                since_id = tweet.id != null ? String.format("&start_time=%s", formatter.format(tweet.created_at.toInstant())) : "";
            next_token = feed.meta != null ? String.format("&pagination_token=%s", feed.meta.next_token) : "";
            feed = webClient.get().uri(String.format("users/%s/tweets" +
                                    "?max_results=100" +
                                    "&exclude=replies,retweets" +
                                    "&tweet.fields=public_metrics,created_at,entities" +
                                    "&expansions=author_id,attachments.media_keys%s%s",
                    user.id, since_id, next_token))
                    .retrieve().bodyToMono(new ParameterizedTypeReference<Data<Feed[]>>() {}).block();
            if (feed != null && feed.data != null && feed.data.length > 0) {
                repoTweet.saveAll(Arrays.stream(feed.data).map(Tweet::new).collect(Collectors.toList()));
            }
        } while (feed != null && feed.meta.next_token != null);
    }

    private final Aggregation aggregation = newAggregation(sort(Sort.Direction.DESC, "created_at"), limit(10));

    @Scheduled(fixedRate = 600000, initialDelay = 60000)
    private void updateRatioed() {
        AggregationResults<Ratio> results = mongoTemplate.aggregate(aggregation, "ratio", Ratio.class);
        List<Ratio> ratios = results.getMappedResults();
        if(ratios.size() > 0) {
            List<String> ids = new ArrayList<>();
            ratios.forEach(e -> {
                if (!ids.contains(e.ratio_post.id))
                    ids.add(e.ratio_post.id);
                if (!ids.contains(e.original_post.id))
                    ids.add(e.original_post.id);
            });
            Hashtable<String, Feed> tweets = getTweets(ids);
            ratios.forEach((e -> {
                boolean changed = false;
                Feed rp = tweets.get(e.ratio_post.id);
                if (rp != null) {
                    e.ratio_post = rp;
                    changed = true;
                }
                Feed op = tweets.get(e.original_post.id);
                if (op != null) {
                    e.original_post = op;
                    changed = true;
                }
                if (changed)
                    repoRatio.save(e);
            }));
        }
    }

    @Scheduled(fixedRate = 600000, initialDelay = 120000)
    private void updateOwned() {
        AggregationResults<Owned> results = mongoTemplate.aggregate(aggregation, "owned", Owned.class);
        List<String> ids = results.getMappedResults().stream().map(e -> e.id).collect(Collectors.toList());
        if(ids.size() > 0)
            getTweets(ids).values().forEach(e -> repoOwned.save(new Owned(e)));
    }

    @Scheduled(fixedRate = 86400000, initialDelay = 5000)
    private void ratio() {
        List<Feed> feedList = new ArrayList<>();
        Data<List<Feed>> ratios = new Data<>();
        List<String> ratioIds = new ArrayList<>();
        do {
            String next_token = ratios.meta != null ? String.format("&next_token=%s", ratios.meta.next_token) : "";
            ratios = Objects.requireNonNull(webClient.get().uri(String.format("tweets/search/recent" +
                    "?query=ratio -ratio'd from:hasanthehun is:reply&tweet.fields=public_metrics,created_at" +
                    "&expansions=author_id&sort_order=relevancy&max_results=100&start_time=%s%s",
                    formatter.format(Instant.now().minusSeconds(86400)), next_token))
                .retrieve().bodyToMono(new ParameterizedTypeReference<Data<List<Feed>>>() {
            }).block());
            if(ratios.meta.result_count > 0) {
                feedList.addAll(ratios.data);
                ratios.data.forEach(i -> {
                    if (i.referenced_tweet != null && !ratioIds.contains(i.referenced_tweet)) {
                        ratioIds.add(i.referenced_tweet);
                    }
                });
            }
        } while(ratios.meta.next_token != null);
        if(ratioIds.size() > 0) {
            Hashtable<String, Feed> referenced = getTweets(ratioIds);
            for (Feed feed : feedList) {
                if (feed.referenced_tweet != null) {
                    repoRatio.save(new Ratio(feed, referenced.get(feed.referenced_tweet)));
                }
            }
        }
    }

    @Scheduled(fixedRate = 86400000, initialDelay = 10000)
    private void owned() {
        Data<List<Feed>> owning = new Data<>();
        do {
            String next_token = owning.meta != null ? String.format("&next_token=%s", owning.meta.next_token) : "";
            owning = Objects.requireNonNull(webClient.get().uri(String.format("tweets/search/recent" +
                    "?query=ratio -ratio'd ( to:hasanthehun OR @hasanthehun )&tweet.fields=public_metrics,created_at" +
                    "&expansions=author_id&sort_order=relevancy&max_results=100&start_time=%s%s",
                    formatter.format(Instant.now().minusMillis(86400000)), next_token))
                .retrieve().bodyToMono(new ParameterizedTypeReference<Data<List<Feed>>>() {
            }).block());
            owning.data.forEach(e -> repoOwned.save(new Owned(e)));
        } while(owning.meta.next_token != null);
    }

    private Hashtable<String, Feed> getTweets(List<String> ids) {
        Hashtable<String, Feed> tweets = new Hashtable<>();
        List<String> filtered = ids.stream().distinct().collect(Collectors.toList());
        StringBuilder ids_str = new StringBuilder();
        for(int i = 0; i < filtered.size(); i++) {
            if(i != 0 && i % 99 == 0) {
                ids_str.append(filtered.get(i));
                tweetsDetails(ids_str.toString()).forEach(e -> {
                    if(!tweets.containsKey(e.id)) {tweets.put(e.id, e);}
                });
                ids_str = new StringBuilder();
            } else {
                ids_str.append(filtered.get(i)).append(",");
            }
        }
        ids_str = new StringBuilder(ids_str.substring(0, ids_str.length() - 1));
        tweetsDetails(ids_str.toString()).forEach(e -> {
            if(!tweets.containsKey(e.id)) {tweets.put(e.id, e);}
        });
        return tweets;
    }

    private List<Feed> tweetsDetails(String ids) {
        return Objects.requireNonNull(webClient.get().uri(String.format(
                "tweets?ids=%s&user.fields=name,profile_image_url,verified&tweet.fields=public_metrics,created_at" +
                        "&expansions=attachments.poll_ids,attachments.media_keys", ids))
                .retrieve().bodyToMono(new ParameterizedTypeReference<Data<List<Feed>>>() {
                }).block()).data;
    }
}
