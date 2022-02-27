package tv.hasanabi.backend.nosql.repos.twitter;

import org.springframework.data.mongodb.repository.MongoRepository;
import tv.hasanabi.backend.api.twitter.MediaContent;

public interface RepoMedia extends MongoRepository<MediaContent, String> {

}
