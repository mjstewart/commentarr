package websocket;

import javax.enterprise.context.ApplicationScoped;
import javax.websocket.Session;
import java.io.IOException;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

/**
 * Manages client sessions registration and communication.
 *
 * Created by matt on 30/December/2015.
 */
@ApplicationScoped
public class CommentSessionHandler {
    private final Set<Session> sessions = Collections.synchronizedSet(new HashSet<>());
    private final Set<Session> commentSubscribers = Collections.synchronizedSet(new HashSet<>());

    /**
     * Adds supplied session to the sessions set.
     *
     * @param session the session to add.
     */
    public void addSession(Session session) {
        sessions.add(session);
    }

    /**
     * Removes the supplied session from the sessions set.
     *
     * @param session the session to remove.
     */
    public void removeSession(Session session) {
        sessions.remove(session);
    }

    /**
     * Adds the supplied session to the comment subscribers set.
     *
     * @param session the session to add.
     */
    public void addCommentSubscriber(Session session) {
        commentSubscribers.add(session);
    }

    /**
     * Removes the supplied session from both the session and comment subscriber set.
     *
     * @param session the session to remove.
     */
    public void removeAll(Session session) {
        removeSession(session);
        removeCommentSubscriber(session);
    }

    /**
     * Removes the session from the comment subscribers set.
     *
     * @param session the session to remove.
     */
    public void removeCommentSubscriber(Session session) {
        commentSubscribers.remove(session);
    }

    /**
     * Send supplied json string to each comment subscriber.
     *
     * @param jsonString the payload to send to each comment subscriber
     */
    public void sendToCommentSubscribers(String jsonString) {
        commentSubscribers.stream().forEach(session -> sendMessage(session, jsonString));
    }

    /**
     * Sends the supplied message to the session.
     *
     * @param session the session to send the message to
     * @param message the message to send
     */
    public void sendMessage(Session session, String message) {
        try {
            session.getBasicRemote().sendText(message);
        } catch (IOException e) {
            System.out.println(e.getMessage());
        }
    }
}
