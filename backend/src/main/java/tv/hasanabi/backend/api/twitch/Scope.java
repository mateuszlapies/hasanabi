package tv.hasanabi.backend.api.twitch;

public class Scope {
    public long after;
    public long before;

    public Scope() {}

    public Scope(long after, long before) {
        this.after = after;
        this.before = before;
    }
}