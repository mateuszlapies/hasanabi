package tv.hasanabi.backend.api.twitter;

import org.springframework.data.annotation.Id;

import java.util.Date;

public class User {
    @Id
    public String id;
    public String url;
    public String name;
    public String username;
    public String description;
    public String profile_image_url;
    public Date created_at;

    public User() {}

    public User(User user) {
        this.id = user.id;
        this.url = user.url;
        this.name = user.name;
        this.username = user.username;
        this.description = user.description;
        this.profile_image_url = user.profile_image_url;
        this.created_at = user.created_at;
    }
}
