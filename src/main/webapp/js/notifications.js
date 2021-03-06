import $ from 'jquery';

/**
 * Notification bar that slides up and down on any new comment activity.
 */
class NotificationBar {
    constructor() {
        this.notifications = [];
        this.notifyDiv = $("#notification-bar");
        this.notificationMessage = $("#notification-message");
        this.displaying = false;
        this.timerId = null;
        this.timeoutMs = 2000;
    }

    showNotification(message) {
        if (this.displaying) {
            this.notificationMessage.text(message);
            this.onAlreadyDisplaying();
            this.resetTimer();
        } else {
            this.notificationMessage.text(message);
            this.addCssClass("animated slideInDown");
            this.resetTimer();
            this.displaying = true;
        }
    }

    onAlreadyDisplaying() {
        this.addCssClass("animated bounce");
        // once done, slide bar back up, if more updates comee it stops bar going up as per first line.
        this.notifyDiv.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
            () => this.notifyDiv.addClass("slideOutUp"));


    }

    addCssClass(css) {
        this.notifyDiv.removeClass();
        this.notifyDiv.addClass(css);
    }

    /**
     * Clears current timer and creates a new one so the notification bar doesn't disappear when there are
     * many incoming notifications. When notifications end, the notification bar will go away.
     */
    resetTimer() {
        clearTimeout(this.timerId);
        this.timerId = setTimeout(() => {
            // remove all classes and slide bar back up
            this.addCssClass("animated slideOutUp");
            this.displaying = false;
        }, this.timeoutMs);
    }

}

export default NotificationBar;