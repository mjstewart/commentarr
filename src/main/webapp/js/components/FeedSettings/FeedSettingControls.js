import React from 'react';
import AuthorFilterSelector from './AuthorFilterSelector';

/**
 * Contains sorting options and various filters to manipulate the way the CommentList is displayed.
 */
class FeedSettingControls extends React.Component {

    constructor(props) {
        console.log("FeedSettingControls, constructor");
        console.log(props);

        super(props);
    }

    orderByCommentLength(longest) {
        return function() {
            if (longest) {
                const sortSettings = {
                    field: 'message',
                    order: 'longest',
                    comparator: (a, b) => b.message.length - a.message.length
                };
                this.props.onSortChange(sortSettings);
            } else {
                const sortSettings = {
                    field: 'message',
                    order: 'shortest',
                    comparator: (a, b) => a.message.length - b.message.length
                };
                this.props.onSortChange(sortSettings);
            }
        }
    }

    orderByLastUpdated(mostRecently) {
        return function() {
            if (mostRecently) {
                const sortSettings = {
                    field: 'dateLastUpdated',
                    order: 'most recent',
                    comparator: (a, b) => -(a.dateLastUpdated - b.dateLastUpdated)
                };
                this.props.onSortChange(sortSettings);
            } else {
                const sortSettings = {
                    field: 'dateLastUpdated',
                    order: 'least recent',
                    comparator: (a, b) => a.dateLastUpdated - b.dateLastUpdated
                };
                this.props.onSortChange(sortSettings);
            }
        }
    }

    orderByDateCreated(newest) {
        return function() {
            if (newest) {
                const sortSettings = {
                    field: 'dateCreated',
                    order: 'newest',
                    comparator: (a, b) => -(a.dateCreated - b.dateCreated)
                };
                this.props.onSortChange(sortSettings);
            } else {
                const sortSettings = {
                    field: 'dateCreated',
                    order: 'oldest',
                    comparator: (a, b) => a.dateCreated - b.dateCreated
                };
                this.props.onSortChange(sortSettings);
            }
        }
    }

    orderByVoteCount(asc) {
        return function() {
            if (asc) {
                const sortSettings = {
                    field: 'voteCount',
                    order: 'asc',
                    comparator: (a, b) => a.voteCount - b.voteCount
                };
                this.props.onSortChange(sortSettings);
            } else {
                const sortSettings = {
                    field: 'voteCount',
                    order: 'desc',
                    comparator: (a, b) => b.voteCount - a.voteCount
                };
                this.props.onSortChange(sortSettings);
            }
        }
    }

    getEnabledIcon() {
        return (<span className="glyphicon glyphicon-ok-circle enabled-icon"></span>);
    }

    /**
     * Parameters decide if this sort control is decorated as active to provide user feedback.
     *
     * @param field the current active sort field
     * @param order the current sort order
     * @returns the VoteCountSortControl to be rendered
     */
    getVoteCountSortControl(field, order) {
        const isActive = field === "voteCount";
        return (
            <div>
                {isActive ? <label>Vote count {this.getEnabledIcon()}</label> : <label>Vote count</label>}
                <div className="dropdown">
                    <button className="btn btn-default dropdown-toggle" type="button" id="dropdownVoteCount"
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                        {order === "asc" ? "Ascending " : "Descending "}<span className="caret">  </span>
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="dropdownVoteCount">
                        <li>
                            <div onClick={this.orderByVoteCount(true).bind(this)}>
                                <h5 className="inline-default margin-left-sm">Ascending</h5>
                                {field === 'voteCount' && order === "asc" ?
                                    (<span className="margin-left-sm glyphicon glyphicon-ok"> </span>) : null}
                            </div>
                        </li>
                        <li>
                            <div onClick={this.orderByVoteCount(false).bind(this)}>
                                <h5 className="inline-default margin-left-sm">Descending</h5>
                                {field === 'voteCount' && order === "desc" ?
                                    (<span className="margin-left-sm glyphicon glyphicon-ok"> </span>) : null}
                            </div>
                        </li>
                    </ul>
                </div>
            </div>);
    }


    /**
     * Parameters decide if this sort control is decorated as active to provide user feedback.
     *
     * @param field the current active sort field
     * @param order the current sort order
     * @returns the CommentLengthSortControl to be rendered
     */
    getCommentLengthSortControl(field, order) {
        const isActive = field === "message";
        return (
            <div>
                {isActive ? <label>Longest comment {this.getEnabledIcon()}</label> : <label>Longest comment </label>}
                <div className="dropdown">
                    <button className="btn btn-default dropdown-toggle" type="button" id="dropdownCommentLength"
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                        {order === "longest" ? "Longest " : "Shortest "}<span className="caret">  </span>
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="dropdownCommentLength">
                        <li>
                            <div onClick={this.orderByCommentLength(true).bind(this)}>
                                <h5 className="inline-default margin-left-sm">Longest</h5>
                                {isActive && order === "longest" ?
                                    (<span className="margin-left-sm glyphicon glyphicon-ok"> </span>) : null}
                            </div>
                        </li>
                        <li>
                            <div onClick={this.orderByCommentLength(false).bind(this)}>
                                <h5 className="inline-default margin-left-sm">Shortest</h5>
                                {isActive && order === "shortest" ?
                                    (<span className="margin-left-sm glyphicon glyphicon-ok"> </span>) : null}
                            </div>
                        </li>
                    </ul>
                </div>
            </div>);
    }

