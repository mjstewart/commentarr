import React from 'react';

class NotificationBar extends React.Component {

    render() {
        const {message} = this.props;
        return (
            <div id="notification-bar" className={message === '' ? "hide" : ""}>
                <p><span className="glyphicon glyphicon-bell"> </span> {this.props.message}</p>
            </div>
        )
    }
}

NotificationBar.propTypes = {
    message: React.PropTypes.string.isRequired
};

export default NotificationBar

