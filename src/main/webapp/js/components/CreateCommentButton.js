import React from 'react'

class CreateVoteButton extends React.Component {
    render() {
       // console.log("CreateCommentButton render");
        return (
            <button type="button"
                    className={this.props.displayVoteForm ? "btn btn-warning btn-block" : "btn btn-primary btn-block core-heading"}
                    onClick={this.props.toggleVoteForm}>
                {this.props.displayVoteForm ? "Close" : "Create new comment"}
            </button>
        )
    }
}

CreateVoteButton.propTypes = {
    displayVoteForm: React.PropTypes.bool.isRequired,
    toggleVoteForm: React.PropTypes.func.isRequired
};

export default CreateVoteButton

