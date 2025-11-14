import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaPlus, FaTasks } from 'react-icons/fa';
import Clock from '../components/dashboard/Clock';
import Weather from '../components/dashboard/Weather';
import ReminderBell from '../components/dashboard/ReminderBell';
import './DashboardPage.css';

const DashboardPage = () => {
  const [userName, setUserName] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const config = { headers: { 'x-auth-token': token } };
        // Use relative path
        const res = await axios.get('/api/users/me', config);
        
        if (res.data.name && typeof res.data.name === 'string') {
          setUserName(res.data.name.split(' ')[0]); 
        } else {
          setUserName('User'); 
        }

      } catch (err) {
        console.error(err);
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setError('Could not load user data. Please try again later.');
        }
      }
    };

    fetchUser();
  }, [navigate]);

  if (error) {
    return <div style={{ padding: '1rem', color: 'red', textAlign: 'center' }}>{error}</div>;
  }

  return (
    <div className="dashboard-grid">
      <div className="dashboard-card welcome-card">
        <div className="welcome-content">
          <h2>Hello, {userName}!</h2>
          <p>This is your dashboard. Manage your day successfully.</p>
        </div>
        <ReminderBell />
      </div>

      <Clock />
      <Weather />

      <div className="dashboard-card quick-links-card">
        <h3>Quick Links</h3>
        <div className="quick-links">
          <Link to="/add-task" className="quick-link">
            <span className="icon icon-add"><FaPlus /></span>
            Create New Task
          </Link>
          <Link to="/tasks" className="quick-link">
            <span className="icon icon-tasks"><FaTasks /></span>
            View All Tasks
          </Link>
        </div>
      </div>

    </div>
  );
};

export default DashboardPage;