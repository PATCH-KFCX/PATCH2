import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import CurrentUserContextProvider from './contexts/CurrentUserContextProvider';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <CurrentUserContextProvider>
      <App />
    </CurrentUserContextProvider>
  </BrowserRouter>
);
