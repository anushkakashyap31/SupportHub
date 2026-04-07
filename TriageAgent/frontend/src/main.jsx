/**
 * Main Entry Point
 * Enhanced with performance optimizations
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Prevent animations on initial load
document.body.classList.add('js-loading');

// Remove loading class after DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.body.classList.remove('js-loading');
  }, 100);
});

// Render app
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);