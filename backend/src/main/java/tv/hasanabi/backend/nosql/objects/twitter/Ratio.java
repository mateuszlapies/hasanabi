package tv.hasanabi.backend.nosql.objects.twitter;

import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.data.annotation.Id;
import tv.hasanabi.backend.api.twitter.Feed;

import java.util.Objects;

public class Ratio {
    @Id
    public String id;
    public Feed ratio_post;
    public Feed original_post;

    public Ratio() {}

    public Ratio(Feed ratio_post, Feed original_post) {
        this.ratio_post = ratio_post;
        setOriginal_post(original_post);
    }

    public void setOriginal_post(Feed original_post) {
        this.original_post = original_post;
        if(Objects.equals(id, "")) {
            this.id = DigestUtils.sha256Hex(ratio_post.id + original_post.id);
        }
    }
}
