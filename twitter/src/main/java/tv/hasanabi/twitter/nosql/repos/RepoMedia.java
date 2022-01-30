package tv.hasanabi.twitter.nosql.repos;

import org.springframework.data.mongodb.repository.MongoRepository;
import tv.hasanabi.twitter.nosql.objects.Media;

public interface RepoMedia extends MongoRepository<Media, String> {

}
