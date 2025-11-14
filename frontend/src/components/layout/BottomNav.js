import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaTasks, FaPlus, FaUser } from 'react-icons/fa';

const BottomNav = () => {
  return (
    <nav className="bottom-nav">
      <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
        <FaHome />
        <span>Home</span>
      </NavLink>
      <NavLink to="/tasks" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
        <FaTasks />
        <span>Tasks</span>
      </NavLink>
      <NavLink to="/add-task" className="nav-item add-task-btn">
        <FaPlus />
      </NavLink>
      <NavLink to="/profile" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
        <FaUser />
        <span>Profile</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;