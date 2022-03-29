package tv.hasanabi.chat.sql;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String uid;
    private String name;
    private String email;
    private String picture;
    private String issuer;
    private boolean isEmailVerified;

    @OneToMany
    List<Message> messages;
}
