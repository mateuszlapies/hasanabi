package tv.hasanabi.chat.firebase.model;

import com.google.firebase.auth.FirebaseToken;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Credentials {
    private String idToken;
    private String session;
    private FirebaseToken decodedToken;
}
