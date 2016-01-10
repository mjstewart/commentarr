import React from 'react';

class FadingStatusMessage extends React.Component {

    constructor() {
        super();
        console.log("FadingStatusMessage constructor");
        this.state = {
            display: true,
            timerId: setTimeout(() => this.setState({display: false}), 3000)
        };
    }

    /**
     * Not called for the first render
     *
     * @param nextProps
     */
    componentWillReceiveProps(nextProps) {
        console.log("FadingStatusMessage componentWillReceiveProps");
        clearTimeout(this.state.timerId);

        this.setState({
            display: true,
            timerId: setTimeout(() => this.setState({display: false}), 3000)
        });
    }


    render() {
        console.log("FadingStatusMessage render");


        let content;
        if (this.state.display) {
            console.log("FadingStatusMessage display is true");
            content = (
                <div className="alert alert-success smaller-alert with-fadeout" role="alert">
                    <p><span className="glyphicon glyphicon-ok margin-right-xs"></span>
                        Thanks, we've recorded your report</p>
                </div>
            )
        } else {
            console.log("FadingStatusMessage display is false");
            content = null;
        }

        return <div>{content}</div>
    }
}

FadingStatusMessage.propTypes = {
    //message: React.PropTypes.string.isRequired,
    //cssAlertType: React.PropTypes.string.isRequired
};

export default FadingStatusMessage;

