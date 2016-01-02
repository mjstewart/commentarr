import React from 'react';

class CommentEditActions extends React.Component {

    onDeleteComment() {
        this.props.deleteComment(this.props.comment);
    }

    onReportCountUpdate() {
        const newReportCount = this.props.comment.reports + 1;
        this.props.updateComment(Object.assign({}, this.props.comment, {reports: newReportCount}), "reports");
    }

    render() {
        return (
            <div className="row">
                <div className="col-lg-8">
                    <span className="glyphicon glyphicon-trash hoverable-cursor" data-toggle="tooltip"
                          data-placement="top" title="Delete comment" onClick={this.onDeleteComment.bind(this)}> </span>
                </div>
                <div className="col-lg-1 absolute-bottom-right">
                    <p className="hoverable-cursor" onClick={this.onReportCountUpdate.bind(this)}>
                        <span className="glyphicon glyphicon-flag"> </span> Report</p>
                </div>

            </div>
        )
    }
}

CommentEditActions.propTypes = {
    comment: React.PropTypes.object.isRequired,
    deleteComment: React.PropTypes.func.isRequired
};

export default CommentEditActions

