package tv.hasanabi.twitch.api;

import java.util.List;

public class Data<T> {
    public List<T> data;

    public T getElement() {
        return data.stream().findFirst().orElse(null);
    }
}