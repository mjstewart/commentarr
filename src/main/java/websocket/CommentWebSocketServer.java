package websocket;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonReader;
import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.io.StringReader;

/**
 * Main entry point for where client requests get received and handled.
 *
 * Created by Matt Stewart on 02/January/2016.
 */
@ApplicationScoped
@ServerEndpoint("/comments")
public class CommentWebSocketServer {

    @Inject
    private CommentSessionHandler sessionHandler;

    private CommentEventHandler commentEventHandler;

    @PostConstruct
    public void setup() {
        commentEventHandler = new CommentEventHandler(sessionHandler);
    }

    @OnOpen
    public void onOpen(Session session, EndpointConfig config) {
        System.out.println("server onOpen -> " + session.getId());
        sessionHandler.addSession(session);
    }

    @OnClose
    public void onClose(Session session) {
        System.out.println("server onClose removing from all sessions-> " + session.getId());
        sessionHandler.removeAll(session);
    }

    @OnError
    public void onError(Session session, Throwable error) {
        System.out.println("server on error " + error.getClass());
        System.out.println("server onError -> " + session.getId() + " error=" + error.getMessage());
    }

    @OnMessage
    public void onMessage(String message, Session session) {
        System.out.println("server onMessage");

        // Every incoming message will have an event key. Individual event handlers will extract any other keys.
        JsonReader reader = Json.createReader(new StringReader(message));
        JsonObject jsonObject = reader.readObject();
        String event = jsonObject.getString("event");

        System.out.println("event: " + event);

        switch (event) {
            case "subscribe comments":
                commentEventHandler.onSubscribeComments(session);
                break;
            case "comment create":
                JsonObject data = jsonObject.getJsonObject("data");
                commentEventHandler.onCommentCreate(session, data);
                break;
            case "comment update":
                data = jsonObject.getJsonObject("data");
                System.out.println("comment update received");
                commentEventHandler.onUpdateComment(session, data);
                break;
            case "comment delete":
                data = jsonObject.getJsonObject("data");
                System.out.println("comment delete received");
                commentEventHandler.onDeleteComment(session, data);
                break;
            case "comment getAll":
                System.out.println("comment getAll received");
                commentEventHandler.onGetAllComments(session);
                break;

        }
    }
}
