import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const rootDoc = document.getElementById('root')
if (rootDoc === null) {
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(rootDoc);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

