import React from 'react'

class FeedSettingControls extends React.Component {

    orderByVoteCount(asc) {
        return function() {
            if (asc) {
                const sortSettings = {
                    field: 'voteCount',
                    order: 'asc',
                    comparator: function(a, b) {
                        if (a.voteCount < b.voteCount) {
                            return -1;
                        } else if (a.voteCount > b.voteCount) {
                            return 1;
                        } else {
                            return 0;
                        }
                    }
                }
                this.props.sort(sortSettings);
            } else {
                // desc
                const sortSettings = {
                    field: 'voteCount',
                    order: 'desc',
                    comparator: function(a, b) {
                        if (a.voteCount > b.voteCount) {
                            return -1;
                        } else if (a.voteCount < b.voteCount) {
                            return 1;
                        } else {
                            return 0;
                        }
                    }
                }
                this.props.sort(sortSettings);
            }
        }
    }

    render() {
        console.log("FeedSettingControls render");

        let {order} = this.props.sortSettings;
        let {field} = this.props.sortSettings;
        return (
            <div className="well">
                <label>Order by vote count</label>
                <div className="dropdown">
                    <button className="btn btn-default dropdown-toggle" type="button" id="dropdownVoteCount"
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">Ascending <span className="caret"> </span>
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="dropdownVoteCount">
                        <li>
                            <div onClick={this.orderByVoteCount(true).bind(this)}>
                                <h5 className="inline-default margin-left-sm">Ascending</h5>
                                {field === 'votes' && order === "asc" ? <span className="margin-left-sm glyphicon glyphicon-ok"> </span> : null}
                            </div>
                        </li>
                        <li>
                            <div onClick={this.orderByVoteCount(false).bind(this)}>
                                <h5 className="inline-default margin-left-sm">Descending</h5>
                                {field === 'votes' && order === "desc" ? <span className="margin-left-sm glyphicon glyphicon-ok"> </span> : null}
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}


FeedSettingControls.propTypes = {
    sortSettings: React.PropTypes.object.isRequired,
    sort: React.PropTypes.func.isRequired
};


export default FeedSettingControls
