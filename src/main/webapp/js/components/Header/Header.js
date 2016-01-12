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
            url: 'https://api.github.com/repos/mjstewart/commentarr',
            dataType: 'json',
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
        window.open('https://github.com/mjstewart/commentarr', '_blank')
    }

    render() {
        const src = `http://${window.location.hostname}:8080/commentarr/assets/GitHub-Mark-32px.png`;
        return (
            <div>
                <h1>CommentARR</h1>
                <p>leave comments n stuff</p>
                <div id="github" onClick={this.openGitHubRepo}>
                    <img src={src} alt="github-logo"/>
                    <span>Star {this.state.githubStargazerCount}</span>
                </div>
            </div>
        )
    }
}

export default Header;


