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
        sessionHandler.addSession(session);
    }

    @OnClose
    public void onClose(Session session) {
        sessionHandler.removeAll(session);
    }

    @OnError
    public void onError(Session session, Throwable error) {
        System.out.println("onError: session=" + session.getId() + " ,error=" + error.getMessage());
    }

    @OnMessage
    public void onMessage(String message, Session session) {
        // Every incoming message will have an event key. Individual event handlers will extract any other keys.
        JsonReader reader = Json.createReader(new StringReader(message));
        JsonObject jsonObject = reader.readObject();
        String event = jsonObject.getString("event");

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
                commentEventHandler.onUpdateComment(session, data);
                break;
            case "comment delete":
                data = jsonObject.getJsonObject("data");
                commentEventHandler.onDeleteComment(session, data);
                break;
            case "comment getAll":
                commentEventHandler.onGetAllComments(session);
                break;
        }
    }
}
