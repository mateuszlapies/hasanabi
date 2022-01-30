package tv.hasanabi.twitter.nosql.repos;

import org.springframework.data.mongodb.repository.MongoRepository;
import tv.hasanabi.twitter.nosql.objects.Profile;

public interface RepoProfile extends MongoRepository<Profile, String> {

}
