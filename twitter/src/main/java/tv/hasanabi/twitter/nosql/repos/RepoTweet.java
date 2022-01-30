package tv.hasanabi.twitter.nosql.repos;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.repository.MongoRepository;
import tv.hasanabi.twitter.nosql.objects.Tweet;

@Document(collection = "tweet")
public interface RepoTweet extends MongoRepository<Tweet, String> {
    Tweet findFirstByOrderByCreatedDesc();
}
