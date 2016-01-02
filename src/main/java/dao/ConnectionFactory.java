package dao;

import com.mongodb.MongoClient;

/**
 * As per http://mongodb.github.io/mongo-java-driver/3.2/driver/getting-started/quick-tour/
 * You will only need one instance of class MongoClient
 *
 * Created by matt on 01/January/2016.
 */
public enum ConnectionFactory {
    INSTANCE;

    private final MongoClient mongoClient;

    ConnectionFactory() {
        mongoClient = new MongoClient("localhost", 27017);
    }

    public MongoClient getMongoClient() {
        return mongoClient;
    }

    public void close() {
        mongoClient.close();
    }


}
