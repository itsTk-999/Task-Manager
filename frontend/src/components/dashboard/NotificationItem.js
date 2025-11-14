import React from 'react';
import { FaTrash } from 'react-icons/fa';
import { useNotifications } from '../../context/NotificationContext';
import './NotificationDropdown.css'; // <-- We use the same CSS

const NotificationItem = ({ reminder }) => {
  const { deleteReminder } = useNotifications();

  return (
    <div className={`notification-item ${reminder.read ? 'read' : ''}`}>
      <p className="item-message">{reminder.message}</p>
      <button 
        className="item-delete-btn" 
        onClick={() => deleteReminder(reminder.id)}
        aria-label="Delete reminder"
      >
        <FaTrash />
      </button>
    </div>
  );
};

export default NotificationItem;