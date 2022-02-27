package tv.hasanabi.backend.api.twitch;

import java.util.List;

public class Brush {
    public List<ViewsGraphBrush> brush;
    public Scope scope;

    public Brush() {}

    public Brush(List<ViewsGraphBrush> brush) {
        this.brush = brush;
        this.scope = new Scope(brush.get(brush.size() - 7).timestamp.getTime(), brush.get(brush.size() - 1).timestamp.getTime());
    }
}
