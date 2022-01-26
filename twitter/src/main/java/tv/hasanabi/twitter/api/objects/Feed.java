package tv.hasanabi.twitter.api.objects;

import java.util.Arrays;
import java.util.Date;

public class Feed {
    public String id;
    public String text;
    public Date created_at;
    public Attachment attachments;
    public Public public_metrics;
    public String referenced_tweet;
    private Reference[] referenced_tweets;

    public Feed() {}

    public Feed(Feed feed) {
        this.id = feed.id;
        this.text = feed.text;
        this.created_at = feed.created_at;
        this.attachments = feed.attachments;
        this.public_metrics = feed.public_metrics;
        if(feed.referenced_tweets != null) {
            this.referenced_tweet = feed.referenced_tweet;
            setReferenced_tweets(feed.referenced_tweets);
        }
    }

    public void setReferenced_tweets(Reference[] referenced_tweets) {
        this.referenced_tweets = Arrays.stream(referenced_tweets).filter(item -> item.type.equals("replied_to")).toArray(Reference[]::new);
        this.referenced_tweet = Arrays.stream(this.referenced_tweets).findFirst().orElse(new Reference()).id;
    }
}