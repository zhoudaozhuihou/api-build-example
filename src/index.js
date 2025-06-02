// Import ethereum protection first
import './utils/ethereum-protection';

// Filter console warnings (like findDOMNode deprecation warnings from Material-UI)
import './utils/console-warning-filter';

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import './index.css';
import App from './App';

// Note: React.StrictMode may show findDOMNode warnings with Material-UI v4
// This is a known issue and will be resolved when upgrading to Material-UI v5 (MUI)
// For now, these warnings can be safely ignored as they don't affect functionality
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// Initialize Stagewise toolbar in development mode only
if (process.env.NODE_ENV === 'development') {
  import('./stagewise-init').then(({ initStagewise }) => {
    initStagewise();
  });
} 