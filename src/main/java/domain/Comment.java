package domain;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.bson.types.ObjectId;
import org.mongodb.morphia.annotations.Entity;
import org.mongodb.morphia.annotations.Id;

import java.util.Date;

/**
 * Object -> json: Jackson uses the name after get as the keys in the json object.
 * json -> Object: Jackson uses the name after set as the method to call to fill the correct java object fields.
 *
 * Created by matt on 02/January/2016.
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

    public void setId(ObjectId id) {
        this.id = id;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public int getVoteCount() {
        return voteCount;
    }

    public void setVoteCount(int voteCount) {
        this.voteCount = voteCount;
    }

    public int getReports() {
        return reports;
    }

    public void setReports(int reports) {
        this.reports = reports;
    }

    public Date getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(Date dateCreated) {
        this.dateCreated = dateCreated;
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
                '}';
    }
}
