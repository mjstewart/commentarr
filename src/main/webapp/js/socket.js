import {EventEmitter} from 'events';

/**
 * Exposes a simpler interface for client
 */
class Socket {
    constructor(url) {
        let ws = this.ws = new WebSocket(url);
        this.ee = new EventEmitter();

        // without bind, these functions wont be able to refer to 'this' instance (no longer using React.createClass)
        ws.onopen = this.onOpen.bind(this);
        ws.onmessage = this.onMessage.bind(this);
        ws.onclose = this.onClose.bind(this);
        ws.onerror = this.onError.bind(this);
    }

    // Adds a listener to the end of the listeners array for the specified event
    addListener(event, listener) {
        this.ee.addListener(event, listener);
    }

    // removes the event name and handler
    removeListener(event, listener) {
        this.ee.removeListener(event, listener);
    }

    /**
     * Sends event and data as a JSON String to server endpoint.
     * The server uses the event to determine how to 'route/handle the request
     *
     * If there are errors on the server, the server will send back event type of 'error' with data payload containing
     * the reason which is handled in onMessage.
     *
     * @param event
     * @param data
     * @param meta any additional information related to the type of event being processed such as field being updated.
     */
    emit(event, data = null) {
        let message = (data === null) ? JSON.stringify({event}) : JSON.stringify({event, data});
        console.log("socket.js emit to serverr");
        console.log(message);
        this.ws.send(message);
    }

    // emit basically delegates to whatever listener registered in CommentFeed
    onOpen() {
        console.log("client onOpen");
        this.ee.emit('connect');
    }

    onClose() {
        console.log("client onClose");
        // alert("client onclose");
        this.ee.emit('disconnect');
    }

    onError() {
        console.log("client onError");
        this.ee.emit('error');
    }

    /**
     * The server sends us back a message, which we receive in and handle here.
     *
     * @param event
     */
    onMessage(event) {
        try {
            console.log("socket.js onMessage -> received message from server - emitting to event handler");
            console.log(event);
            const data = JSON.parse(event.data);

            // data.event is used to lookup which registered listener to call
            this.ee.emit(data.event, data);
        } catch (error) {
            this.ee.emit('error', error);
        }
    }
}

export default Socket;