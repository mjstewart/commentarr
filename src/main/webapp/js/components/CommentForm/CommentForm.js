import React from 'react';
import ValidatableField from './ValidatableField';
import SubmitStatus from './SubmitStatus';

class CommentForm extends React.Component {
    constructor(props) {
        super(props);

        const validationErrors = new Map();
        validationErrors.set('author', '');
        validationErrors.set('title', '');
        validationErrors.set('message', '');

        this.state = {
            author: '',
            title: '',
            message: '',

            validationErrors: validationErrors
        }
    }

    componentWillReceiveProps(nextProps) {
        console.log("CommmentForm componentWillReceiveProps");
        console.log(this.props.serverResponse);
        console.log(nextProps);

        if (nextProps.serverResponse.status === 'error') {
            // prevents timeout error from displaying after error is displayed
            clearTimeout(this.props.serverResponse.timerId);
        } else if (this.props.serverResponse.status === 'waiting') {
            if (nextProps.serverResponse.status === 'ok') {
                // successful save so clear timer and clear form ready for next submission
                console.log("Was waiting for server but now heard back with a status of OK, clearing timer");
                clearTimeout(this.props.serverResponse.timerId);
                this.clearForm();
            }
        }
    }

    handleInput(field) {
        return function(e) {
            this.setState({
                [`${field}`]: e.target.value
            });
        }.bind(this);
    }

    clearForm() {
        this.setState({
            author: '',
            title: '',
            message: ''
        });
    }

    missingFieldRule(input, field) {
        return (input === '') ? `${field} is missing` : '';
    }

    characterLimitRule(input, limit) {
        return (input.length > limit) ? `Character limit exceeded, max is ${limit}` : '';
    }

    validateAuthor() {
        // when property and variable names are the name, this is a shortcut
        const {author} = this.state;
        const errors = [];
        errors.push(this.missingFieldRule(author, 'Author'));
        errors.push(this.characterLimitRule(author, 25));

        // if no errors, empty array returned, otherwise only return first error
        let filtered = errors.filter(error => error !== '');
        return (filtered.length === 0) ? '' : filtered[0];
    }

    validateTitle() {
        // when property and variable names are the name, this is a shortcut
        const {title} = this.state;
        const errors = [];
        errors.push(this.missingFieldRule(title, 'Title'));
        errors.push(this.characterLimitRule(title, 100));

        // if no errors, empty array returned, otherwise only return first error
        let filtered = errors.filter(error => error !== '');
        return (filtered.length === 0) ? '' : filtered[0];
    }

    validateMessage() {
        // when property and variable names are the name, this is a shortcut
        const {message} = this.state;
        const errors = [];
        errors.push(this.missingFieldRule(message, 'Message'));
        errors.push(this.characterLimitRule(message, 250));

        // if no errors, empty array returned, otherwise only return first error
        let filtered = errors.filter(error => error !== '');
        return (filtered.length === 0) ? '' : filtered[0];
    }

    /**
     * Validate fields and submit to server if valid
     *
     * @param e
     */
    onSubmit(e) {
        e.preventDefault();

        const validationErrors = new Map();
        validationErrors.set('author', this.validateAuthor());
        validationErrors.set('title', this.validateTitle());
        validationErrors.set('message', this.validateMessage());

        let hasErrors;
        for (let value of validationErrors.values()) {
            if (value !== '') {
                hasErrors = true;
                break;
            }
        }

        if (!hasErrors) {
            const now = new Date();
            const comment = {
                author: this.state.author,
                title: this.state.title,
                message: this.state.message,
                voteCount: 0,
                reports: 0,
                dateCreated: now,
                dateLastUpdated: now
            };
            this.props.createComment(comment);
        }

        // validationError empty values causes no validation css to appear, else still display errors
        this.setState({
            validationErrors: validationErrors
        });
    }


    render() {
        console.log("CommentForm render");

        return (
            <form className="well well-sm margin-top-sm">
                <ValidatableField label="Author" id="authorInput" type="text" placeholder="Author"
                                  value={this.state.author}
                                  onChange={this.handleInput("author").bind(this)}
                                  onClick={this.props.serverResponse.event === ''
                                  ? null : this.props.removeCommentSubmitStatus}
                                  errorMessage={this.state.validationErrors.get('author')}
                                  autoFocus={true}/>

                <ValidatableField label="Title" id="titleInput" type="text" placeholder="Title"
                                  value={this.state.title}
                                  onChange={this.handleInput("title").bind(this)}
                                  onClick={this.props.serverResponse.event === ''
                                  ? null : this.props.removeCommentSubmitStatus}
                                  errorMessage={this.state.validationErrors.get('title')}/>

                <ValidatableField label="Message" id="messageInput" type="textarea" placeholder="Type in your vote message"
                                  value={this.state.message}
                                  onChange={this.handleInput("message").bind(this)}
                                  onClick={this.props.serverResponse.event === ''
                                  ? null : this.props.removeCommentSubmitStatus}
                                  errorMessage={this.state.validationErrors.get('message')}/>

                <button type="submit" className="btn btn-primary center-block core-heading" onClick={this.onSubmit.bind(this)}>Submit</button>

                <SubmitStatus serverResponse={this.props.serverResponse} removeCommentSubmitStatus={this.props.removeCommentSubmitStatus} />
            </form>
        )
    }
}

export default CommentForm

CommentForm.propTypes = {
    createComment: React.PropTypes.func.isRequired,
    removeCommentSubmitStatus: React.PropTypes.func.isRequired,
    serverResponse: React.PropTypes.object,
};



