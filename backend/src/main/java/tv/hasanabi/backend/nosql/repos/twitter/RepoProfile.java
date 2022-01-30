package tv.hasanabi.backend.nosql.repos.twitter;

import org.springframework.data.mongodb.repository.MongoRepository;
import tv.hasanabi.backend.nosql.objects.twitter.Profile;

public interface RepoProfile extends MongoRepository<Profile, String> {

}
