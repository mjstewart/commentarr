import React from 'react'

class FeedSettingsActivator extends React.Component {

    createMenuTitle() {
        let menuDirectionCss = this.props.displayFeedSettingControls
            ? "glyphicon glyphicon-menu-up" : "glyphicon glyphicon-menu-down";
        return (<div>
            <span className={menuDirectionCss}> </span>
            <span className="margin-left-xs">Settings</span>
            <span className="margin-left-xs glyphicon glyphicon-cog"></span>
        </div>)
    }

    render() {
        return (
            <div className="well well-sm margin-top-sm">
                <h4 className="inline-default margin-left-sm hoverable-cursor"
                    onClick={this.props.toggleFeedSettingControls}>
                    {this.createMenuTitle()}
                </h4>
            </div>
        )
    }
}

FeedSettingsActivator.propTypes = {
    displayFeedSettingControls: React.PropTypes.bool.isRequired,
    toggleFeedSettingControls: React.PropTypes.func.isRequired
};

export default FeedSettingsActivator


