package tv.hasanabi.backend.nosql.repos.twitter;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.repository.MongoRepository;
import tv.hasanabi.backend.nosql.objects.twitter.Owned;

@Document(collection = "owned")
public interface RepoOwned extends MongoRepository<Owned, String> {

}
