package tv.hasanabi.twitter.nosql.repos;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.repository.MongoRepository;
import tv.hasanabi.twitter.nosql.objects.Ratio;

@Document(collection = "ratioed")
public interface RepoRatio extends MongoRepository<Ratio, String> {

}
