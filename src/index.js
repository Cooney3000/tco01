import 'babel-polyfill'; 
import 'react-app-polyfill/ie11';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './components/App';

ReactDOM.render((
  <Router>
    <App />
  </Router>
), document.getElementById('root'));

// import index from "./js/index";
