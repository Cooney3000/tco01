import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
// import './index.css';

// Sample data
const vote = {
  title:       'How is your day?',
  description: 'Tell me: how has your day been so far?',
  choices:     [
    {id: 'choice_1', title: 'Good', count: 7},
    {id: 'choice_2', title: 'Bad', count: 12},
    {id: 'choice_3', title: 'Not sure yet', count: 1}
  ]
};

ReactDOM.render(<App />, document.getElementById('root'));