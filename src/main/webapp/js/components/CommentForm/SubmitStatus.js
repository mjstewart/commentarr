import React from 'react'

/**
 * Top level component sends down server response object, and we check if its for the comment create event we
 * need to display information for, otherwise keep hidden.
 */
class SubmitStatus extends React.Component {
    render() {
        const {serverResponse} = this.props;
        // if status isn't one of the below events, it remains hidden
        let css = 'hide';
        let content;

        if (serverResponse.event === 'comment create') {
            css = "alert margin-top-sm ";

            const {status} = serverResponse;
            if (status === 'waiting') {
                css += "core-heading";
                content = <p><span className="glyphicon glyphicon-refresh spinning-gylphicon"> </span> Submitting, please wait...</p>
            } else if (status === 'timeout') {
                css += "alert-danger";
                content = <p><span><strong>Timeout error</strong></span> Unable to reach the server, please try again</p>
            } else if (status === 'error') {
                // will handle database issues, specific type of issue is available in errorEvent property.
                css += "alert-danger";
                content = <p><span><strong>Error</strong></span> {serverResponse.reason}</p>
            } else if (status === 'ok') {
                css += "alert-success";
                content = <p><span><strong>Success</strong></span> Your comment has been saved</p>
            }
        }

        return (
            <div className={css} role="alert">
                <button type="button" className="close" aria-label="Close">
                    <span onClick={this.props.removeCommentSubmitStatus} aria-hidden="true">&times;</span></button>
                {content}
            </div>
        )
    }
}

SubmitStatus.propTypes = {
    serverResponse: React.PropTypes.object.isRequired,
    removeCommentSubmitStatus: React.PropTypes.func.isRequired
};

export default SubmitStatus


