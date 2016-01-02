package dao;

import com.mongodb.MongoClient;
import com.mongodb.WriteConcern;
import domain.Comment;
import org.bson.types.ObjectId;
import org.mongodb.morphia.Datastore;
import org.mongodb.morphia.Key;
import org.mongodb.morphia.Morphia;
import websocket.CommentEventHandler;

import java.util.Date;
import java.util.List;

/**
 * Created by matt on 02/January/2016.
 */
public class CommentRepository {
    private final String dbName = "commentarr";
    private final Datastore datastore;

    public CommentRepository() {
        Morphia morphia = new Morphia();
        morphia.mapPackage("domain");
        MongoClient mongoClient = ConnectionFactory.INSTANCE.getMongoClient();
        datastore = morphia.createDatastore(mongoClient, dbName);
        datastore.ensureIndexes();
    }

    public List<Comment> getAll() {
        return datastore.createQuery(Comment.class).asList();
    }

    public boolean save(Comment comment) {
        Key<Comment> save = datastore.save(comment);
        return getById((ObjectId) save.getId()) != null;
    }

    public Comment getById(ObjectId id) {
        return datastore.createQuery(Comment.class).field("id").equal(id).get();
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

        datastore.save(comment1);
        datastore.save(comment2);
        datastore.save(comment3);
    }



    public static void main(String[] args) {
        CommentRepository repository = new CommentRepository();
        List<Comment> comments = repository.datastore.createQuery(Comment.class).asList();
        Comment comment = comments.get(0);
        String s = CommentEventHandler.toJSONString(comment);
        System.out.println(s);

        //repository.fakeData();
    }

}
