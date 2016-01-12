import React from 'react';
import {SimpleSelect} from 'react-selectize';
import moment from 'moment';
import CommentUtil from '../utils';

/**
 * Uses react-selectize to create a searchable drop down list of authors to search for.
 * http://furqanzafar.github.io/react-selectize/#/?category=multi
 *
 */
class AuthorFilterSelector extends React.Component {
    constructor(props) {
        super(props);

    }

    /**
     * Given an Immutable.List of comments for a given author, return the time ago since last recent comment created.
     *
     * @param comments the Immutable.List of comments
     */
    getTimeAgoSinceLastCreatedComment(comments) {
        const sorted = comments.sort((a, b) => -(a.dateCreated - b.dateCreated));
        return (moment(sorted.first().dateCreated).fromNow());
    }

    /**
     * Group comments by author to produce a map containing author->list of comment objects.
     * map then takes the values of each author which is the list of comments they created and returns an
     * option object with the relevant properties that will be used in the ui.
     *
     * @returns an array of option objects
     */
    getOptions() {
        return this.props.comments
            .groupBy(comment => comment.author)
            .map(v => {
                return {label: v.first().author, value: v.first().author,
                    totalComments: v.size,
                    timeAgoSinceLastCreatedComment: this.getTimeAgoSinceLastCreatedComment(v)}
            }).toArray();
    }

    /**
     * Creates the SimpleSelect component rather than have it all in render()
     * @returns the SimpleSelector to render
     */
    createSimpleSelector() {
        const options = this.getOptions.bind(this)();

        return (<div className="control react-selectize simple-select">
            <SimpleSelect
                ref = "select"
                placeholder ="Type in an author name"
                options = {options}
                disabled={this.props.disabled}

                // option object {label, value, totalComments, timeAgoSinceLastCreatedComment}
                onValueChange = {function(optionObject, callback) {
                        console.log("onValueChange");
                        console.log(optionObject);

                        {this.props.setCommentFilter({
                            filterName: "authorName",
                            filterFn: function(comment) {
                                return comment.author === optionObject.value;
                            }
                        })}
                        // must always invoke - https://github.com/furqanZafar/react-selectize
                        callback();
                        console.log("endOnValueChange");
                    }.bind(this)}


                renderNoResultsFound = {() => {
                        return (<div className="no-results-found">No authors found</div>)
                    }}

                renderOption = {function(item) {
                        return (
                        <div id="authorNameFilterOption" className="simple-option">
                            <div>
                                <p>{CommentUtil.capitalize(item.label)}</p>
                                <p>{item.totalComments} {item.totalComments > 1 ? "comments" : "comment"}</p>
                                <p>Last comment created {item.timeAgoSinceLastCreatedComment}</p>
                            </div>
                        </div>)
                    }}

                renderValue = {function(item) {
                        return (<div className="simple-option"><span>{item.label}</span> </div>)
                }}
            />
        </div>)
    }

    onClear() {
        // so the placeholder text comes back up
        this.refs.select.setState({
            value: undefined
        });
        this.props.clearCommentFilter();
    }

    createClearButton() {
        return <button className="btn btn-xs core-heading margin-top-sm"
                       onClick={this.onClear.bind(this)}
                       data-toggle="tooltip" title="Remove author filter">Clear</button>
    }

    render() {
        return (
            <div>
                {this.createSimpleSelector.bind(this)()}
                {this.props.showClearButton ? this.createClearButton.bind(this)() : null}
            </div>
        )
    }
}

AuthorFilterSelector.propTypes = {
    comments: React.PropTypes.object.isRequired,
    setCommentFilter: React.PropTypes.func.isRequired,
    clearCommentFilter: React.PropTypes.func.isRequired,
    showClearButton: React.PropTypes.bool.isRequired,
    disabled: React.PropTypes.bool
};

AuthorFilterSelector.defaultProps = {
    disabled: false
};

export default AuthorFilterSelector;


