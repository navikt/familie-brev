import React from 'react';
import ReactDOM from 'react-dom';
import './frontend/index.css';
import App from './frontend/App';
import * as serviceWorker from './frontend/serviceWorker';

// clear session storage used to cache Sanity requests
sessionStorage.clear();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
