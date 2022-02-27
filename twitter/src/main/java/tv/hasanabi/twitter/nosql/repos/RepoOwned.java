package tv.hasanabi.twitter.nosql.repos;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.repository.MongoRepository;
import tv.hasanabi.twitter.nosql.objects.Owned;

@Document(collection = "owned")
public interface RepoOwned extends MongoRepository<Owned, String> {

}
