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
import tv.hasanabi.twitter.nosql.repos.RepoRatio;
import tv.hasanabi.twitter.nosql.repos.RepoTweet;

import java.util.*;

@Service
public class TwitterService {
    private final User user;
    private final RepoTweet repoTweet;
    private final RepoRatio repoRatio;
    private final WebClient webClient;

    TwitterService(RepoTweet repoTweet, RepoRatio repoRatio, WebClient webClient) {
        this.repoTweet = repoTweet;
        this.repoRatio = repoRatio;
        this.webClient = webClient;
        this.user = Objects.requireNonNull(webClient.get().uri("users/by/username/hasanthehun?user.fields=created_at,description,profile_image_url,url")
                .retrieve().bodyToMono(new ParameterizedTypeReference<Data<User>>() {
                }).block()).data;
    }

    @Scheduled(fixedRate = 10000)
    private void checkFeed() {
        Tweet tweet = repoTweet.findFirstByOrderByCreatedDesc();
        Data<Feed[]> feed = webClient.get().uri(String.format("users/%s/tweets?since_id=%s&exclude=replies,retweets&tweet.fields=public_metrics,created_at&expansions=attachments.poll_ids,attachments.media_keys",
                        user.id, tweet.id))
                .retrieve().bodyToMono(new ParameterizedTypeReference<Data<Feed[]>>() {}).block();
        if(feed != null && feed.data != null && feed.data.length > 0) {
            for (Feed f : feed.data) {
                repoTweet.save(new Tweet(f));
            }
        }
    }

    @Scheduled(fixedRate = 86400000)
    private void ratio() {
        List<Feed> feedList = new ArrayList<>();
        Data<List<Feed>> ratios = new Data<>();
        do {
            String next_token = ratios.meta != null ? String.format("&next_token=%s", ratios.meta.next_token) : "";
            ratios = Objects.requireNonNull(webClient.get().uri("tweets/search/recent?query=ratio (from:hasanthehun OR to:hasanthehun)&tweet.fields=public_metrics,created_at,referenced_tweets" + next_token)
                    .retrieve().bodyToMono(new ParameterizedTypeReference<Data<List<Feed>>>() {
                    }).block());
            feedList.addAll(ratios.data);
        } while(ratios.meta.next_token != null);
        Hashtable<String, Feed> referenced = new Hashtable<>();
        for(Feed feed : feedList) {
            if(feed.referenced_tweet != null && !referenced.containsKey(feed.referenced_tweet))
                referenced.put(feed.referenced_tweet, new Feed());
        }
        Feed[] references = tweetsDetails(String.join(",", referenced.keySet()));
        for(Feed feed : references) {
            referenced.put(feed.id, feed);
        }
        for(Feed f : feedList) {
            if(f.referenced_tweet != null && referenced.containsKey(f.referenced_tweet) && referenced.get(f.referenced_tweet).public_metrics != null) {
                float ratio = f.public_metrics.like_count / referenced.get(f.referenced_tweet).public_metrics.like_count;
                float reversed_ratio = 1 / ratio;
                if (ratio >= 0.25f || reversed_ratio >= 0.25f && !Float.isInfinite(ratio) && !Float.isInfinite(reversed_ratio))
                    repoRatio.save(new Ratio(f, referenced.get(f.referenced_tweet)));
            }
        }
    }

    private Feed tweetDetails(String id) {
        return Objects.requireNonNull(webClient.get().uri(String.format("tweets/%s?tweet.fields=public_metrics,created_at&expansions=attachments.poll_ids,attachments.media_keys", id))
                .retrieve().bodyToMono(new ParameterizedTypeReference<Data<Feed>>() {
                }).block()).data;
    }

    private Feed[] tweetsDetails(String ids) {
        return Objects.requireNonNull(webClient.get().uri(String.format("tweets?ids=%s&tweet.fields=public_metrics,created_at&expansions=attachments.poll_ids,attachments.media_keys", ids))
                .retrieve().bodyToMono(new ParameterizedTypeReference<Data<Feed[]>>() {
                }).block()).data;
    }
}
