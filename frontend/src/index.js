import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { ModalProvider } from './context/ModalContext';
import { EditModalProvider } from './context/EditModalContext';
import axios from 'axios'; // <-- 1. IMPORT

axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <NotificationProvider>
        <ModalProvider>
          <EditModalProvider> {/* <-- 2. WRAP */}
            <App />
          </EditModalProvider> {/* <-- 3. WRAP */}
        </ModalProvider>
      </NotificationProvider>
    </ThemeProvider>
  </React.StrictMode>
);