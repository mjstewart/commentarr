import React from 'react';
import CreateCommentButton from './../CreateCommentButton';
import CommentForm from './../CommentForm/CommentForm';
import FeedSettingActivator from './../FeedSettings/FeedSettingActivator';
import FeedSettingControls from './../FeedSettings/FeedSettingControls';
import CommentList from './CommentList';
import Socket from '../../socket';
import NotificationBar from '../Home/notifications';

class CommentFeed extends React.Component {

    constructor(props) {
        super(props);
        this.notificationHandler = new NotificationBar();

        // keep entire feed state at top level, clojure script does this style, then state is passed down to everyone
        this.state = {
            comments: [],
            displayVoteForm: false,

            sortSettings: {
                field: 'voteCount',
                order: 'desc',
                comparator: (a, b) => b.voteCount - a.voteCount
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

            displayFeedSettingControls: false,

            // if not null, every comment change is run through filter before being displayed in feed.
            commentFilterFn: null,

            /*
             * For efficiency reasons. When a filter is applied, current comments are cached for later when filter is
             * cleared to avoid contacting server again. 3 other arrays are kept which act as pending updates to
             * apply. When filter is cleared, comments will equal cached comments minus deleted comments, plus
             * new comments with any existing comments being updated.
             */
            cachedComments: [],
            newCommentsForCache: [],
            updatedCommentsForCache: [],
            deletedCommentsForCache: []
        }
    }

    componentDidMount() {
        this.notificationHandler.showNotification("Welcome :), this is where you'll see any new activity");

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
        const commentArray = JSON.parse(json.comments);
        console.log(commentArray);
        console.log(typeof commentArray[0].dateCreated === 'number');
        this.setState({
            comments: this.sort(commentArray, this.state.sortSettings.comparator)
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
        console.log("removeCommentSubmitStatus");
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
            }
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
     * Server tells us to add comment.
     * comment collection is kept immutable, so a new array is made containing the new comment.
     *
     * @param json json string containing event and comment keys.
     */
    onAddComment(json) {
        console.log("Received comment from server");
        console.log(json);
        const comment = JSON.parse(json.comment);
        const comments = this.state.comments.concat([comment]);

        if (this.state.commentFilterFn == null) {
            this.setState({
                comments: this.filterAndSort(comments, this.state.sortSettings.comparator, this.state.commentFilterFn)
            });
        } else {
            this.setState({
                comments: this.filterAndSort(comments, this.state.sortSettings.comparator, this.state.commentFilterFn),
                newCommentsForCache: this.state.newCommentsForCache.concat([comment])
            });
        }

        const message = `1 new comment by ${comment.author}`;
        this.notificationHandler.showNotification(message);
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
        console.log(comment);
        const data = {
            updateField: field,
            comment: comment
        };
        console.log(data);
        this.socket.emit('comment update', data);
    }

    /**
     * Server tells us to update a comment
     *
     * @param data json object containing event and comment keys
     */
    onUpdateComment(data) {
        console.log("Received onUpdateComment from server");
        const comment = JSON.parse(data.comment);
        console.log(comment);
        console.log("");

        // remove old comment and replace with the new updated comment
        let newComments = this.state.comments.filter(c => c.id !== comment.id);
        newComments.push(comment);
        newComments = this.filterAndSort(newComments, this.state.sortSettings.comparator, this.state.commentFilterFn);

        if (this.state.commentFilterFn == null) {
            this.setState({
                comments: newComments
            });
        } else {
            this.setState({
                comments: newComments,
                updatedCommentsForCache: this.state.updatedCommentsForCache.concat([comment])
            });
        }

        const message = `+1 updated comment with \'title ${comment.title}\'`;
        this.notificationHandler.showNotification(message);

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
            comments: this.filterAndSort(newComments, this.state.sortSettings.comparator, this.state.commentFilterFn)
        });

        if (this.state.commentFilterFn == null) {
            this.setState({
                comments: newComments
            });
        } else {
            this.setState({
                comments: newComments,
                deletedCommentsForCache: this.state.deletedCommentsForCache.concat([comment])
            });
        }

        const message = `+1 comment deleted with \'title ${comment.title}\'`;
        this.notificationHandler.showNotification(message);
    }



    /**
     * Server tells us there is an error
     *
     * event type is captured, so top level will send it down to components who may need to display error message
     * in their own specific way. Each lower level component knows if error is for them by looking at the event and
     * event status keys.
     *
     * Example json format
     * { event: 'comment add' status: 'error' reason: 'server timeout' }
     *
     * @param error the error object sent from server
     */
    onError(error) {
        console.log("onError in client");

        this.setState({
            serverResponse: {
                event: error.errorEvent,
                status: error.event,
                reason: error.reason
            }
        });
    }

    /**
     * Panel containing feed sort options
     */
    toggleFeedSettingControls() {
        this.setState({
            displayFeedSettingControls: !this.state.displayFeedSettingControls
        });
    }

    /**
     * Sorts comments according to new criteria and runs and filters over the comments if any exist.
     *
     * @param newSortSettings the new sorting criteria to apply
     */
    onSortChange(newSortSettings) {
        console.log("onSortChange");
        console.log(newSortSettings);
        console.log("");

        const comments = this.filterAndSort(this.state.comments, newSortSettings.comparator, this.state.commentFilterFn);
        console.log("back in onSortChange after filterAndSort");
        console.log(comments);
        this.setState({
            comments: comments,
            sortSettings: newSortSettings
        });
    }

    /**
     * Sorts comments according to comparatorFn.
     * The comment array is sorted in place, but we return a reference to the same comments array.
     *
     * @param comments the comments to sort
     * @param comparatorFn how to sort the comments
     * @returns the sorted array
     */
    sort(comments, comparatorFn) {
        console.log("sort");
        console.log(comments);
        return comments.sort(comparatorFn);
    }

    /**
     * A new comments array is returned if commentFilterFn is not null, otherwise supplied comment array is returned
     * so null doesn't need to be handled.
     *
     * @param comments the comments to filter
     * @param filterFn how to filter the comments
     * @returns the filtered comments if commentFilterFn is not null, otherwise supplied comments are returned.
     */
    filterComments(comments, filterFn) {
        console.log("filterComments");
        return (filterFn === null) ? comments : comments.filter(filterFn);
    }

    /**
     * All functions processing a comment state change should call this function to ensure comment feed is
     * in the correct format according to user settings.
     *
     * @param comments the comments to filter and sort
     * @param comparatorFn how to sort the comments
     * @param filterFn how to filter the comments
     * @returns final comments array
     */
    filterAndSort(comments, comparatorFn, filterFn) {
        console.log("filterAndSort");
        return this.sort(this.filterComments(comments, filterFn), comparatorFn);
    }

    /**
     * Sets the new comment filter as well apply filter and existing sorting settings to existing comments.
     * Every new incoming comment will be run through filter if commentFilterFn is not null.
     *
     * @param filterFn the fn to filter comments by
     */
    setCommentFilter(filterFn) {
        this.setState({
            comments: this.filterAndSort(this.state.comments, this.state.sortSettings.comparator, filterFn),
            commentFilterFn: filterFn
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
                                             filterFn={this.state.commentFilterFn}
                                             onSortChange={this.onSortChange.bind(this)}
                                             setCommentFilter={this.setCommentFilter.bind(this)}/> : null
                    }

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



