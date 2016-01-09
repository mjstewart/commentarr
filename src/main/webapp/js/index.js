import React from 'react';
import ReactDOM from 'react-dom';
import CommentFeed from './components/Comments/CommentFeed';
import Header from './components/Header/Header';

ReactDOM.render(<Header />,
    document.getElementById('header'));


ReactDOM.render(<CommentFeed />,
    document.getElementById('comment-feed'));
