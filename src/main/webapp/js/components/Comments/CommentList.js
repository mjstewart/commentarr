import React from 'react';
import CommentItem from './CommentItem';

class CommentList extends React.Component {
    render() {
       // console.log("CommentList render");
        const {comments} = this.props;
        return (
            <div className="panel panel-primary core-border">
                <div className="panel-heading core-heading">
                    <h3>Comments ({this.props.comments.length})</h3>
                </div>
                <div className="panel-body">
                    {comments.map(comment =>
                    <CommentItem key={comment.id} comment={comment}
                                 serverResponse={this.props.serverResponse}
                                 updateComment={this.props.updateComment}
                                 deleteComment={this.props.deleteComment} />)}
                </div>
            </div>
        )
    }
}

CommentList.propTypes = {
    comments: React.PropTypes.array.isRequired,
    serverResponse: React.PropTypes.object,
    updateComment: React.PropTypes.func.isRequired,
    deleteComment: React.PropTypes.func.isRequired
};

export default CommentList



