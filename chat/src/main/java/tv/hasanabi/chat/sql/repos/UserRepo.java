package tv.hasanabi.chat.sql.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import tv.hasanabi.chat.sql.User;

public interface UserRepo extends JpaRepository<User, Integer> {
}
