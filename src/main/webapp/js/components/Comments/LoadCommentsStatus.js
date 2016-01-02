import React from 'react';

class LoadCommentsStatus extends React.Component {
    render() {
        const {status} = this.props.serverResponse;


        return (
            <div>

            </div>
        )
    }
}

LoadCommentsStatus.propTypes = {
    serverResponse: React.PropTypes.object,
};

export default LoadCommentsStatus


