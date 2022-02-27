package tv.hasanabi.backend.api.twitch;

import org.springframework.data.annotation.Id;

import java.util.Date;
import java.util.List;

public class ViewsGraph {
    @Id
    public String title;
    public List<ViewsGraphCounter> vp_data;
    public Date timestamp_min;
    public Date timestamp_max;
    public int viewer_count_min;
    public int viewer_count_avg;
    public int viewer_count_max;
}