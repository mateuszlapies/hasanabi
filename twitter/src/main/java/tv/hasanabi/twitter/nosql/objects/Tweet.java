package tv.hasanabi.twitter.nosql.objects;

import org.springframework.data.annotation.Transient;
import tv.hasanabi.twitter.api.objects.Feed;

import java.util.Date;

public class Tweet extends Feed {
    @Transient
    private Date created;

    public Date getCreated() {
        return created_at;
    }

    public Tweet() {}

    public Tweet(Feed feed) {
        super(feed);
    }
}
