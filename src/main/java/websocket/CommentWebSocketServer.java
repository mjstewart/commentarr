package websocket;

import dao.CommentDao;
import dao.CommentRepository;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.inject.Named;
import javax.websocket.server.ServerEndpoint;
import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonReader;
import javax.websocket.*;
import java.io.StringReader;
import java.util.function.Consumer;

/**
 * Created by matt on 31/December/2015.
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
        System.out.println("server onError -> " + session.getId() + " error=" + error.getMessage());
    }

    @OnMessage
    public void onMessage(String message, Session session) {
        System.out.println("server onMessage");

        // Every incoming message will have an event key. Events with more than 1 key will need to determine which
        // keys they need to extract from this JsonObject.
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
                System.out.println("data: " + data);
                System.out.println("data: " + data.toString());
                commentEventHandler.onCommentCreate(session, data.toString());
                break;
        }



}
