package domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.bson.types.ObjectId;
import org.mongodb.morphia.annotations.Entity;
import org.mongodb.morphia.annotations.Id;

import java.util.Date;

/**
 * Comment POJO that is used by Jackson and Morphia
 *
 * Object -> json: Jackson uses XXX after getXXX as the key in the json object.
 * json -> Object: Jackson uses XXX name after setXXX as the method to call to fill the correct java object fields.
 *
 * Created by Matt Stewart on 02/January/2016.
 */
@Entity("comments")
public class Comment {
    @Id
    private ObjectId id;

    public String author;
    private String title;
    private String message;
    private int voteCount;
    private int reports;
    private Date dateCreated;
    private Date dateLastUpdated;

    /**
     * For jackson Object->json parsing as we only want the id property to be returned, not the entire ObjectId.
     *
     * @return ObjectId as a string so only the id part is returned, not all properties.
     */
    public String getId() {
        return id.toString();
    }

    @JsonIgnore
    public ObjectId getObjectId() {
        return id;
    }

    public String getAuthor() {
        return author;
    }

    public String getTitle() {
        return title;
    }

    public String getMessage() {
        return message;
    }

    public int getVoteCount() {
        return voteCount;
    }

    public int getReports() {
        return reports;
    }

    public Date getDateCreated() {
        return dateCreated;
    }

    public Date getDateLastUpdated() { return dateLastUpdated; }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setVoteCount(int voteCount) {
        this.voteCount = voteCount;
    }

    public void setReports(int reports) {
        this.reports = reports;
    }

    public void setDateCreated(Date dateCreated) {
        this.dateCreated = dateCreated;
    }

    public void setDateLastUpdated(Date dateLastUpdated) {
        this.dateLastUpdated = dateLastUpdated;
    }

    @Override
    public String toString() {
        return "Comment{" +
                "id=" + id +
                ", author='" + author + '\'' +
                ", title='" + title + '\'' +
                ", message='" + message + '\'' +
                ", voteCount=" + voteCount +
                ", reports=" + reports +
                ", dateCreated=" + dateCreated +
                ", dateLastUpdated=" + dateLastUpdated +
                '}';
    }
}
