import React, { useContext } from 'react';
import NotificationContext from '../../context/NotificationContext';
import { FaInfoCircle, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import './Notification.css'; // <-- We will create this

const icons = {
  info: <FaInfoCircle />,
  success: <FaCheckCircle />,
  error: <FaExclamationCircle />,
};

const Notification = () => {
  const { notification, hideNotification } = useContext(NotificationContext);

  if (!notification) {
    return null;
  }

  const { message, type } = notification;

  return (
    <div className={`notification-toast ${type}`} onClick={hideNotification}>
      <div className="notification-icon">
        {icons[type] || <FaInfoCircle />}
      </div>
      <div className="notification-message">
        {message}
      </div>
    </div>
  );
};

export default Notification;