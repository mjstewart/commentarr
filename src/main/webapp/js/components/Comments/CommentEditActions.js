import React from 'react';

/**
 * Contains delete and report comment plus any other editing controls.
 */
class CommentEditActions extends React.Component {

    onDeleteComment() {
        this.props.deleteComment(this.props.comment);
    }

    onReportCountUpdate() {
        const newReportCount = this.props.comment.reports + 1;
        this.props.updateComment(Object.assign({}, this.props.comment, {reports: newReportCount}), "reports");
    }

    render() {
        const {disabled} = this.props;

        return (
            <div className="row">
                <div className="col-lg-8">
                    <span className={disabled ? "glyphicon glyphicon-trash wait-cursor grey-out"
                    : "glyphicon glyphicon-trash hoverable-cursor"}
                          data-toggle="tooltip"
                          data-placement="top" title="Delete comment"
                          onClick={disabled ? null : this.onDeleteComment.bind(this)}> </span>
                </div>
                <div className="col-lg-1 absolute-bottom-right">
                    <p className={disabled ? "grey-out wait-cursor" : "hoverable-cursor"}
                       onClick={disabled ? null : this.onReportCountUpdate.bind(this)}>
                        <span className="glyphicon glyphicon-flag"> </span> Report</p>
                </div>

            </div>
        )
    }
}

CommentEditActions.propTypes = {
    comment: React.PropTypes.object.isRequired,
    deleteComment: React.PropTypes.func.isRequired,
    disabled: React.PropTypes.bool.isRequired
};

export default CommentEditActions;

