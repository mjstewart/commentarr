import React from 'react';

/**
 * On click reveals the create comment form.
 */
class CreateVoteButton extends React.Component {
    render() {
        const {serverResponse} = this.props;
        return (
            <button type="button"
                    className={this.props.displayCreateCommentForm ? "btn btn-warning btn-block" : "btn btn-primary btn-block core-heading"}
                    onClick={this.props.toggleCommentForm}
                    disabled={serverResponse.status === "waiting"}>
                {this.props.displayCreateCommentForm ? "Close" : "Create new comment"}
            </button>
        )
    }
}

CreateVoteButton.propTypes = {
    displayCreateCommentForm: React.PropTypes.bool.isRequired,
    toggleCommentForm: React.PropTypes.func.isRequired,
    serverResponse: React.PropTypes.object.isRequired
};

export default CreateVoteButton;

