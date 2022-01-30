package tv.hasanabi.backend.nosql.repos.twitter;

import org.springframework.data.mongodb.repository.MongoRepository;
import tv.hasanabi.backend.nosql.objects.twitter.Tweet;

public interface RepoTweet extends MongoRepository<Tweet, String> {
    Tweet findFirstByOrderByCreatedDesc();
}
