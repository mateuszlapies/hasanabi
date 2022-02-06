package tv.hasanabi.twitter.nosql.objects;

import tv.hasanabi.twitter.api.objects.Feed;

import java.util.Date;

public class Tweet extends Feed {

    public Tweet() {}

    public Tweet(Feed feed) {
        super(feed);
    }
}
