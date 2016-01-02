import React from 'react';

class FadingStatusMessage extends React.Component {
    componentDidMount() {
        setTimeout(() => this.refs.alertBox.className = 'hide', 5000);
    }

    render() {
        let css = `alert ${this.props.cssAlertType} margin-all-md with-fadeout`;

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

export default FadingStatusMessage

