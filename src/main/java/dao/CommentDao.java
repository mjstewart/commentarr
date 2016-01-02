package dao;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongodb.MongoClient;
import org.bson.Document;
import org.mongodb.morphia.Datastore;
import org.mongodb.morphia.Key;
import org.mongodb.morphia.Morphia;

import javax.enterprise.context.ApplicationScoped;
import java.text.SimpleDateFormat;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import domain.Comment;
import org.mongodb.morphia.query.Query;

/**
 * Created by matt on 01/January/2016.
 */
@ApplicationScoped
public class CommentDao {
    private final String dbName = "commentarr";
   // private final MongoDatabase db;

    private final Datastore datastore;

    public CommentDao() {
        // db = ConnectionFactory.INSTANCE.getMongoClient().getDatabase(dbName);
        Morphia morphia = new Morphia();
        morphia.mapPackage("domain");
        MongoClient mongoClient = ConnectionFactory.INSTANCE.getMongoClient();
        datastore = morphia.createDatastore(mongoClient, dbName);
        datastore.ensureIndexes();
    }

    public boolean add(String s) {
        return false;
    }


    public boolean update(String s) {
        return false;
    }


    public boolean delete(String t) {
        return false;
    }


    public List<Comment> getAll() {
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.ENGLISH);
        Query<Comment> query = datastore.createQuery(Comment.class)
                .field("voteCount").lessThanOrEq(10);
        List<Comment> comments = query.asList();

        return comments;
    }

    public void save() {

    }


    public void fakeData() {
        DateTimeFormatter formatter = DateTimeFormatter
                .ofPattern("yyyy-MM-dd'T'HH:mm:ss'Z'")
                .withZone(ZoneId.of("Australia/Adelaide"));

        List<Document> documents = new ArrayList<>();

        documents.add(new Document()
                .append("author", "paul")
                .append("title", "comment 1 title")
                .append("message", "comment 1 message")
                .append("voteCount", 0)
                .append("reports", 0)
                .append("dateCreated", new Date())
        );

        documents.add(new Document()
                .append("author", "melanie")
                .append("title", "comment 2 title")
                .append("message", "comment 2 message")
                .append("voteCount", 0)
                .append("reports", 0)
                .append("dateCreated", new Date())
        );

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

        Key<Comment> save = datastore.save(comment1);
        Key<Comment> save1 = datastore.save(comment2);
        System.out.println("saved id 1= " + save.getId());
        System.out.println("saved id 2= " + save1.getId());
        // db.getCollection("comments").insertMany(documents);
    }


    public static void main(String[] args) {
        CommentDao commentDao = new CommentDao();
         commentDao.fakeData();
       // System.out.println(commentDao.getAll());

        List<Comment> all = commentDao.getAll();
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            String s = objectMapper.writeValueAsString(all);
            System.out.println(s);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

    }




}
