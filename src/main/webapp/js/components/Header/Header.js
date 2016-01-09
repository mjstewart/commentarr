import React from 'react';
import $ from 'jquery';

class Header extends React.Component {

    constructor() {
        super();

        this.state = {
            githubStargazerCount: 0
        }
    }

    componentDidMount() {
        $.ajax({
            url: 'https://api.github.com/repos/mjstewart/TestingApp01',
            dataType: `json`,
            cache: false,
            success: data => {
                this.setState({
                    githubStargazerCount: data.stargazers_count
                });
            },
            error: (xhr, status, err) => {
                this.setState({
                    githubStargazerCount: 0
                })
            }
        });
    }

    openGitHubRepo() {
        window.open('https://github.com/mjstewart/TestingApp01', '_blank')
    }

    render() {
        return (
            <div>
                <h1>CommentARR</h1>
                <p>leave comments n stuff</p>
                <div id="github" onClick={this.openGitHubRepo}>
                    <img src="/assets/GitHub-Mark-32px.png" alt="github-logo"/>
                    <span>Star {this.state.githubStargazerCount}</span>
                </div>
            </div>
        )
    }
}

export default Header;


