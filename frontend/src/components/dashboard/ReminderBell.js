import React, { useState } from 'react';
import { FaBell } from 'react-icons/fa';
import { useNotifications } from '../../context/NotificationContext';
import NotificationDropdown from './NotificationDropdown'; // <-- Import new component
import './ReminderBell.css';

const ReminderBell = () => {
  const { unseenCount, markAllAsRead, reminders } = useNotifications();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleClick = () => {
    // Toggle the dropdown
    const willOpen = !isDropdownOpen;
    setIsDropdownOpen(willOpen);
    
    // If the dropdown is about to open, mark all as read
    if (willOpen) {
      markAllAsRead();
    }
  };

  return (
    <div className="reminder-bell-wrapper">
      <div 
        className={`reminder-bell ${unseenCount > 0 ? 'unseen' : ''}`} 
        onClick={handleClick}
      >
        <FaBell className="bell-icon" />
        {unseenCount > 0 && (
          <span className="unseen-badge-dot"></span>
        )}
      </div>
      
      {/* Render the dropdown if open */}
      {isDropdownOpen && <NotificationDropdown reminders={reminders} />}
    </div>
  );
};

export default ReminderBell;