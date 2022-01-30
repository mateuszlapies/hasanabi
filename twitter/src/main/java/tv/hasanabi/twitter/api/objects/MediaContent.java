package tv.hasanabi.twitter.api.objects;

import org.springframework.data.annotation.Id;

public class MediaContent {
    @Id
    public String media_key;
    public String type;
    public String url;
    public String preview_image_url;
    public String alt_text;

    public MediaContent() {}

    public MediaContent(MediaContent mediaContent) {
        this.media_key = mediaContent.media_key;
        this.type = mediaContent.type;
        this.url = mediaContent.url;
        this.preview_image_url = mediaContent.preview_image_url;
        this.alt_text = mediaContent.alt_text;
    }
}
