import React from 'react';
import { StrictMode } from 'react';

import ReactDOM from 'react-dom/client'; // Use ReactDOM from 'react-dom/client'
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration'; // Import the service worker registration


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
                <App />
                

    
);

serviceWorkerRegistration.register(); // Register the service worker
