import React, { createContext, useState, useCallback, useContext } from 'react';

const NotificationContext = createContext();

let toastTimeoutId;

export const NotificationProvider = ({ children }) => {
  // --- System 1: Temporary Toast Notifications ---
  const [notification, setNotification] = useState(null);

  // FIX: Wrap in useCallback
  const showNotification = useCallback((message, type = 'info') => {
    if (toastTimeoutId) {
      clearTimeout(toastTimeoutId);
    }
    setNotification({ message, type });
    toastTimeoutId = setTimeout(() => {
      setNotification(null);
    }, 5000);
  }, []); // <-- Add []

  // FIX: Wrap in useCallback
  const hideNotification = useCallback(() => {
    setNotification(null);
    if (toastTimeoutId) {
      clearTimeout(toastTimeoutId);
    }
  }, []); // <-- Add []

  // --- System 2: Persistent Reminder List ---
  const [reminders, setReminders] = useState([]);

  // FIX: Wrap in useCallback
  const addReminder = useCallback((message) => {
    const newReminder = {
      // Use a more unique ID to prevent bugs
      id: Date.now() + Math.random(), 
      message,
      read: false,
    };
    setReminders(prev => [newReminder, ...prev]);
  }, []); // <-- Add []

  // FIX: Wrap in useCallback
  const markReminderAsRead = useCallback((id) => {
    setReminders(prev =>
      prev.map(r => (r.id === id ? { ...r, read: true } : r))
    );
  }, []); // <-- Add []

  // FIX: Wrap in useCallback
  const markAllAsRead = useCallback(() => {
    setReminders(prev =>
      prev.map(r => (r.read ? r : { ...r, read: true }))
    );
  }, []); // <-- Add []

  // FIX: Wrap in useCallback
  const deleteReminder = useCallback((id) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  }, []); // <-- Add []

  // FIX: Wrap in useCallback
  const clearReadReminders = useCallback(() => {
    setReminders(prev => prev.filter(r => !r.read));
  }, []); // <-- Add []

  const unseenCount = reminders.filter(r => !r.read).length;

  return (
    <NotificationContext.Provider 
      value={{ 
        notification, 
        showNotification, 
        hideNotification,
        reminders,
        addReminder,
        markReminderAsRead,
        markAllAsRead,
        deleteReminder,
        clearReadReminders,
        unseenCount
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  return useContext(NotificationContext);
};

export default NotificationContext;