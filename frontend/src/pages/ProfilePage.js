import React, { useState, useEffect, useMemo, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ThemeContext from '../context/ThemeContext';
import { FaUser, FaEnvelope, FaCalendarAlt, FaCheck, FaListAlt } from 'react-icons/fa';
import TaskStats from '../components/stats/TaskStats';
import './ProfilePage.css';

const ProfilePage = ({ onLogout }) => {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

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

    // Use relative path
    const fetchUser = axios.get('/api/users/me', config);
    // Use relative path
    const fetchTasks = axios.get('/api/tasks', config);

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

      <div className="statistics-card card-glass">
        <strong>Task Statistics</strong>
        
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

        {tasks.length > 0 ? (
          <TaskStats tasks={tasks} />
        ) : (
          <p className="no-stats">No task data to display. Go create some tasks!</p>
        )}
      </div>

      <div className="settings-card card-glass">
        <strong>Settings</strong>
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