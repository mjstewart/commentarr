import React from 'react';

class FadingStatusMessage extends React.Component {
    componentDidMount() {
       setTimeout(() => this.refs.alertBox.className = 'hide', 7000);
    }

    render() {
        let css = `alert ${this.props.cssAlertType} smaller-alert with-fadeout`;
        console.log("FadingStatusMessage css=");
        console.log(css);
        return (
            <div className={css} role="alert" ref="alertBox">
                <p><strong>{this.props.title}</strong> {this.props.message}</p>
            </div>
        )
    }
}

FadingStatusMessage.propTypes = {
    title: React.PropTypes.string.isRequired,
    message: React.PropTypes.string.isRequired,
    cssAlertType: React.PropTypes.string.isRequired,
};

export default FadingStatusMessage;

