import React from 'react'

class CreateVoteButton extends React.Component {
    render() {
        const {serverResponse} = this.props;
       // console.log("CreateCommentButton render");
        return (
            <button type="button"
                    className={this.props.displayCreateCommentForm ? "btn btn-warning btn-block" : "btn btn-primary btn-block core-heading"}
                    onClick={this.props.toggleCommentForm}
                    disabled={serverResponse.event === "comment create" && serverResponse.status === "waiting"}>
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

export default CreateVoteButton

