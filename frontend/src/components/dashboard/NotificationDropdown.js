import React from 'react';
import { useNotifications } from '../../context/NotificationContext';
import NotificationItem from './NotificationItem';
import './NotificationDropdown.css'; // <-- New CSS file

const NotificationDropdown = ({ reminders }) => {
  const { clearReadReminders } = useNotifications();

  const unreadReminders = reminders.filter(r => !r.read);
  const readReminders = reminders.filter(r => r.read);

  return (
    <div className="notification-dropdown">
      <div className="dropdown-header">
        <h3>Notifications</h3>
      </div>
      
      <div className="dropdown-section">
        <h4>New</h4>
        {unreadReminders.length === 0 ? (
          <p className="no-reminders">No new reminders.</p>
        ) : (
          unreadReminders.map(reminder => (
            <NotificationItem key={reminder.id} reminder={reminder} />
          ))
        )}
      </div>

      <div className="dropdown-section">
        <h4>Read</h4>
        {readReminders.length === 0 ? (
          <p className="no-reminders">No read reminders.</p>
        ) : (
          readReminders.map(reminder => (
            <NotificationItem key={reminder.id} reminder={reminder} />
          ))
        )}
      </div>

      <div className="dropdown-footer">
        <button onClick={clearReadReminders}>
          Clear All Read
        </button>
      </div>
    </div>
  );
};

export default NotificationDropdown;