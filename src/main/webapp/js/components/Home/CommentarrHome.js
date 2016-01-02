import React from 'react';
import CommentFeed from './../Comments/CommentFeed';
import NotificationBar from './NotificationBar';

/**
 * Top most component to store entire commentarr home page.
 */
class CommentarrHome extends React.Component {

    constructor() {
        super();
        this.state = {
            notificationMessage: ''
        }
    }

    showNotification(message) {
        console.log("show notification");
        this.setState({
            notificationMessage: message
        });

        // remove notification message after 5sec causes render to remove notification bar
        setTimeout(() => {
            this.setState({notificationMessage: ''})
        }, 5000);
    }



    render() {
        return (
            <div className="row">
                <NotificationBar message={this.state.notificationMessage} />

                <div className="row">
                    <div className="col-md-12 jumbotron">
                        <h1>CommentARR</h1>
                        <p>leave comments n stuff</p>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <CommentFeed notificationHandler={this.showNotification.bind(this)}/>
                    </div>
                </div>
            </div>
        )
    }
}

export default CommentarrHome

