package tv.hasanabi.chat.sql;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "messages")
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public long id;
    public String message;
    public Date timestamp;
    @ManyToOne
    public User user;
}
