package tv.hasanabi.twitter.nosql.repos;

import org.springframework.data.mongodb.repository.MongoRepository;
import tv.hasanabi.twitter.nosql.objects.Tweet;

public interface RepoTweet extends MongoRepository<Tweet, String> {
}
