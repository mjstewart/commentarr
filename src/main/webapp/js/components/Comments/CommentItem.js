import React from 'react';
import CommentVotingActions from './CommentVotingActions';
import CommentEditActions from './CommentEditActions';
import FadingStatusMessage from '../FadingStatusMessage';
import moment from 'moment';

class CommentItem extends React.Component {

    getStatusPanel() {
        const status = this.props.serverResponse;
        //return status === null ? null : status.saved ? null : (
        //        <FadingStatusMessage title="Error" message=" can't connected to server" cssAlertType="alert-danger"/>
       //     );
        return <FadingStatusMessage title="Error" message=" can't connected to server" cssAlertType="alert-danger"/>
    }


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
                                                  updateComment={this.props.updateComment}/>
                        </div>
                    </div>
                </div>
                <div className="panel-body">
                    <textarea id="message-textarea" defaultValue={comment.message}></textarea>
                    <div className="margin-top-sm top-border message-metadata">
                        <span>Posted on {dateStats.fullFormat}</span>
                        <span className="margin-left-lg lighter-text">(Last updated {dateStats.lastUpdatedTimeAgo})</span>
                        <span className="pull-right">By {comment.author}</span>
                    </div>
                </div>
                <div className="panel-footer position-relative">
                    <CommentEditActions {...this.props}/>
                </div>
                {this.getStatusPanel()}
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

export default CommentItem