    /**
     * Parameters decide if this sort control is decorated as active to provide user feedback.
     *
     * @param field the current active sort field
     * @param order the current sort order
     * @returns the DateCreatedSortControl to be rendered
     */
    getDateCreatedSortControl(field, order) {
        const isActive = field === "dateCreated";
        return (
            <div>
                {isActive ? <label>Date created {this.getEnabledIcon()}</label> : <label>Date created</label>}
                <div className="dropdown">
                    <button className="btn btn-default dropdown-toggle" type="button" id="dropdownDateCreated"
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                        {isActive ? order === "newest" ? "Newest " : "Oldest " : "Newest "}<span className="caret">  </span>
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="dropdownDateCreated">
                        <li>
                            <div onClick={this.orderByDateCreated(true).bind(this)}>
                                <h5 className="inline-default margin-left-sm">Newest</h5>
                                {isActive && order === "newest" ?
                                    (<span className="margin-left-sm glyphicon glyphicon-ok"> </span>) : null}
                            </div>
                        </li>
                        <li>
                            <div onClick={this.orderByDateCreated(false).bind(this)}>
                                <h5 className="inline-default margin-left-sm">Oldest</h5>
                                {isActive && order === "oldest" ?
                                    (<span className="margin-left-sm glyphicon glyphicon-ok"> </span>) : null}
                            </div>
                        </li>
                    </ul>
                </div>
            </div>);
    }

    /**
     * Parameters decide if this sort control is decorated as active to provide user feedback.
     *
     * @param field the current active sort field
     * @param order the current sort order
     * @returns the DateLastUpdatedSortControl to be rendered
     */
    getDateLastUpdatedSortControl(field, order) {
        const isActive = field === "dateLastUpdated";
        return (
            <div>
                {isActive ? <label>Last updated {this.getEnabledIcon()}</label> : <label>Last updated</label>}
                <div className="dropdown">
                    <button className="btn btn-default dropdown-toggle" type="button" id="dropdownDateLastUpdated"
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                        {isActive ? order === "most recent" ? "Most Recently " : "Least Recently "
                            : "Most Recently "}<span className="caret"> </span>
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="dropdownDateLastUpdated">
                        <li>
                            <div onClick={this.orderByLastUpdated(true).bind(this)}>
                                <h5 className="inline-default margin-left-sm">Most recent</h5>
                                {isActive && order === "most recent" ?
                                    (<span className="margin-left-sm glyphicon glyphicon-ok"> </span>) : null}
                            </div>
                        </li>
                        <li>
                            <div onClick={this.orderByLastUpdated(false).bind(this)}>
                                <h5 className="inline-default margin-left-sm">Least recent</h5>
                                {isActive && order === "least recent" ?
                                    (<span className="margin-left-sm glyphicon glyphicon-ok"> </span>) : null}
                            </div>
                        </li>
                    </ul>
                </div>
            </div>);
    }


    getFilterByAuthorControl() {
        // AuthorFilterSelector sets filterName when its value changes.
        // filterName enables us to identify the author filter is enabled, useful if more filters get added later.
        const isActive = this.props.commentFilter.filterName === "authorName";

        return (
            <div>
                {isActive ? <label>By author {this.getEnabledIcon()}</label> : <label>By author</label>}
                <AuthorFilterSelector comments={this.props.comments}
                                      setCommentFilter={this.props.setCommentFilter}
                                      clearCommentFilter={this.props.clearCommentFilter}
                                      showClearButton={isActive}/>
            </div>
        );
    }


    render() {
        console.log("FeedSettingControls render");
        let {field} = this.props.sortSettings;
        let {order} = this.props.sortSettings;
        return (
            <div id="sort-option-container1" className="well">
                <div className="container-fluid">
                    <div className="row">
                        <h4 className="core-heading bottom-border padding-sm rounded">Sort order
                            <span className="glyphicon glyphicon-sort margin-left-sm"></span></h4>
                    </div>
                    <div className="row">
                        <div className="col-lg-3 col-md-3 col-sm-3">
                            {this.getVoteCountSortControl(field, order)}
                        </div>
                        <div className="col-lg-3 col-md-3 col-sm-3">
                            {this.getDateCreatedSortControl(field, order)}
                        </div>
                        <div className="col-lg-3 col-md-3 col-sm-3">
                            {this.getDateLastUpdatedSortControl(field, order)}
                        </div>
                        <div className="col-lg-3 col-md-3 col-sm-3">
                            {this.getCommentLengthSortControl(field, order)}
                        </div>
                    </div>

                    <div className="row margin-top-sm">
                        <h4 className="bottom-border core-heading padding-sm rounded">Filter
                            <span className="glyphicon glyphicon-filter margin-left-sm"></span></h4>
                    </div>

                    <div className="row">
                        <div className="col-lg-4 col-md-6 col-sm-6">
                            {this.getFilterByAuthorControl.bind(this)()}
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

FeedSettingControls.propTypes = {
    sortSettings: React.PropTypes.object.isRequired,
    commentFilter: React.PropTypes.object.isRequired,
    onSortChange: React.PropTypes.func.isRequired,
    setCommentFilter: React.PropTypes.func.isRequired,
    clearCommentFilter: React.PropTypes.func.isRequired,
    comments: React.PropTypes.object.isRequired
};


export default FeedSettingControls;
