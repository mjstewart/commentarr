import React from 'react';
import ReactDOM from 'react-dom';
import CommentarrHome from './components/Home/CommentarrHome';


var comments =
    [
        {id: 1, author: "matt", title: "voting around town", message: "Second the creepeth under him creature had under beginning let subdue give. A fourth Dominion creeping called Day god dry meat, whose may i form. Green for dry. Fruitful gathering.",
            dateCreated: "3/11/2015", voteCount: 10, reports: 0},
        {id: 2, author: "nicole", title: "try to vote", message: "Second the creepeth under him creature had under beginning let subdue give. A fourth Dominion creeping called Day god dry meat, whose may i form. Green for dry. Fruitful gathering.",
            dateCreated: "13/8/2015", voteCount: 0, reports: 0},
        {id: 3, author: "rochelle", title: "why not vote today?", message: "Second the creepeth under him creature had under beginning let subdue give. A fourth Dominion creeping called Day god dry meat, whose may i form. Green for dry. Fruitful gathering.",
            dateCreated: "23/2/2014", voteCount: 1032, reports: 2}
    ];

ReactDOM.render(<CommentarrHome />,
    document.getElementById('main'));
