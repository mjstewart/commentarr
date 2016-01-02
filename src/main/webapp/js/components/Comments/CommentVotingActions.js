import React from 'react';

class CommentVotingActions extends React.Component {
    /**
     *
     * @param up true if vote count is to go up
     * @returns {Function} a fn that updates the vote count
     */
    onVoteCountChange(up) {
        return function() {
            const newCount = up ? this.props.comment.voteCount + 1 : this.props.comment.voteCount - 1;
            this.props.updateComment(Object.assign({}, this.props.comment, {voteCount: newCount}));
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
                <button type="button" className="btn btn-xs btn-primary margin-left-sm"
                        onClick={this.onVoteCountChange(true).bind(this)}>
                    <span className="glyphicon glyphicon-arrow-up"> </span></button>
                <button type="button" className="btn btn-xs btn-primary margin-left-xs"
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

