package tv.hasanabi.backend.nosql.objects.twitter;

import org.springframework.data.annotation.Id;
import tv.hasanabi.backend.api.twitter.Feed;

public class Ratio {
    @Id
    public String id;
    public Feed ratio_post;
    public Feed original_post;

    public Ratio() {}
}
