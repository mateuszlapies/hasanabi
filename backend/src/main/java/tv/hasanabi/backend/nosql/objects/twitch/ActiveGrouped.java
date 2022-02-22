package tv.hasanabi.backend.nosql.objects.twitch;

import org.springframework.data.annotation.Id;

import java.util.Date;
import java.util.List;

public class ActiveGrouped {
    @Id
    public String title;
    public List<ActiveGroupedCounter> vp_data;
    public Date timestamp_min;
    public Date timestamp_max;
    public int viewer_count_min;
    public int viewer_count_avg;
    public int viewer_count_max;
}