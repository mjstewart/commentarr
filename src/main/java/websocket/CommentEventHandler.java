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
 * Created by Matt Stewart on 02/January/2016.
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
        System.out.println("calling getAll query");
        List<Comment> comments = repository.getAll();
        System.out.println(comments);
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
     * @param data the comment as a JsonObject
     */
    public void onCommentCreate(Session session, JsonObject data) {
        try {
            Comment comment = objectMapper.readValue(data.toString(), Comment.class);
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
                sendError(session, "comment create", "Unable to save to database, try again");
            }
        } catch (IOException e) {
            sendError(session, "comment create", "Invalid data format sent from client to server");
        }
    }

    /**
     *
     * @param session
     * @param data JsonObject containing 2 keys, updateField and comment which is an object type
     */
    public void onUpdateComment(Session session, JsonObject data) {
        try {
            Comment comment = objectMapper.readValue(data.getJsonObject("comment").toString(), Comment.class);
            System.out.println("in onUpdateComment");
            System.out.println(comment);
            if (repository.update(comment)) {
                JsonObject commentUpdatedReply = Json.createObjectBuilder()
                        .add("event", "comment update")
                        .add("comment", toJSONString(comment))
                        .build();
                sessionHandler.sendToCommentSubscribers(commentUpdatedReply.toString());
            } else {
                // notify original updater comment cant be updated
                JsonObject commentUpdatedReply = Json.createObjectBuilder()
                        .add("event", "error")
                        .add("errorEvent", "comment update")
                        .build();
                sessionHandler.sendMessage(session, commentUpdatedReply.toString());
            }
        } catch (IOException e) {
            e.printStackTrace();
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
