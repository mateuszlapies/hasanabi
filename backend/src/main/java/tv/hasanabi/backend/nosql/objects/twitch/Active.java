package tv.hasanabi.backend.nosql.objects.twitch;

import org.springframework.data.annotation.Id;
import tv.hasanabi.backend.api.twitch.Stream;

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