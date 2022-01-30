package tv.hasanabi.backend.nosql.objects.twitter;

import tv.hasanabi.backend.api.twitter.Feed;

import java.util.Date;

public class Tweet extends Feed {
    private Date created;

    public Date getCreated() {
        return created_at;
    }

    public Tweet() {}

    public Tweet(Feed feed) {
        super(feed);
    }
}
