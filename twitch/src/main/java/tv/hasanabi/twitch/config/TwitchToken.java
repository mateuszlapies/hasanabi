package tv.hasanabi.twitch.config;

import java.time.Instant;
import java.util.Date;

public class TwitchToken {
    public String access_token;
    public String[] scope;
    public String token_type;
    public Date expiresOn;


    public void setExpires_in(int expires_in) {
        this.expiresOn = Date.from(Instant.now().plusMillis(expires_in));
    }
}
