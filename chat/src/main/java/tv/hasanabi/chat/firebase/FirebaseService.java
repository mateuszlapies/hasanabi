package tv.hasanabi.chat.firebase;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.servlet.http.HttpServletRequest;

@Service
public class FirebaseService {

    FirebaseProperties securityProps;
    HttpServletRequest httpServletRequest;

    public FirebaseService(FirebaseProperties firebaseProperties, HttpServletRequest httpServletRequest) {
        this.securityProps = firebaseProperties;
        this.httpServletRequest = httpServletRequest;
    }

    public boolean isPublic() {
        return securityProps.getPub().contains(httpServletRequest.getRequestURI());
    }

    public String getBearerToken(HttpServletRequest request) {
        String bearerToken = null;
        String authorization = request.getHeader("Authorization");
        if (StringUtils.hasText(authorization) && authorization.startsWith("Bearer ")) {
            bearerToken = authorization.substring(7);
        }
        return bearerToken;
    }
}
