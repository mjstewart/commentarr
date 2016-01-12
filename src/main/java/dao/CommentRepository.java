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
 * Contains all data access methods
 *
 * Created by Matt Stewart on 02/January/2016.
 */
public class CommentRepository {
    private final Datastore datastore = MongoDB.INSTANCE.getDatastore();

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
}
