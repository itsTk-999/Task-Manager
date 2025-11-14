import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { ModalProvider } from './context/ModalContext';
import { EditModalProvider } from './context/EditModalContext';
import axios from 'axios'; 

// --- FINAL CONFIGURATION ---
// Set the base URL for all API requests (Render URL in production, localhost in dev)
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000' || 'https://task-manager-x30e.onrender.com';
// --- END FINAL CONFIGURATION ---

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <NotificationProvider>
        <ModalProvider>
          <EditModalProvider>
            <App />
          </EditModalProvider>
        </ModalProvider>
      </NotificationProvider>
    </ThemeProvider>
  </React.StrictMode>
);