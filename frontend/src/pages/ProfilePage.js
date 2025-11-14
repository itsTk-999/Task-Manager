import React, { useState, useEffect, useMemo, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ThemeContext from '../context/ThemeContext';
import { FaUser, FaEnvelope, FaCalendarAlt, FaCheck, FaListAlt } from 'react-icons/fa';
import TaskStats from '../components/stats/TaskStats'; // <-- 1. IMPORT CHARTS
import './ProfilePage.css';

const ProfilePage = ({ onLogout }) => {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]); // <-- 2. ADD TASK STATE
  const [loading, setLoading] = useState(true);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  // 3. FETCH USER AND TASKS
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const config = {
      headers: {
        'x-auth-token': token,
      },
    };

    const fetchUser = axios.get('http://localhost:5000/api/users/me', config);
    const fetchTasks = axios.get('http://localhost:5000/api/tasks', config);

    // Fetch both at the same time
    Promise.all([fetchUser, fetchTasks])
      .then(([userRes, tasksRes]) => {
        setUser(userRes.data);
        setTasks(tasksRes.data);
      })
      .catch((err) => {
        console.error(err);
        localStorage.removeItem('token');
        navigate('/login');
      })
      .finally(() => {
        setLoading(false);
      });

  }, [navigate]);

  // 4. CALCULATE SIMPLE STATS
  const simpleStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'Completed').length;
    const pending = total - completed;
    return { total, completed, pending };
  }, [tasks]);


  if (loading) {
    return <div style={{ padding: '1rem' }}>Loading profile & stats...</div>;
  }

  return (
    <div className="profile-container">
      <h2>My Profile</h2>
      
      {user && (
        <div className="profile-card card-glass">
          {/* ... (User info: Name, Email, Member Since) ... */}
          <div className="profile-info-item">
            <FaUser />
            <div>
              <strong>Name</strong>
              <p>{user.name}</p>
            </div>
          </div>
          <div className="profile-info-item">
            <FaEnvelope />
            <div>
              <strong>Email</strong>
              <p>{user.email}</p>
            </div>
          </div>
          <div className="profile-info-item">
            <FaCalendarAlt />
            <div>
              <strong>Member Since</strong>
              <p>{new Date(user.date).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      )}

      {/* --- 5. NEW STATISTICS SECTION --- */}
      <div className="statistics-card card-glass">
        <strong>Task Statistics</strong>
        
        {/* Simple Stat Cards */}
        <div className="stat-cards-container">
          <div className="stat-card">
            <FaListAlt className="stat-icon icon-total" />
            <div className="stat-info">
              <span className="stat-number">{simpleStats.total}</span>
              <span className="stat-label">Total Tasks</span>
            </div>
          </div>
          <div className="stat-card">
            <FaCheck className="stat-icon icon-completed" />
            <div className="stat-info">
              <span className="stat-number">{simpleStats.completed}</span>
              <span className="stat-label">Completed</span>
            </div>
          </div>
        </div>

        {/* Charts Component */}
        {tasks.length > 0 ? (
          <TaskStats tasks={tasks} />
        ) : (
          <p className="no-stats">No task data to display. Go create some tasks!</p>
        )}
      </div>
      {/* --- END NEW SECTION --- */}

      <div className="settings-card card-glass">
        <strong>Settings</strong>
        {/* ... (Theme Toggle) ... */}
        <div className="theme-toggle">
          <span>{theme === 'light' ? 'Light Mode' : 'Dark Mode'}</span>
          <label className="switch">
            <input 
              type="checkbox" 
              onChange={toggleTheme} 
              checked={theme === 'dark'}
            />
            <span className="slider round"></span>
          </label>
        </div>
      </div>

      <button
        onClick={onLogout}
        className="btn"
        style={{ background: 'var(--orange)', color: 'white', width: '100%', marginTop: '1rem' }}
      >
        Logout
      </button>
    </div>
  );
};

export default ProfilePage;