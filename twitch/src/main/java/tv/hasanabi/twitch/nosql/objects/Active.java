package tv.hasanabi.twitch.nosql.objects;

import tv.hasanabi.twitch.api.objects.Stream;

import javax.persistence.Id;
import java.time.Instant;
import java.util.Date;

public class Active extends Stream {
    @Id
    public String activity_id;
    public Date timestamp;

    public Active() {
    }

    public Active(Stream stream) {
        super(stream);
        this.timestamp = Date.from(Instant.now());
    }
}