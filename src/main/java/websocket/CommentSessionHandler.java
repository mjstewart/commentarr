package websocket;

import javax.enterprise.context.ApplicationScoped;
import javax.websocket.Session;
import java.io.IOException;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

/**
 * Created by matt on 30/December/2015.
 */
@ApplicationScoped
public class CommentSessionHandler {
    private final Set<Session> sessions = Collections.synchronizedSet(new HashSet<>());
    private final Set<Session> commentSubscribers = Collections.synchronizedSet(new HashSet<>());

    public void addSession(Session session) {
        sessions.add(session);
    }

    public void removeSession(Session session) {
        sessions.remove(session);
    }

    public void addCommentSubscriber(Session session) {
        System.out.println("Adding comment subscriber: session=" + session.getId());
        commentSubscribers.add(session);
    }

    public void removeAll(Session session) {
        removeSession(session);
        removeCommentSubscriber(session);
    }

    public void removeCommentSubscriber(Session session) {
        commentSubscribers.remove(session);
    }

    public void sendToCommentSubscribers(String jsonString) {
        commentSubscribers.stream().forEach(session -> sendMessage(session, jsonString));
    }

    public void sendMessage(Session session, String message) {
        try {
            System.out.println("sendMessage");
            session.getBasicRemote().sendText(message);
        } catch (IOException e) {
            System.out.println(e.getMessage());
        }
    }
}
