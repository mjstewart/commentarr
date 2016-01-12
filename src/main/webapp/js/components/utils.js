/**
 * Contains utility functions for formatting comments.
 */
class CommentUtil {
    static capitalize(sentence) {
        return sentence
            .split(' ')
            .map(word => word[0].toUpperCase() + word.substring(1).toLowerCase())
            .join(' ');
    }
}

export default CommentUtil;