package dao;


import com.mongodb.*;
import org.mongodb.morphia.Datastore;
import org.mongodb.morphia.Morphia;

import java.io.IOException;
import java.net.Socket;

/**
 * As per http://mongodb.github.io/mongo-java-driver/3.2/driver/getting-started/quick-tour/
 * You will only need one instance of class MongoClient
 *
 * Created by Matt Stewart on 01/January/2016.
 */
public enum MongoDB {
    INSTANCE;

    private MongoClient mongoClient;
    private Datastore datastore;

    private final String host = "localhost";
    private final int port = 27017;
    private final String dbName = "commentarr";

    MongoDB() {
        System.out.println("In MongoDB connection Constructor");
        MongoClientOptions mongoClientOptions = MongoClientOptions.builder().serverSelectionTimeout(10000).build();
        mongoClient = new MongoClient(new ServerAddress(host, port), mongoClientOptions);
        System.out.println(mongoClient.getMongoClientOptions());
        Morphia morphia = new Morphia();
        morphia.mapPackage("domain");
        datastore = morphia.createDatastore(mongoClient, dbName);
        datastore.ensureIndexes();
    }


    public Datastore getDatastore() {
        return datastore;
    }

    public boolean isMongoAvailable() {
        Socket socket = null;
        try {
            socket = new Socket("localhost", 27017);
            return socket.isConnected();
        } catch (IOException e) {
            return false;
        } finally {
            try {
                if (socket != null) {
                    socket.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }


    public void close() {
        mongoClient.close();
    }
}
