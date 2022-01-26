package tv.hasanabi.twitch.nosql.repos;

import org.springframework.data.mongodb.repository.MongoRepository;
import tv.hasanabi.twitch.nosql.objects.Active;

public interface RepoActive extends MongoRepository<Active, String> {
    Active getFirstByOrderByTimestamp();
}