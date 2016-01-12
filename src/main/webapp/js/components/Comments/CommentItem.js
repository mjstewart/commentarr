import React from 'react';
import CommentVotingActions from './CommentVotingActions';
import CommentEditActions from './CommentEditActions';
import moment from 'moment';
import $ from 'jquery';
import CommentUtil from '../utils';

/**
 * Contains a single comment
 */
class CommentItem extends React.Component {

    /**
     * Actions that need to occur prior to rendering.
     * This method is not called for the initial render.
     *
     * @param nextProps
     */
    componentWillReceiveProps(nextProps) {
        if (nextProps.serverResponse.status === "ok" && this.matchesOurCommentId(nextProps.serverResponse.commentId)
            && nextProps.serverResponse.updateField === "reports") {
            // comment report has been saved, trigger status message, this controls hiding the status after timer.
            this.props.onReportAction(this.props.comment.id);
        } else if (this.props.serverResponse.status === "waiting"
            && this.isEventForUs(nextProps.serverResponse.commentId)) {
            // if we have been waiting and this next event is for us
            if (nextProps.serverResponse.status !== "timeout") {
                // not really needed because timeout is only for when web socket server goes down, in which case
                // the entire feed closes down, but clearing timeout timer might be a good idea anyway just in case.
                clearTimeout(this.props.serverResponse.timerId);
            }
        }
    }

    /**
     * Returns true if the supplied commentId is the same as this CommentItems commentId.
     *
     * @param commentId
     * @returns {boolean}
     */
    matchesOurCommentId(commentId) {
        return commentId === this.props.comment.id;
    }

    /**
     * Must only be called if status is 'waiting' or 'error' because the commentId will only be present for these.
     *
     * @returns {boolean}
     */
    isEventForUs(commentId) {
        const {event} = this.props.serverResponse;
        return ((event === "comment update" || event === "comment delete") && this.matchesOurCommentId(commentId));
    }

    getStatusPanel() {
        const {status} = this.props.serverResponse;
        const {commentId} = this.props.serverResponse;
        if (status === "waiting" && this.isEventForUs(commentId)) {
            return (
                <div className="alert alert-info smaller-alert with-fadein" role="alert">
                    <p><span className="glyphicon glyphicon-refresh spinning-gylphicon margin-right-xs"></span>
                        It's taking a little longer than normal, please wait...</p>
                </div>
            )
        } else if (status === "error" && this.isEventForUs(commentId)) {
            // will occur with database errors
            setTimeout(() => {
                if (this.refs.error !== undefined) {
                    this.refs.error.className = 'hide';
                }}, 4000);

            return (
                <div className="alert alert-danger smaller-alert with-fadeout" role="alert" ref="error">
                    <p><span className="glyphicon glyphicon-remove margin-right-xs"></span>
                        There's been a slight issue which is '{this.props.serverResponse.reason + "', please try again."}</p>
                </div>
            )
        } else if (this.props.serverResponse.event === "report notification" && this.matchesOurCommentId(commentId)) {
            return (
                <div className="alert alert-warning smaller-alert with-fadeout" role="alert">
                    <p><span className="glyphicon glyphicon-exclamation-sign margin-right-xs"></span>
                        This comment has just received a report</p>
                </div>
            )
        } else {
            // don't display anything
            return null;
        }
    }


    /**
     * Gets the full date created format and last updated time ago.
     *
     * @returns {{fullFormat: *, lastUpdatedTimeAgo: *}}
     */
    getDateStats() {
        const {comment} = this.props;
        let date = moment(comment.dateCreated);

        return {
            fullFormat: date.format("dddd, MMMM Do YYYY, h:mm a"),
            lastUpdatedTimeAgo: moment(comment.dateLastUpdated).fromNow()
        }
    }


    render() {
        const dateStats = this.getDateStats();
        const {comment} = this.props;

        return (
            <div className="panel panel-default">
                <div className="panel-heading panel-heading-comment">
                    <div className="row">
                        <div className="col-lg-9 col-md-9 col-sm-7 col-xs-7">
                            <h5 className="message-title">{comment.title}</h5>
                        </div>
                        <div className="col-lg-3 col-md-3 col-sm-5 col-xs-5">
                            <CommentVotingActions comment={this.props.comment}
                                                  updateComment={this.props.updateComment}
                                                  disabled={this.props.serverResponse.status === "waiting"}/>
                        </div>
                    </div>
                    {this.props.comment.reports >= this.props.commentUnderReviewThreshold ?
                        (<div id="under-moderator-review" className="row">
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <span className="glyphicon glyphicon-time margin-right-xs"></span>
                                <p>Comment is under moderator review</p>
                            </div>
                    </div>) : null}
                </div>
                <div className="panel-body">
                    <textarea id="message-textarea" defaultValue={comment.message}></textarea>
                    <div className="margin-top-sm top-border message-metadata">
                        <span>Posted on {dateStats.fullFormat}</span>
                        <span className="pull-right">By {CommentUtil.capitalize(comment.author)}</span>
                        <p><span className="lighter-text">(Last updated {dateStats.lastUpdatedTimeAgo})</span></p>
                    </div>
                </div>
                <div className="panel-footer position-relative">
                    <CommentEditActions comment={this.props.comment}
                                        deleteComment={this.props.deleteComment}
                                        updateComment={this.props.updateComment}
                                        disabled={this.props.serverResponse.status === "waiting"}/>
                </div>
                <div>
                    {this.getStatusPanel.bind(this)()}
                </div>
            </div>
        )
    }
}

CommentItem.propTypes = {
    comment: React.PropTypes.object.isRequired,
    serverResponse: React.PropTypes.object,
    updateComment: React.PropTypes.func.isRequired,
    deleteComment: React.PropTypes.func.isRequired,
    onReportAction: React.PropTypes.func.isRequired,
    commentUnderReviewThreshold: React.PropTypes.number.isRequired
};

export default CommentItem;

