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
            console.log("ON VOTE CHANGE !!");
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

        let coreButtonCss = "btn btn-xs btn-primary margin-left-sm core-heading";
        coreButtonCss = (this.props.disabled) ? coreButtonCss + " wait-cursor" : coreButtonCss;

        return (
            <div>
                <label>Votes <span className={badgeCss}>{count}</span></label>
                <button type="button" className={coreButtonCss} disabled={this.props.disabled}
                        onClick={this.onVoteCountChange(true).bind(this)}>
                    <span className="glyphicon glyphicon-arrow-up"> </span></button>
                <button type="button" className={coreButtonCss} disabled={this.props.disabled}
                        onClick={this.onVoteCountChange(false).bind(this)}>
                    <span className="glyphicon glyphicon-arrow-down"> </span></button>
            </div>
        )
    }
}

CommentVotingActions.propTypes = {
    comment: React.PropTypes.object.isRequired,
    updateComment: React.PropTypes.func.isRequired,
    disabled: React.PropTypes.bool.isRequired
};

export default CommentVotingActions;

