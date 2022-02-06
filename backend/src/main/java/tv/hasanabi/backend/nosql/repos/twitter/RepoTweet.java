package tv.hasanabi.backend.nosql.repos.twitter;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import tv.hasanabi.backend.nosql.objects.twitter.Tweet;

import java.util.List;

public interface RepoTweet extends MongoRepository<Tweet, String> {
    Tweet findFirstByOrderByIdDesc();
}
