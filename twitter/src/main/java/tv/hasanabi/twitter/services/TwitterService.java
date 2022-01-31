package tv.hasanabi.twitter.services;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import tv.hasanabi.twitter.api.Data;
import tv.hasanabi.twitter.api.objects.Feed;
import tv.hasanabi.twitter.api.objects.User;
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

@Service
public class TwitterService {
    private final User user;
    private final RepoTweet repoTweet;
    private final RepoRatio repoRatio;
    private final RepoOwned repoOwned;
    private final WebClient webClient;
    private final DateTimeFormatter formatter;

    TwitterService(RepoTweet repoTweet, RepoRatio repoRatio, RepoOwned repoOwned, WebClient webClient) {
        this.repoTweet = repoTweet;
        this.repoRatio = repoRatio;
        this.repoOwned = repoOwned;
        this.webClient = webClient;

        formatter = DateTimeFormatter
            .ofPattern("yyyy-MM-dd'T'HH:mm:ss'Z'")
            .withZone(ZoneId.of("UTC"));

        this.user = Objects.requireNonNull(webClient.get().uri("users/by/username/hasanthehun?user.fields=created_at,description,profile_image_url,url")
                .retrieve().bodyToMono(new ParameterizedTypeReference<Data<User>>() {
                }).block()).data;
    }

    @Scheduled(fixedRate = 30000)
    private void checkFeed() {
        Tweet tweet = repoTweet.findFirstByOrderByCreatedDesc();
        String query = "";
        if(tweet != null)
            query = String.format("&start_time=%s", formatter.format(tweet.created_at.toInstant().minusSeconds(60)));
        Data<Feed[]> feed = null;
        do {
            String next_token = "";
            if(feed != null)
                next_token = feed.meta != null ? String.format("&pagination_token=%s", feed.meta.next_token) : "";
            feed = webClient.get().uri(String.format("users/%s/tweets?exclude=replies,retweets&tweet.fields=public_metrics,created_at,entities&expansions=author_id,attachments.media_keys%s%s",
                    user.id, query, next_token))
                    .retrieve().bodyToMono(new ParameterizedTypeReference<Data<Feed[]>>() {
                    }).block();
            if (feed != null && feed.data != null && feed.data.length > 0) {
                for (Feed f : feed.data) {
                    repoTweet.save(new Tweet(f));
                }
            }
        } while (feed.meta.next_token != null);
    }

    @Scheduled(fixedRate = 86400000, initialDelay = 5000)
    private void ratio() throws InterruptedException {
        List<Feed> feedList = new ArrayList<>();
        Data<List<Feed>> ratios = new Data<>();
        List<String> ratioedIds = new ArrayList<>();
        do {
            String next_token = ratios.meta != null ? String.format("&next_token=%s", ratios.meta.next_token) : "";
            ratios = Objects.requireNonNull(webClient.get().uri(String.format("tweets/search/recent?query=ratio -ratio'd from:hasanthehun -to:hasanthehun is:reply" +
                            "&max_results=100&expansions=author_id&tweet.fields=public_metrics,created_at,referenced_tweets&start_time=%s%s", formatter.format(Instant.now().minusSeconds(86400)), next_token))
                    .retrieve().bodyToMono(new ParameterizedTypeReference<Data<List<Feed>>>() {
                    }).block());
            if(ratios.meta.result_count > 0) {
                feedList.addAll(ratios.data);
                ratios.data.forEach(i -> {
                    if (i.referenced_tweet != null && !ratioedIds.contains(i.referenced_tweet)) {
                        ratioedIds.add(i.referenced_tweet);
                    }
                });
            }
            Thread.sleep(1000);
        } while(ratios.meta.next_token != null);
        if(ratioedIds.size() > 0) {
            Hashtable<String, Feed> referenced = getTweets(ratioedIds);
            for (Feed feed : feedList) {
                if (feed.referenced_tweet != null) {
                    repoRatio.save(new Ratio(feed, referenced.get(feed.referenced_tweet)));
                }
            }
        }
    }

    //@Scheduled(fixedRate = 86400000, initialDelay = 10000)
    private void owned() throws InterruptedException {
        List<Feed> feedList = new ArrayList<>();
        Data<List<Feed>> owning = new Data<>();
        List<String> ownedIds = new ArrayList<>();
        do {
            String next_token = owning.meta != null ? String.format("&next_token=%s", owning.meta.next_token) : "";

            owning = Objects.requireNonNull(webClient.get().uri(String.format("tweets/search/recent?query=-ratio from:hasanthehun -to:hasanthehun is:reply" +
                            "&max_results=100&expansions=author_id&tweet.fields=public_metrics,created_at,referenced_tweets&start_time=%s%s", formatter.format(Instant.now().minusSeconds(86400)), next_token))
                    .retrieve().bodyToMono(new ParameterizedTypeReference<Data<List<Feed>>>() {
                    }).block());
            if(owning.meta.result_count > 0) {
                feedList.addAll(owning.data);
                owning.data.forEach(i -> {
                    if (i.referenced_tweet != null && !ownedIds.contains(i.referenced_tweet)) {
                        ownedIds.add(i.referenced_tweet);
                    }
                });
            }
            Thread.sleep(1000);
        } while(owning.meta.next_token != null);
        if(ownedIds.size() > 0) {
            Hashtable<String, Feed> referenced = getTweets(ownedIds);
            for (Feed feed : feedList) {
                if (feed.referenced_tweet != null) {
                    repoOwned.save(new Ratio(feed, referenced.get(feed.referenced_tweet)));
                }
            }
        }
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
