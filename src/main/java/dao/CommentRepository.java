package dao;

import com.mongodb.*;
import domain.Comment;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.mongodb.morphia.Datastore;
import org.mongodb.morphia.Key;
import org.mongodb.morphia.Morphia;

import java.util.Date;
import java.util.List;

/**
 * Created by Matt Stewart on 02/January/2016.
 */
public class CommentRepository {
    private final Datastore datastore = MongoDB.INSTANCE.getDatastore();

    public CommentRepository() {
    }

    public List<Comment> getAll() throws MongoException {
        return datastore.createQuery(Comment.class).asList();
    }

    public boolean save(Comment comment) throws MongoException {
        Key<Comment> save = datastore.save(comment, WriteConcern.ACKNOWLEDGED);
        return getById((ObjectId) save.getId()) != null;
    }

    public Comment getById(ObjectId id) throws MongoException {
        return datastore.createQuery(Comment.class).field("id").equal(id).get();
    }

    public boolean delete(Comment comment) throws MongoException {
        WriteResult delete = datastore.delete(comment, WriteConcern.ACKNOWLEDGED);
        System.out.println("CommentRepository delete");
        System.out.println(delete);
        return delete.getN() == 1;
    }

    /**
     * Morphia knows the comment to update by the comment id.
     *
     * @param comment the Comment to update.
     * @return true if update successful
     */
    public boolean update(Comment comment) throws MongoException {
        datastore.save(comment);
        return comment.getVoteCount() == getById(comment.getObjectId()).getVoteCount();
    }


    public void fakeData() {
        Comment comment1 = new Comment();
        comment1.setAuthor("mick");
        comment1.setTitle("a comment 1 title");
        comment1.setMessage("a comment 1 message");
        comment1.setVoteCount(42);
        comment1.setReports(11);
        comment1.setDateCreated(new Date());

        Comment comment2 = new Comment();
        comment2.setAuthor("jenny");
        comment2.setTitle("a comment 2 title");
        comment2.setMessage("a comment 2 message");
        comment2.setVoteCount(10);
        comment2.setReports(0);
        comment2.setDateCreated(new Date());

        Comment comment3 = new Comment();
        comment3.setAuthor("bill");
        comment3.setTitle("a comment 3 title");
        comment3.setMessage("a comment 3 message");
        comment3.setVoteCount(104);
        comment3.setReports(23);
        comment3.setDateCreated(new Date());


        datastore.save(comment1, WriteConcern.ACKNOWLEDGED);
        datastore.save(comment2);
        datastore.save(comment3);
    }


    public static void main(String[] args) {
        // CommentRepository repository = new CommentRepository();

        try {
            MongoClientOptions mongoClientOptions = MongoClientOptions.builder().heartbeatFrequency(2000).build();

            MongoClient mongoClient = new MongoClient(new ServerAddress("localhost", 27017), mongoClientOptions);

            Morphia morphia = new Morphia();
            morphia.mapPackage("domain");
            Datastore datastore = morphia.createDatastore(mongoClient, "commentarr");

            Document document = mongoClient.getDatabase("commentarr").runCommand(new Document("ping", 1));
            System.out.println(document);
        } catch (MongoTimeoutException e) {
            // handle server down or failed query here
            System.out.println(e.getMessage());
        }
    }


}
