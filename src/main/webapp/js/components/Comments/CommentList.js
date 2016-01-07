import React from 'react';
import CommentItem from './CommentItem';

class CommentList extends React.Component {


    /**
     * Only return true when isDatebaseOffline is false, because this alert is just to let user know the initial
     * loading of the data failed so they will need to press a button to try again.
     */
    showRefreshCommentListRequired() {
        return !this.isDatabaseOffline() && this.props.failedInitialCommentFetch;
    }

    /**
     *
     * returns true if Database is offline for this Component.
     */
    isDatabaseOffline() {
        const serverResponse = this.props.serverResponse;
        // objects that have status of error will have all the errorEvent properties needed.
        return serverResponse.status === "error" && serverResponse.errorEvent === "database offline"
            && this.isEventForUs(serverResponse.event);
    }

    getDatabaseOfflineError() {
        return (
            (<div className="alert alert-dismissible margin-top-sm alert-warning" role="alert">
                <p><span className="glyphicon glyphicon-info-sign glyphicon-md margin-right-sm"> </span>
                    Sorry, we're currently experiencing database connection errors.
                    <span className="glyphicon glyphicon-refresh margin-left-md hoverable-cursor"
                          data-toggle="tooltip" title="refresh" onClick={this.props.getAllComments}> </span></p>
            </div>)
        )
    }


    isEventForUs(event) {
        return event === "subscribe comments" || event === "comment getAll";
    }

    isWaitingForServer(status, event) {
        return status === "waiting" && this.isEventForUs(event);
    }

    getRefreshCommentListHeader() {
        return (<div id="refresh-comments-warning">
            <h3>Comments ({this.props.comments.size})</h3>
            <div>
                <span className="glyphicon glyphicon-remove"> </span>
                <div>
                    <p>Your comment list is not up to date,</p>
                    <span onClick={this.props.getAllComments}>click to refresh</span>
                </div>
            </div>
        </div>)
    }

    getPanelHeading() {
        const serverResponse = this.props.serverResponse;

        if (this.isWaitingForServer(serverResponse.status, serverResponse.event)) {
            return <h4><span className="glyphicon glyphicon-refresh spinning-gylphicon"> </span> Loading comments, please wait...</h4>
        } else {
            return (<div>
                    {this.showRefreshCommentListRequired.bind(this)() ?
                        this.getRefreshCommentListHeader.bind(this)() :
                        <h3>Comments ({this.props.comments.size})</h3>}
                </div>)
        }
    }

    getPanelBody() {
        const serverResponse = this.props.serverResponse;

        if (this.isWaitingForServer(serverResponse.status, serverResponse.event)) {
            console.log("CommentList, isWaitingForServer");
            // only show the header loading
            return null;
        } else if (this.isDatabaseOffline.bind(this)()) {
            console.log("CommentList, Database is offline");
            return (
                <div className="panel-body">
                    {this.getDatabaseOfflineError()}
                </div>)
        } else {
            // no errors, display comments
            return (
                <div className="panel-body">
                    {this.props.comments.isEmpty() ?
                    <p className="lighter-text">No comments to see at the moment</p>
                    : <div>
                        {this.props.comments.map(comment =>
                            <CommentItem key={comment.id} comment={comment}
                                         serverResponse={this.props.serverResponse}
                                         updateComment={this.props.updateComment}
                                         deleteComment={this.props.deleteComment} />)}
                    </div>}
                </div>

            )
        }
    }


    render() {
        console.log("CommentList render");
        console.log(this.props.serverResponse);
        return  (
            <div className="panel panel-primary core-border">
                <div className="panel-heading core-heading">
                    {this.getPanelHeading.bind(this)()}
                </div>
                {this.getPanelBody.bind(this)()}
            </div>
        )
    }
}

CommentList.propTypes = {
    comments: React.PropTypes.object.isRequired,
    serverResponse: React.PropTypes.object,
    updateComment: React.PropTypes.func.isRequired,
    deleteComment: React.PropTypes.func.isRequired,
    getAllComments: React.PropTypes.func.isRequired,
    failedInitialCommentFetch: React.PropTypes.bool.isRequired
};

export default CommentList;



