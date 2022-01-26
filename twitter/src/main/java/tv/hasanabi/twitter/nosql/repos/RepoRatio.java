package tv.hasanabi.twitter.nosql.repos;

import org.springframework.data.mongodb.repository.MongoRepository;
import tv.hasanabi.twitter.nosql.objects.Ratio;

public interface RepoRatio extends MongoRepository<Ratio, String> {

}
