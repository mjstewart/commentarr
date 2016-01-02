import React from 'react';
import CreateCommentButton from './../CreateCommentButton';
import CommentForm from './../CommentForm/CommentForm';
import FeedSettingActivator from './../FeedSettings/FeedSettingActivator';
import FeedSettingControls from './../FeedSettings/FeedSettingControls.js';
import CommentList from './CommentList.js';
import Socket from '../../socket.js';
import $ from 'jquery';

class CommentFeed extends React.Component {

    constructor(props) {
        super(props);

        // keep entire feed state at top level, om next clojure script does this style, then state is passed down to everyone
        this.state = {
            comments: [],
            displayVoteForm: false,

            sortSettings: {
                field: 'voteCount',
                order: 'desc',
                comparator: function(a, b) {
                    if (a.voteCount > b.voteCount) {
                        return -1;
                    } else if (a.voteCount < b.voteCount) {
                        return 1;
                    } else {
                        return 0;
                    }
                }
            },

            // true if connected to web socket server
            connected: false,

            /*
             * Encapsulates server response details used to provide user feedback.
             * status codes are [ok, waiting, error, timeout]
             *
             * event === '' means all children components will ignore the response and not output any feedback messages.
             * Object is not null so additional null checks are not needed, only simple event comparisons.
             *
             * Every object has event and status keys, extra keys are added depending on status code context
             * 'error' - reason
             * 'waiting' - timerId (so children components can cancel this timer id on server response)
             *
             */
            serverResponse: {
                event: '',
                status: ''
            },

            displayFeedSettingControls: false
        }
    }

    componentDidMount() {
        this.props.notificationHandler("Welcome :), this is where you'll see any new activity");

        console.log("CommentFeed componentDidMount, trying to connect");
        // called once after render, then onConnect gets called, state is updated then another render

        // this.socket makes socket available to this instance for all functions
        let socket = this.socket = new Socket(`ws://${window.location.hostname}:8080/commentarr/comments`);

        /*
         * All functions starting with on are from server to client.
         * When server sends client data, onMessage in socket.js handles the request by using the message event
         * to call the corresponding method below to handle the event.
         */
        socket.addListener('connect', this.onConnect.bind(this));
        socket.addListener('disconnect', this.onDisconnect.bind(this));
        socket.addListener('comment add', this.onAddComment.bind(this));
        socket.addListener('comment create', this.onCreateComment.bind(this));
        socket.addListener('comment update', this.onUpdateComment.bind(this));
        socket.addListener('comment delete', this.onDeleteComment.bind(this));
        socket.addListener('subscribe comments', this.onSubscribeComments.bind(this));
        socket.addListener('error', this.onError.bind(this));
    }

    onConnect() {
        console.log("client onConnect() -> subscribing to comments");
        this.setState({connected: true});
        this.socket.emit('subscribe comments');
    }

    onDisconnect() {
        console.log("client onDisconnect()");
        this.setState({connected: false});
    }

    /**
     * All the comments on the server after subscribing to comment feed
     * Every new comment after, will get updated by onAddComment which is a single comment.
     *
     * @param json object containing 2 keys, event and comments containing an array of comments
     */
    onSubscribeComments(json) {
        console.log("client onSubscribeComments -> received in bulk comments");
        console.log(json);

        const commentArray = JSON.parse(json.comments);
        console.log(commentArray);

        this.setState({
            comments: commentArray
        });
    }


    /**
     * Toggle vote form on and off
     */
    toggleVoteForm() {
        this.setState({
            displayVoteForm: !this.state.displayVoteForm,
            // removes submit status panel from form
            serverResponse: {
                event: '',
                status: ''
            },
            serverTimeoutTimerId: null
        });
    }

    /**
     * Removes the submit status box in the vote form which displays after comment has been submitted for user feedback
     */
    removeCommentSubmitStatus() {
        this.setState({
            serverResponse: {
                event: '',
                status: ''
            }
        });
    }

    /**
     * Child components can hook into this state change to be informed when request to server has timed out based
     * on setTimeout function being provided in a request to the server.
     *
     * @param event what action triggered the timeout, such as 'comment add'
     */
    onServerTimeout(event) {
        this.setState({
            serverResponse: {
                event: event,
                status: 'timeout'
            }
        });
    }


    onCreateComment(serverResponse) {
        console.log("onCreateComment");
        console.log(serverResponse);
        this.setState({
            serverResponse: {
                event: serverResponse.event,
                status: serverResponse.status
            },
            serverTimeoutTimerId: null
        });

    }

    createComment(comment) {
        console.log("in createComment");
        this.socket.emit('comment create', comment);

        // timer provided so child components can stop the timer if response from server is received
        this.setState({
            serverResponse: {
                event: 'comment create',
                status: 'waiting',
                timerId: setTimeout(() => this.onServerTimeout('comment create'), 10000)
            }
        });
    }


