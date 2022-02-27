package tv.hasanabi.twitter.nosql.objects;

import tv.hasanabi.twitter.api.objects.Feed;

public class Owned extends Feed {
    public Owned() {}

    public Owned(Feed feed) {
        this.id = feed.id;
        this.text = feed.text;
        this.entities = feed.entities;
        this.author_id = feed.author_id;
        this.created_at = feed.created_at;
        this.attachments = feed.attachments;
        this.public_metrics = feed.public_metrics;
        this.referenced_tweet = feed.referenced_tweet;
    }
}
