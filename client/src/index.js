import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
//import reportWebVitals from './reportWebVitals';
import LoginState from './context/LoginState';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <LoginState>
    <App />
    </LoginState>
  </React.StrictMode>
);


//reportWebVitals();
