import React from 'react';
import CommentVotingActions from './CommentVotingActions';
import CommentEditActions from './CommentEditActions';
import FadingStatusMessage from '../StatusAlerts/FadingStatusMessage';
import moment from 'moment';

class CommentItem extends React.Component {

    componentWillReceiveProps(nextProps) {
        if (this.props.serverResponse.status === "waiting" && this.isEventForUs.bind(this)()) {
            if (nextProps.serverResponse.status !== "timeout") {
                // not really needed because timeout is only for when web socket server goes down, in which case
                // the entire feed closes down, but clearing timeout timer might be a good idea anyway just in case.
                clearTimeout(this.props.serverResponse.timerId);
            }
        }
    }

    /**
     * Must only be called if status is 'waiting' or 'error' because the commentId will only be present for these.
     *
     * @returns {boolean}
     */
    isEventForUs() {
        const {event} = this.props.serverResponse;
        const {commentId} = this.props.serverResponse;
        const matchingCommentId =  commentId === this.props.comment.id;
        return ((event === "comment update" || event === "comment delete") && matchingCommentId);
    }

    getStatusPanel() {
        const {status} = this.props.serverResponse;
        if (status === "waiting" && this.isEventForUs.bind(this)()) {
            return (
                <div className="alert alert-info smaller-alert with-fadein" role="alert">
                    <p><span className="glyphicon glyphicon-refresh spinning-gylphicon margin-right-xs"></span>
                        It's taking a little longer than normal, please wait...</p>
                </div>
            )
        } else if (status === "error" && this.isEventForUs.bind(this)()) {
            // will occur with database errors
            return <FadingStatusMessage title="Oops, there's been a slight error.."
                                        message={this.props.serverResponse.reason + ", please try again"}
                                        cssAlertType="alert-danger"/>
        } else {
            // if successful don't display anything
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
            fullFormat: date.format("dddd, MMMM Do YYYY, h:mm:ss a"),
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
                </div>
                <div className="panel-body">
                    <textarea id="message-textarea" defaultValue={comment.message}></textarea>
                    <div className="margin-top-sm top-border message-metadata">
                        <span>Posted on {dateStats.fullFormat}</span>
                        <span className="pull-right">By {comment.author}</span>
                        <p><span className="lighter-text">(Last updated {dateStats.lastUpdatedTimeAgo})</span></p>
                    </div>
                </div>
                <div className="panel-footer position-relative">
                    <CommentEditActions comment={this.props.comment}
                                        deleteComment={this.props.deleteComment}
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
    deleteComment: React.PropTypes.func.isRequired
};

export default CommentItem;

