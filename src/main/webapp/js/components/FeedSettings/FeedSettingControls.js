import React from 'react'

class FeedSettingControls extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            byAuthorFilterText: ''
        }
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
                    comparator: (a, b) => a.dateLastUpdated < b.dateLastUpdated
                };
                this.props.onSortChange(sortSettings);
            } else {
                const sortSettings = {
                    field: 'dateLastUpdated',
                    order: 'least recent',
                    comparator: (a, b) => b.dateLastUpdated < a.dateLastUpdated
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
                    comparator: (a, b) => a.dateCreated < b.dateCreated
                };
                this.props.onSortChange(sortSettings);
            } else {
                const sortSettings = {
                    field: 'dateCreated',
                    order: 'oldest',
                    comparator: (a, b) => b.dateCreated < a.dateCreated
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
     * @returns {XML}
     */
    getVoteCountSortControl(field, order) {
        const isActive = field === "voteCount";
        return (
            <div>
                {isActive ? <label>By vote count {this.getEnabledIcon()}</label> : <label>By vote count</label>}
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
     * @returns {XML}
     */
    getCommentLengthSortControl(field, order) {
        const isActive = field === "message";
        return (
            <div>
                {isActive ? <label>By longest comment {this.getEnabledIcon()}</label> : <label>By longest comment </label>}
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
     * @returns {XML}
     */
    getDateCreatedSortControl(field, order) {
        const isActive = field === "dateCreated";
        return (
            <div>
                {isActive ? <label>By date created {this.getEnabledIcon()}</label> : <label>By date created</label>}
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
     * @returns {XML}
     */
    getDateLastUpdatedSortControl(field, order) {
        const isActive = field === "dateLastUpdated";
        return (
            <div>
                {isActive ? <label>By last time updated {this.getEnabledIcon()}</label> : <label>By last time updated</label>}
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

    onAuthorTextFilterChange(event) {
        this.setState({
            byAuthorFilterText: event.target.value
        });
    }

    OnAuthorFilterClick() {
        this.props.setCommentFilter(comment => comment.author === this.state.byAuthorFilterText);
    }


    getFilterByAuthorControl() {
        const isActive = this.props.filterFn !== null;
        return (
            <div>
                {isActive ? <label>By author {this.getEnabledIcon()}</label> : <label>By author</label>}
                <div className="input-group">
                    <input type="text" className="form-control" placeholder="Enter author name"
                           onChange={this.onAuthorTextFilterChange.bind(this)} value={this.state.byAuthorFilterText}/>
                    <span className="input-group-btn">
                        <button type="button" className="btn btn-default core-heading"
                                data-toggle="tooltip" title="Search comments by author" onClick={this.OnAuthorFilterClick.bind(this)}>
                            <span className="glyphicon glyphicon-search inline"></span>
                        </button>
                    </span>
                </div>
            </div>)
    }


    render() {
        console.log("FeedSettingControls render");
        let {field} = this.props.sortSettings;
        let {order} = this.props.sortSettings;
        return (
            <div id="sort-option-container1" className="well">
                <div className="container-fluid">
                    <div className="row">
                        <h4 className="core-heading bottom-border padding-sm rounded">Sort order</h4>
                    </div>

                    <div className="row">
                        <div className="col-lg-3">
                            {this.getVoteCountSortControl(field, order)}
                        </div>
                        <div className="col-lg-3">
                            {this.getDateCreatedSortControl(field, order)}
                        </div>
                        <div className="col-lg-3">
                            {this.getDateLastUpdatedSortControl(field, order)}
                        </div>
                        <div className="col-lg-3">
                            {this.getCommentLengthSortControl(field, order)}
                        </div>
                    </div>

                    <div className="row margin-top-sm">
                        <h4 className="bottom-border core-heading padding-sm rounded">Filter</h4>
                    </div>

                    <div className="row">
                        <div className="col-lg-4">
                            {this.getFilterByAuthorControl()}
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

// filterFn is optional because if its null it means no filter is applied
FeedSettingControls.propTypes = {
    sortSettings: React.PropTypes.object.isRequired,
    filterFn: React.PropTypes.func,
    onSortChange: React.PropTypes.func.isRequired,
    setCommentFilter: React.PropTypes.func.isRequired
};


export default FeedSettingControls;
