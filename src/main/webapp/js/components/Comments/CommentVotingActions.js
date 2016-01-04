import React from 'react';

/**
 * Contains vote count plus up and down vote controls.
 */
class CommentVotingActions extends React.Component {
    /**
     *
     * @param up true if vote count is to go up
     * @returns {Function} a fn that updates the vote count
     */
    onVoteCountChange(up) {
        return function() {
            const newCount = up ? this.props.comment.voteCount + 1 : this.props.comment.voteCount - 1;
            this.props.updateComment(Object.assign({}, this.props.comment,
                {voteCount: newCount, dateLastUpdated: new Date()}), "voteCount");
        }
    }

    render() {
        let badgeCss;
        let count = this.props.comment.voteCount;
        if (count > 0) {
            badgeCss = "badge positive";
        } else if (count < 0) {
            badgeCss = "badge negative";
        } else {
            badgeCss = "badge neutral";
        }
        return (
            <div>
                <label>Votes <span className={badgeCss}>{count}</span></label>
                <button type="button" className="btn btn-xs btn-primary margin-left-sm core-heading"
                        onClick={this.onVoteCountChange(true).bind(this)}>
                    <span className="glyphicon glyphicon-arrow-up"> </span></button>
                <button type="button" className="btn btn-xs btn-primary margin-left-xs core-heading"
                        onClick={this.onVoteCountChange(false).bind(this)}>
                    <span className="glyphicon glyphicon-arrow-down"> </span></button>
            </div>
        )
    }
}

CommentVotingActions.propTypes = {
    comment: React.PropTypes.object.isRequired,
    updateComment: React.PropTypes.func.isRequired
};

export default CommentVotingActions

