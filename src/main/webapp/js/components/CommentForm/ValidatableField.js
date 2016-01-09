import React from 'react';

/**
 * Encapsulates a fields validation styles
 */
class ValidatableField extends React.Component {

    render() {
        // if true, don't display any error feedback for the field.
        const isValid = this.props.errorMessage === '';

        return (
            <div className={isValid ? "form-group has-feedback" : "form-group has-error has-feedback"}>
                <label className="control-label" htmlFor={this.props.id}>{this.props.label}</label>
                {this.props.type === "textarea" ? (
                    <textarea className="form-control" id={this.props.id}
                              placeholder={this.props.placeholder} onClick={this.props.onClick}
                              onChange={this.props.onChange} value={this.props.value}/>
                ) : (
                    <input type={this.props.type} className="form-control" id={this.props.id}
                           placeholder={this.props.placeholder} onClick={this.props.onClick}
                           onChange={this.props.onChange} value={this.props.value} autoFocus={this.props.autoFocus}/>
                )}

              <span className={isValid ? "hidden" :
              "glyphicon glyphicon-remove form-control-feedback"} aria-hidden="true"> </span>

                <span id={this.props.id + "Help"} className={isValid ? "hidden" : "help-block"}>
                    {this.props.errorMessage}</span>
            </div>
        )
    }
}


ValidatableField.propTypes = {
    label: React.PropTypes.string.isRequired,
    autoFocus: React.PropTypes.bool,
    id: React.PropTypes.string.isRequired,
    type: React.PropTypes.string.isRequired,
    placeholder: React.PropTypes.string.isRequired,
    value: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func.isRequired,
    errorMessage: React.PropTypes.string.isRequired,
    onClick: React.PropTypes.func
};

ValidatableField.defaultProps = {
    autoFocus: false
};

export default ValidatableField;


