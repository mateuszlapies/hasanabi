package tv.hasanabi.backend.api.twitch;

import org.springframework.data.annotation.Id;

public class TimeGraph {
    @Id
    public String date;
    public Double time;
}
