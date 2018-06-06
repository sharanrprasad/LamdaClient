import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const webToken = localStorage.getItem("token");

ReactDOM.render(
    <App />,
    document.getElementById('root'));
