package tv.hasanabi.twitch.nosql.objects;

import org.springframework.data.annotation.Id;
import tv.hasanabi.twitch.api.objects.Stream;

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