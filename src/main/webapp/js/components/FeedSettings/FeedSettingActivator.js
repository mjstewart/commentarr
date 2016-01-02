import React from 'react'

class FeedSettingsActivator extends React.Component {
    render() {
       // console.log("FeedSettingsActivator render");
        return (
            <div className="well well-sm margin-top-sm">
                <h4 className="inline-default margin-left-sm hoverable-cursor"
                    onClick={this.props.toggleFeedSettingControls}>
              <span className={this.props.displayFeedSettingControls ? "glyphicon glyphicon-menu-up"
              : "glyphicon glyphicon-menu-down"}> </span> Settings</h4>
            </div>
        )
    }
}

FeedSettingsActivator.propTypes = {
    displayFeedSettingControls: React.PropTypes.bool.isRequired,
    toggleFeedSettingControls: React.PropTypes.func.isRequired
};

export default FeedSettingsActivator


