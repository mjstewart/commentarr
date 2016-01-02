package websocket;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import dao.CommentRepository;
import domain.Comment;

import javax.json.Json;
import javax.json.JsonObject;
import javax.websocket.Session;
import java.io.IOException;
import java.util.List;

/**
 * Created by matt on 31/December/2015.
 */
public class CommentEventHandler {
    private final CommentSessionHandler sessionHandler;
    private final CommentRepository repository;
    private final ObjectMapper objectMapper;


    public CommentEventHandler(CommentSessionHandler sessionHandler) {
        this.sessionHandler = sessionHandler;
        repository = new CommentRepository();
        objectMapper = new ObjectMapper();
    }

    /**
     * Subscribes session to receive new comments and sends back a reply containing all the current comments.
     *
     * @param session the client session to send response back to
     */
    public void onSubscribeComments(Session session) {
        sessionHandler.addCommentSubscriber(session);
        List<Comment> comments = repository.getAll();
        String commentsJson = toJSONString(comments);
        System.out.println("onSubscribeComments -- comments sending back to client are");
        System.out.println(commentsJson);
        System.out.println("===========================================================");

        JsonObject subscribeReply = Json.createObjectBuilder()
                .add("event", "subscribe comments")
                .add("comments", commentsJson)
                .build();
        sessionHandler.sendMessage(session, subscribeReply.toString());
    }

    /**
     * Validates and saves a comment to data store.
     *
     * A response is sent back to session informing of the save status. If successful, the new comment is broadcast to
     * all registered comment subscribers including the session who created the comment.
     *
     * @param session the client session to send response back to
     * @param jsonCommentString the json string sent from the client containing the new comment
     */
    public void onCommentCreate(Session session, String jsonCommentString) {
        try {
            Comment comment = objectMapper.readValue(jsonCommentString, Comment.class);
            // validate here I guess?

            System.out.println("CommentEventHandler");
            System.out.println(comment);

            if (repository.save(comment)) {
                JsonObject commentCreatedReply = Json.createObjectBuilder()
                        .add("event", "comment create")
                        .add("status", "ok")
                        .build();

                String commentReply = toJSONString(comment);
                System.out.println("Sending back this comment to all subscribers?");
                System.out.println(commentReply);
                JsonObject addCommentReply = Json.createObjectBuilder()
                        .add("event", "comment add")
                        .add("comment", commentReply)
                        .build();

                sessionHandler.sendMessage(session, commentCreatedReply.toString());
                sessionHandler.sendToCommentSubscribers(addCommentReply.toString());
            } else {
                sendError(session, "comment create", "Error saving to database, try again");
            }
        } catch (IOException e) {
            sendError(session, "comment create", "Error with data format sent from client to server");
        }
    }



    public static String toJSONString(Object o) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            return mapper.writeValueAsString(o);
        } catch (JsonProcessingException e) {
            System.out.println(e.getMessage());
            return null;
        }
    }

    public void sendError(Session session, String errorEvent, String reason) {
        JsonObject errorReply = Json.createObjectBuilder()
                .add("event", "error")
                .add("errorEvent", errorEvent)
                .add("reason", reason)
                .build();
        sessionHandler.sendMessage(session, errorReply.toString());
    }
}
