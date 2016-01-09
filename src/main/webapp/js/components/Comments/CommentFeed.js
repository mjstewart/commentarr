import React from 'react';
import Immutable from 'immutable';
import CreateCommentButton from './../CommentForm/CreateCommentButton';
import CommentForm from './../CommentForm/CommentForm';
import FeedSettingActivator from './../FeedSettings/FeedSettingActivator';
import FeedSettingControls from './../FeedSettings/FeedSettingControls';
import CommentList from './CommentList';
import Socket from '../../socket';
import NotificationBar from '../../notifications';

/**
 * Top most Component that stores all the state that the lower components react to.
 * Immutable js is used so keep that in mind when you see the same list/maps etc being reassigned to itself all the time.
 */
class CommentFeed extends React.Component {

    constructor(props) {
        super(props);
        this.notificationHandler = new NotificationBar();

        // keep entire feed state at top level, clojure script does this style, then state is passed down to everyone
        this.state = {
            comments: Immutable.List(),
            displayCreateCommentForm: false,

            /*
             * Defines how the feed is sorted
             */
            sortSettings: {
                field: 'voteCount',
                order: 'desc',
                comparator: (a, b) => b.voteCount - a.voteCount
            },

            // true if connected to web socket server
            connected: false,

            // flag used to provide reloading feedback to user if no comments were received due to database error
            // logic in error function requires this to start as true
            databaseOffline: true,

            /*
             * Encapsulates server response details used to provide user feedback.
             * status codes are [ok, waiting, error, timeout]
             *
             * event === '' means all children components will ignore the response and not output any feedback messages.
             * The object is not null so additional null checks are not needed, only simple event comparisons.
             *
             * Every object has event and status keys, extra keys are added depending on status code context
             * 'error' - reason
             * 'waiting' - timerId (so children components can cancel this timer id on server response)
             *
             * timestamp is to allow us tell the difference in state changes for example up voting a comment 3 times
             * in a row and being able to tell if the server has responded in order to synchronize the timing
             * of ui feedback status using mostly in CommentItem status.
             */
            serverResponse: {
                event: '',
                status: '',
                timestamp: ''
            },

            displayFeedSettingControls: false,

            // if filterName isn't null, every comment change is run through filter before being displayed in feed.
            commentFilter: {
                filterName: null,
                filterFn: null
            },

            /*
             * For efficiency reasons. When a filter is applied, current comments are cached for later when filter is
             * cleared to avoid contacting server again. As comment changes come in from server they are added to
             * the caches for later use. When filter is cleared, comments will equal cached comments minus deleted
             * comments, plus new comments with any existing comments updated.
             *
             * maps used to avoid looping through arrays when merge back happens as key=comment id, value=comment.
             */
            cachedComments: Immutable.List(),
            newCommentsForCache: Immutable.List(),
            updatedCommentsForCache: Immutable.Map(),
            deletedCommentIdForCache: Immutable.Set()
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
         *
         * Note, any change to event names will need to be changed in any component who uses the names to manipulate
         * user feedback.
         */
        socket.addListener('connect', this.onConnect.bind(this));
        socket.addListener('disconnect', this.onDisconnect.bind(this));
        socket.addListener('comment add', this.onAddComment.bind(this));
        socket.addListener('comment create', this.onCreateComment.bind(this));
        socket.addListener('comment update', this.onUpdateComment.bind(this));
        socket.addListener('comment delete', this.onDeleteComment.bind(this));
        socket.addListener('subscribe comments', this.onSubscribeComments.bind(this));
        socket.addListener('comment getAll', this.onGetAllComments.bind(this));
        socket.addListener('error', this.onError.bind(this));
    }

    /**
     * Called when web socket connects to server.
     */
    onConnect() {
        console.log("client onConnect() -> subscribing to comments");
        this.setState({
            connected: true,
            serverResponse: {
                event: 'subscribe comments',
                status: 'waiting'
            }
        });
        this.socket.emit('subscribe comments');
    }

    /**
     * Called when web socket disconnects from server.
     */
    onDisconnect() {
        console.log("client onDisconnect()");
        this.setState({
            connected: false,
            serverResponse: {
                event: '',
                status: '',
                timestamp: ''
            }
        });
    }

    /**
     * Request server to send us all the comments.
     */
    getAllComments() {
        this.setState({
            serverResponse: {
                event: 'comment getAll',
                status: 'waiting',
                timestamp: new Date()
            }
        });
        this.socket.emit('comment getAll');
    }

    /**
     * All the comments the server sent us.
     *
     * @param json
     */
    onGetAllComments(json) {
        console.log("onGetallComments");
        console.log(json);
        const commentArray = JSON.parse(json.comments);
        const immutableCommentList = Immutable.List(commentArray);

        console.log(immutableCommentList);

        this.setState({
            serverResponse: {
                event: 'comment getAll',
                status: 'ok',
                timestamp: new Date()
            },
            databaseOffline: false,
            comments: this.sort(immutableCommentList, this.state.sortSettings.comparator)
        });
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
        const immutableCommentList = Immutable.List(JSON.parse(json.comments));
        console.log(commentArray);


        this.setState({
            serverResponse: {
                event: 'subscribe comments',
                status: 'ok',
                timestamp: new Date()
            },
            databaseOffline: false,
            comments: this.sort(immutableCommentList, this.state.sortSettings.comparator)
        });
    }


    /**
     * Toggle vote form on and off
     */
    toggleCommentForm() {
        const status = this.state.serverResponse.status;
        const event = this.state.serverResponse.event;

        // don't clear waiting status otherwise other components waiting ui feedback will clear
        this.setState({
            displayCreateCommentForm: !this.state.displayCreateCommentForm,
            serverResponse: {
                event: status === "waiting" ? event : "",
                status: status === "waiting" ? "waiting" : ""
            },
            serverTimeoutTimerId: null
        });
    }

    /**
     * Removes the submit status box in the vote form which displays after comment has been submitted for user feedback.
     * By clearing the serverResponse state, any components feedback dependent on this state will be cleared.
     */
    removeCommentSubmitStatus() {
        console.log("removeCommentSubmitStatus");

        this.setState({
            serverResponse: {
                event: "",
                status: ""
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
                status: 'timeout',
                timestamp: new Date()
            }
        });
    }

    /**
     * Creates a new serverResponse object and removes any old timers that were in action due to waiting for the
     * server. Setting the status to 'ok' causes all lower level components interested in the event to display
     * success feedback if they need to.
     *
     * @param serverResponseEvent such as 'comment update' to be placed as the event property
     * @param commentId
     * @returns {{event: *, status: string, commentId: *, timestamp: Date}}
     */
    onServerReplySuccess(serverResponseEvent, commentId) {
        const serverResponse = {
            event: serverResponseEvent,
            status: 'ok',
            commentId: commentId,
            timestamp: new Date()
        };
        console.log("onUpdateComment hasOwnProperty");
        if (this.state.serverResponse.hasOwnProperty("timerId")) {
            // because we placed a small delay on issuing wait feedback, there will only be a timerId if the
            // server doesn't respond fast and goes into a waiting state.
            clearTimeout(this.state.serverResponse.timerId);
        }

        return serverResponse;
    }

    /**
     * This is purely to provide a nicer UI.
     * When the server is fast at responding nothing will show up in the waiting status, otherwise the waiting status
     * flashes up for an immediate server response which makes it a little ugly.
     *
     * If the status 1 second ago is still the same as it is when the call back timer
     * function is run, then we haven't heard back from the server so set the state to waiting which
     * causes the CommentItem to display waiting feedback. The state before the callback is invoked
     * is kept in beforeEvent/Status.
     *
     * The timestamp is used to handle the case where the user votes for the same comment consecutively.
     * Without the timestamp the serverResponse state would be the same even though the server successfully
     * responded which causes the waiting feedback to still display.
     *
     * @param serverResponseEvent for example, 'comment update'
     * @param commentId the commentId being actioned at the time'
     */
    applyWaitingFeedbackForEvent(serverResponseEvent, commentId) {
        const beforeEvent = this.state.serverResponse.event;
        const beforeStatus = this.state.serverResponse.status;
        const beforeTimestamp = this.state.serverResponse.timestamp;

        setTimeout(function() {
            // after 1 second this function will run, it checks before state with the state right now. If unchanged,
            // set the status to waiting which causes lower level components to apply waiting feedback.
            const {event} = this.state.serverResponse;
            const {status} = this.state.serverResponse;
            const {timestamp} = this.state.serverResponse;
            if (event === beforeEvent && status === beforeStatus && timestamp === beforeTimestamp) {
                /*
                 * timer provided so CommentItem can stop the timer if response from server is received
                 * the timer needs to be greater than database timeout so we can differentiate between the 2.
                 * commentId provided so the specific CommentItem shows the status, not every comment.
                 */
                this.setState({
                    serverResponse: {
                        event: serverResponseEvent,
                        status: 'waiting',
                        commentId: commentId,
                        timerId: setTimeout(() => this.onServerTimeout(serverResponseEvent), 20000),
                        timestamp: new Date()
                    }
                });
            }
        }.bind(this), 1000);
    }


    /**
     * Inform user on comment submit status by changing the serverResponse state which the CommentForm looks at to
     * derive submit status.
     *
     * @param serverResponse the json response object from the server.
     */
    onCreateComment(serverResponse) {
        console.log("onCreateComment");
        console.log(serverResponse);
        this.setState({
            serverResponse: this.onServerReplySuccess("comment create", serverResponse.commentId)
        });

    }

    /**
     * Sends new comment to the server and sets up waiting state for user feedback
     *
     * @param comment the new comment to save
     */
    createComment(comment) {
        console.log("in createComment");
        this.socket.emit('comment create', comment);

        // timer provided so child components can stop the timer if response from server is received
        // note for timer, it needs to be greater than database timeout so we can differentiate between the 2.

        this.applyWaitingFeedbackForEvent("comment create", "null")
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

        if (this.state.commentFilter.filterName == null) {
            // the addCommentCache isn't created here as initial state sets it up and is recreated every time the
            // filter is cleared
            this.setState({
                comments: this.filterAndSort(
                    this.state.comments.push(comment),
                    this.state.sortSettings.comparator,
                    this.state.commentFilter.filterFn),
                timestamp: new Date()
            });
        } else {
            // filter is on, cache the deleted comment so it can be merged back when filter is removed.
            // a new Immutable.List is created with the new comment added, then filtered and sorted again so all client
            // views see the new comment in whatever sort/filter settings they have on.
            this.setState({
                comments: this.filterAndSort(
                    this.state.comments.push(comment),
                    this.state.sortSettings.comparator,
                    this.state.commentFilter.filterFn),
                newCommentsForCache: this.state.newCommentsForCache.push(comment),
                timestamp: new Date()
            });
        }

        const message = `1 new comment by \'${comment.author}\'`;
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
     * @param comment the updated comment
     * @param field the field being updated so specific ui feedback can be provided on success/error. This feature
     * is to eliminate having many update functions purely used to identity which field is being updated.
     */
    updateComment(comment, field) {
        console.log("updateComment");

        const data = {
            updateField: field,
            comment: comment
        };

        this.socket.emit('comment update', data);
        this.applyWaitingFeedbackForEvent("comment update", comment.id);
    }

    /**
     * Server tells us to update a comment
     *
     * @param data json object containing event and comment keys
     */
    onUpdateComment(data) {
        console.log("Received onUpdateComment from server");
        const comment = JSON.parse(data.comment);

        // remove old comment and replace with the new updated comment
        let newComments = this.state.comments.filter(c => c.id !== comment.id);
        newComments = newComments.push(comment);
        newComments = this.filterAndSort(newComments, this.state.sortSettings.comparator, this.state.commentFilter.filterFn);

        const serverResponse = this.onServerReplySuccess("comment update", comment.id);

        if (this.state.commentFilter.filterName == null) {
            // the updateCache isn't created here as initial state sets it up and is recreated every time filter is cleared
            this.setState({
                comments: newComments,
                serverResponse: serverResponse
            });
        } else {
            // filter is on, cache the deleted comment so it can be merged back when filter is removed.
            this.setState({
                comments: newComments,
                serverResponse: serverResponse,
                updatedCommentsForCache: this.state.updatedCommentsForCache.set(comment.id, comment)
            });
        }

        const message = `+1 updated comment with \'title ${comment.title}\'`;
        this.notificationHandler.showNotification(message);
    }

    /**
     * Tell server to remove this comment.
     *
     * The full comment is sent because morphia is used on the server which converts json comment into Comment domain
     * object and applies delete that way.
     *
     * @param comment the comment to delete
     */
    deleteComment(comment) {
        console.log('deleteComment title=' + comment.title);
        this.socket.emit('comment delete', comment);
        this.applyWaitingFeedbackForEvent("comment delete", comment.id);
    }

    /**
     * Server tells us to remove a comment
     *
     * @param json object containing event and commentId keys
     */
    onDeleteComment(json) {
        console.log("onDeleteComment");
        const commentId = json.commentId;
        console.log(commentId);

        const newCommentsAfterDelete = this.state.comments.filter(c => c.id !== commentId);
        const comments = this.filterAndSort(newCommentsAfterDelete,
            this.state.sortSettings.comparator, this.state.commentFilter.filterFn);

        const serverResponse = this.onServerReplySuccess("comment delete", commentId);

        if (this.state.commentFilter.filterName == null) {
            // the deleteCache isn't created here as initial state sets it up and is recreated every time filter is cleared
            this.setState({
                comments: comments,
                serverResponse: serverResponse
            });
        } else {
            // filter is on, cache the deleted comment so it can be merged back when filter is removed.
            this.setState({
                comments: comments,
                deletedCommentIdForCache: this.state.deletedCommentIdForCache.add(commentId),
                serverResponse: serverResponse
            });
        }

        const message = `+1 comment has been deleted`;
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
     * { event: 'comment add' errorEvent: 'database offline', status: 'error' reason: 'server timeout', commentId: 'abc' }
     *
     * The commentId field may not have any value, the server sends it to identify what record was being modified
     * if it was update or delete and the ui uses it to identify the CommentItem to show feedback errors on,
     * but since there are other actions like get all / subscribe, the commentId isn't applicable.
     *
     * @param error the error object sent from server
     */
    onError(error) {
        console.log("onError in client");
        console.log(error);

        if (typeof error !== "undefined") {
            if (error.performingAction === "comment update" || error.performingAction === "comment delete") {
                // server will include a commentId field for these events.
                this.setState({
                    serverResponse: {
                        event: error.performingAction,
                        errorEvent: error.errorEvent,
                        status: error.event,
                        reason: error.reason,
                        commentId: error.commentId,
                        timestamp: new Date()
                    },
                    databaseOffline: (this.state.databaseOffline
                    && error.errorEvent === "database offline")
                });
            } else {
                this.setState({
                    serverResponse: {
                        event: error.performingAction,
                        errorEvent: error.errorEvent,
                        status: error.event,
                        reason: error.reason,
                        timestamp: new Date()
                    },
                    databaseOffline: (this.state.databaseOffline
                    && error.errorEvent === "database offline")
                });
            }
        }
    }

    /**
     * Panel containing feed settings for sorting etc
     */
    toggleFeedSettingControls() {
        this.setState({
            displayFeedSettingControls: !this.state.displayFeedSettingControls
        });
    }

    /**
     * Sorts comments according to the new criteria and applies any existing filters.
     *
     * @param newSortSettings the new sorting criteria to apply
     */
    onSortChange(newSortSettings) {
        console.log("onSortChange");
        console.log(newSortSettings);
        console.log("");

        const comments = this.filterAndSort(this.state.comments, newSortSettings.comparator, this.state.commentFilter.filterFn);
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
     * @param comments Immutable.List of the comments to sort
     * @param comparatorFn how to sort the comments
     * @returns a sorted Immutable.List
     */
    sort(comments, comparatorFn) {
        console.log("sort");
        console.log(comments);
        return comments.sort(comparatorFn);
    }

    /**
     * The supplied comments list is returned if filterFn is null, otherwise the supplied filterFn is used
     * to generate and return a new Immutable.List.
     *
     * @param comments Immutable.List of the comments to filter
     * @param filterFn the predicate to filter by
     * @returns a filtered Immutable.List
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
     * @returns final Immutable.List comments array
     */
    filterAndSort(comments, comparatorFn, filterFn) {
        console.log("filterAndSort");
        return this.sort(this.filterComments(comments, filterFn), comparatorFn);
    }

    /**
     * Applies filter on comment array and sorts it based on existing sort settings.
     * If a filter is already applied, the comment list is rebuilt based on the caches and the filter is reapplied
     * on the entire new comments.
     *
     * @param commentFilter the commentFilter object containing the filtering name and predicate
     */
    setCommentFilter(commentFilter) {
        if (this.state.commentFilter.filterName === null) {
            // no filter on, store cached comments so when filter is off again original comments can be restored
            const cachedComments = Immutable.List(this.state.comments);
            this.setState({
                cachedComments: cachedComments,
                comments: this.filterAndSort(this.state.comments, this.state.sortSettings.comparator, commentFilter.filterFn),
                commentFilter: commentFilter
            });
        } else {
            // acts as the new comments that filter will be run on
            let rebuiltComments = this.rebuildCommentsFromCache.bind(this)();

            // before filtering, create a new cache
            let newCommentCache = Immutable.List(rebuiltComments);

            this.setState({
                cachedComments: newCommentCache,
                comments: this.filterAndSort(rebuiltComments, this.state.sortSettings.comparator, commentFilter.filterFn),
                commentFilter: commentFilter
            });
        }
    }

    clearCommentFilter() {
        console.log("clearCommentFilter");
        // ensure no commentFilter.filterFn is applied as the goal is to get ALL the latest comments back
        let rebuiltComments = this.filterAndSort(
            this.rebuildCommentsFromCache.bind(this)(),
            this.state.sortSettings.comparator,
            null);

        this.setState({
            comments: rebuiltComments,
            commentFilter: {
                filterName: null,
                filterFn: null
            },

            cachedComments: Immutable.List(),
            newCommentsForCache: Immutable.List(),
            updatedCommentsForCache: Immutable.Map(),
            deletedCommentIdForCache: Immutable.Set()
        });
    }

    /**
     * Using the various caches kept whilst any filters are applied, the comments list is rebuilt. The caches
     * are used to avoid having to recontact the server to retrieve all the comments again.
     *
     * The cachedComments contains all comments prior to any filters being applied.
     * The new comment list will contain any updated and new comments. Deleted comments will be removed.
     *
     * Implementation note: cant use sets as js sets compare objects by reference, not like java where you can
     * define custom compareTo.
     *
     * @returns the rebuilt comments Immutable.List
     */
    rebuildCommentsFromCache() {
        console.log("rebuildCommentsFromCache");
        let rebuiltComments = Immutable.List();
        /*
         * go through the cached comments (all comments prior to filter being applied),
         * if its not in deleted map, check if there has been an update for the comment,
         * if so add updated version otherwise it hasn't changed so just add the comment as it was in cached version.
         */
        this.state.cachedComments.forEach(comment => {
            if (!this.state.deletedCommentIdForCache.has(comment.id)) {
                const updatedComment = this.state.updatedCommentsForCache.get(comment.id);
                if (updatedComment === undefined) {
                    rebuiltComments = rebuiltComments.push(comment);
                } else {
                    rebuiltComments = rebuiltComments.push(updatedComment);
                }
            }
        });

        console.log("rebuild");
        console.log(rebuiltComments);

        // lastly, add any new comments
        this.state.newCommentsForCache.forEach(comment => {
            rebuiltComments = rebuiltComments.push(comment);
        });

        return rebuiltComments;
    }



    getRenderedContent() {
        if (this.state.connected) {
            return (
                <div>
                    <CreateCommentButton
                        displayCreateCommentForm={this.state.displayCreateCommentForm}
                        toggleCommentForm={this.toggleCommentForm.bind(this)}
                        serverResponse={this.state.serverResponse}/>

                    {this.state.displayCreateCommentForm ?
                        <CommentForm createComment={this.createComment.bind(this)}
                                     serverResponse={this.state.serverResponse}
                                     removeCommentSubmitStatus={this.removeCommentSubmitStatus.bind(this)} /> : null}

                    <FeedSettingActivator displayFeedSettingControls={this.state.displayFeedSettingControls}
                                          toggleFeedSettingControls={this.toggleFeedSettingControls.bind(this)} />

                    {this.state.displayFeedSettingControls ?
                        <FeedSettingControls sortSettings={this.state.sortSettings}
                                             commentFilter={this.state.commentFilter}
                                             onSortChange={this.onSortChange.bind(this)}
                                             setCommentFilter={this.setCommentFilter.bind(this)}
                                             clearCommentFilter={this.clearCommentFilter.bind(this)}
                                             comments={this.state.comments}/> : null
                    }

                    <CommentList comments={this.state.comments}
                                 serverResponse={this.state.serverResponse}
                                 updateComment={this.updateComment.bind(this)}
                                 deleteComment={this.deleteComment.bind(this)}
                                 getAllComments={this.getAllComments.bind(this)}
                                 databaseOffline={this.state.databaseOffline}/>
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

export default CommentFeed;



