package tv.hasanabi.twitch.api.objects;

import org.springframework.data.mongodb.core.mapping.Field;

import java.util.Date;

public class Stream {
    @Field(name = "stream_id")
    public String id;
    public String user_id;
    public String user_login;
    public String user_name;
    public String game_id;
    public String game_name;
    public String type;
    public String title;
    public int viewer_count;
    public Date started_at;
    public String language;
    public String thumbnail_url;
    public String[] tag_ids;
    public boolean is_mature;

    public Stream() {}

    public Stream(Stream stream) {
        if(stream != null) {
            this.id = stream.id;
            this.user_id = stream.user_id;
            this.user_login = stream.user_login;
            this.user_name = stream.user_name;
            this.game_id = stream.game_id;
            this.game_name = stream.game_name;
            this.type = stream.type;
            this.title = stream.title;
            this.viewer_count = stream.viewer_count;
            this.started_at = stream.started_at;
            this.language = stream.language;
            this.thumbnail_url = stream.thumbnail_url;
            this.tag_ids = stream.tag_ids;
            this.is_mature = stream.is_mature;
        }
    }
}