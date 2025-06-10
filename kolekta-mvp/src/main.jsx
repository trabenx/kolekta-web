// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // Make sure this path is correct
import './index.css'; // Your global styles
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS

console.log("main.jsx is executing"); // Add this log

const rootElement = document.getElementById('root');
if (rootElement) {
  console.log("Found #root element in main.jsx");
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("#root element NOT FOUND in main.jsx. Check your index.html!");
}