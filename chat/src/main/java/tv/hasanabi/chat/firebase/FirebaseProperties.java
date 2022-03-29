package tv.hasanabi.chat.firebase;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Data
@Component
@ConfigurationProperties("firebase")
public class FirebaseProperties {
    List<String> origins = new ArrayList<>();
    List<String> headers = new ArrayList<>();;
    List<String> methods = new ArrayList<>();;
    List<String> pub = new ArrayList<>();;
}