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
 * Created by matt on 12/28/15.
 */
@ApplicationScoped
@Named("MockComments")
public class MockComments {

    private List<String> comments;

    public MockComments() {
        comments = new ArrayList<>();
        // String comment1 = "{'id':1,'author':'matt','title':'title 1','message':'comment 1 message','dateCreated':'3/11/2015','voteCount':13,'reports':2}";
        //String comment2 = "{\"id\":2,\"author\":\"sara\",\"title\":\"title 2\",\"message\":\"comment 2 message\",\"dateCreated\":\"13/4/2013\",\"voteCount\":31,\"reports\":0}";

        JsonObject build1 = Json.createObjectBuilder()
                .add("id", 1)
                .add("author", "matt")
                .add("title", "title 1")
                .add("message", "comment 1 message")
                .add("dateCreated", "3/11/2015")
                .add("voteCount", "13")
                .add("reports", "2")
                .build();

        JsonObject build2 = Json.createObjectBuilder()
                .add("id", 2)
                .add("author", "sara")
                .add("title", "title 2")
                .add("message", "comment 2 message")
                .add("dateCreated", "4/2/1997")
                .add("voteCount", "102")
                .add("reports", "19")
                .build();

        comments.add(build1.toString());
        comments.add(build2.toString());
       // comments.add(comment2);
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


        JsonObject build = Json.createObjectBuilder()
                .add("id", 1)
                .add("author", "matt")
                .add("title", "title 1")
                .add("message", "comment 1 message")
                .add("dateCreated", "3/11/2015")
                .add("voteCount", "13")
                .add("reports", "2")
                .build();
        String s = build.toString();
        System.out.println(s);

        System.out.println();

    }
}
