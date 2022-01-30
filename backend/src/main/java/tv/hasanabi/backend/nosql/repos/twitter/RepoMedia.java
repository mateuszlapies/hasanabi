package tv.hasanabi.backend.nosql.repos.twitter;

import org.springframework.data.mongodb.repository.MongoRepository;
import tv.hasanabi.backend.nosql.objects.twitter.Media;

public interface RepoMedia extends MongoRepository<Media, String> {

}
