package tv.hasanabi.backend.nosql.repos.twitch;

import org.springframework.data.mongodb.repository.MongoRepository;
import tv.hasanabi.backend.nosql.objects.twitch.Active;

public interface RepoActive extends MongoRepository<Active, String> {
    Active getFirstByOrderByTimestampDesc();
}