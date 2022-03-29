package tv.hasanabi.chat.sql.repos;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import tv.hasanabi.chat.sql.Message;

@Repository
public interface MessageRepo extends CrudRepository<Message, Long> {
}