    /**
     * Server tells us to add comment
     *
     * @param json json string containing event and comment keys.
     */
    onAddComment(json) {
        console.log("Received comment from server");
        console.log(json);
        const comment = JSON.parse(json.comment);
        const comments = this.state.comments.concat([comment]);
        this.setState({
           comments: comments
        });

        const message = `1 new comment by ${comment.author}`;
        this.props.notificationHandler(message);
    }


    /**
     * Anything to do with updating any aspect of a comment can go through this function, as we treat comments as
     * immutable meaning if any part of it changes a new comment is created with updated data. On the server
     * the original would be changed though.
     *
     * General overview of the lifecycle
     *
     * Sends comment to server, which means server reads in the event type of 'comment update'
     * so it knows what to do with it. If successfully updated, server will send message back to all sockets which
     * means socket.js (handles our websocket connection) onmessage handler receives in the 'comment update' and
     * calls this method since we registered this method to be called for that event..
     *
     * Otherwise error handler is called.
     *
     * @param comment
     * @param field the field being updated so specific ui feedback can be provided on success/error. This feature
     * is to eliminate having many update functions purely used to identity which field is being updated.
     */
    updateComment(comment, field) {
        console.log("updateComment");
        this.socket.emit('comment update', {updateField: field}, comment);
    }

    /**
     * Server tells us to update a comment
     *
     * @param comment the new comment to update
     */
    onUpdateComment(comment) {
        console.log("Received onUpdateComment from server");
        console.log(comment);
        console.log("");

        // remove old comment and replace with the new updated comment
        const newComments = this.state.comments.filter(c => c.id !== comment.id);
        newComments.push(comment);
        console.log(newComments);
        // need to sort based on current sort settings
        this.setState({
            comments: newComments,
            serverResponse: {
                event: 'comment update',
                saved: true,
                reason: ''
            }
        });
    }

    /**
     * Tell server to remove this comment
     *
     * @param comment
     */
    deleteComment(comment) {
        console.log('deleteComment title=' + comment.title);
        // don't modify existing array, make a new one without id in it, treat comments as immutable
        // TODO: should just pass comment id?
        this.socket.emit('comment delete', comment);
    }

    /**
     * Server tells us to remove a comment
     *
     * @param comment
     */
    onDeleteComment(comment) {
        console.log('onDeleteComment title=' + comment.title);
        // TODO: should just pass comment id?
        const newComments = this.state.comments.filter(c => c.id !== comment.id);
        this.setState({
            comments: newComments
        });
    }



    /**
     * Server tells us there is an error
     * There would be a predefined error template the server will use for us to read,
     *
     * for example
     * { event: 'comment add', reason: 'server timeout' }
     *
     * @param error the error object sent from server
     */
    onError(error) {
        console.log("onError in client");
        console.log(error);

                // event type is captured, so top level will send it down to components who may need to display error message in their own specific way
        // each lower level component knows if error is for them by looking at saved === true and event.type === whatever event applies to them
        this.setState({
            serverResponse: {
                event: error.errorEvent,
                status: error.event,
                reason: error.reason
            }
        })
    }

    /**
     * Panel containing feed sort options
     */
    toggleFeedSettingControls() {
        this.setState({
            displayFeedSettingControls: !this.state.displayFeedSettingControls
        });
    }

    sort(sortSettings) {
        console.log("onSort");
        console.log(sortSettings);
        console.log("");

        // need to be in setState or not? sort is inplace right?
        this.state.comments.sort(sortSettings.comparator);
        this.setState({
            sortSettings: sortSettings
        });

    }



    getRenderedContent() {
        if (this.state.connected) {
            return (
                <div>
                    <CreateCommentButton
                        displayVoteForm={this.state.displayVoteForm}
                        toggleVoteForm={this.toggleVoteForm.bind(this)} />

                    {this.state.displayVoteForm ?
                        <CommentForm createComment={this.createComment.bind(this)}
                                     serverResponse={this.state.serverResponse}
                                     removeCommentSubmitStatus={this.removeCommentSubmitStatus.bind(this)} /> : null}

                    <FeedSettingActivator displayFeedSettingControls={this.state.displayFeedSettingControls}
                                          toggleFeedSettingControls={this.toggleFeedSettingControls.bind(this)} />

                    {this.state.displayFeedSettingControls ?
                        <FeedSettingControls sortSettings={this.state.sortSettings}
                                             sort={this.sort.bind(this)}/> : null}

                    <CommentList comments={this.state.comments}
                                 serverResponse={this.state.serverResponse}
                                 updateComment={this.updateComment.bind(this)}
                                 deleteComment={this.deleteComment.bind(this)} />
                </div>)
        } else {
            return (<div className="alert alert-dismissible margin-top-sm alert-warning" role="alert">
                <p><span className="glyphicon glyphicon-info-sign glyphicon-md margin-right-sm"> </span>
                    Comment feed is offline, please refresh page to try again</p>
            </div>)
        }
    }

    render() {
        console.log("CommentFeed render");
        return this.getRenderedContent()
    }

}

export default CommentFeed



