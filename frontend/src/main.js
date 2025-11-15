import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/layout.css';
import './styles/dashboard.css';
import './styles/forms.css';

const root = createRoot(document.getElementById('root'));
root.render(React.createElement(BrowserRouter, null, React.createElement(App)));
