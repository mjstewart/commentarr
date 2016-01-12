package dao;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Named;
import javax.json.*;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.function.BiConsumer;
import java.util.function.BinaryOperator;
import java.util.function.Function;
import java.util.function.Supplier;
import java.util.stream.Collector;
import java.util.stream.Collectors;

/**
 * Mock comments using List of json strings rather than a database for testing.
 *
 * Created by matt on 12/28/15.
 */
@ApplicationScoped
@Named("MockComments")
public class MockComments {

    private List<String> comments;

    public MockComments() {
        comments = new ArrayList<>();

        JsonObject build1 = Json.createObjectBuilder()
                .add("id", 1)
                .add("author", "matt")
                .add("title", "title 1")
                .add("message", "comment 1 message")
                .add("dateCreated", "2016-01-10T04:52:42.344Z")
                .add("dateLastUpdated", "2016-01-10T04:55:42.344Z")
                .add("voteCount", "13")
                .add("reports", "2")
                .build();

        JsonObject build2 = Json.createObjectBuilder()
                .add("id", 2)
                .add("author", "sara")
                .add("title", "title 2")
                .add("message", "comment 2 message")
                .add("dateCreated", "2016-01-12T02:52:42.344Z")
                .add("dateLastUpdated", "2016-01-12T03:52:42.344Z")
                .add("voteCount", "102")
                .add("reports", "19")
                .build();

        comments.add(build1.toString());
        comments.add(build2.toString());
    }


    public boolean add(String s) {
        comments.add(s);
        return true;
    }


    public boolean update(String s) {
        List<String> collect = comments.stream().filter(comment -> !comment.equals(s)).collect(Collectors.toList());
        collect.add(s);
        comments = collect;
        return true;
    }


    public boolean delete(String t) {
        comments = comments.stream().filter(comment -> !comment.equals(t)).collect(Collectors.toList());
        return true;
    }

    public String getAll() {
        return comments.stream().collect(new JsonArrayCollector());
    }


    /**
     * Converts a List of comment strings into a json string containing comments: [comments..]
     */
    private static class JsonArrayCollector implements Collector<String, JsonArrayBuilder, String> {

        @Override
        public Supplier<JsonArrayBuilder> supplier() {
            return Json::createArrayBuilder;
        }

        @Override
        public BiConsumer<JsonArrayBuilder, String> accumulator() {
            return JsonArrayBuilder::add;
        }

        @Override
        public BinaryOperator<JsonArrayBuilder> combiner() {
            return (builder1, builder2) -> {
                JsonArray left = builder1.build();
                JsonArray right = builder2.build();
                JsonArrayBuilder combined = Json.createArrayBuilder();
                left.forEach(combined::add);
                right.forEach(combined::add);
                return combined;
            };
        }

        @Override
        public Function<JsonArrayBuilder, String> finisher() {
            return builder -> builder.build().toString();
        }

        @Override
        public Set<Characteristics> characteristics() {
            return Collections.emptySet();
        }

    }

    public static void main(String[] args) {

        MockComments mockComments = new MockComments();
    }
}
