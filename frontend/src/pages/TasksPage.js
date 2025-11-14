import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TaskList from '../components/tasks/TaskList';
import { useNotifications } from '../context/NotificationContext';
import TaskSkeleton from '../components/tasks/TaskSkeleton';
import { useMemo } from 'react'; // Added useMemo for filtering
import './TasksPage.css';

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');

  const { showNotification, addReminder } = useNotifications();
  const navigate = useNavigate();

  useEffect(() => {
    const timeoutIds = [];
    const fetchTasks = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login'); 
        return;
      }

      try {
        const config = { headers: { 'x-auth-token': token } };
        // Use relative path
        const res = await axios.get('/api/tasks', config);
        setTasks(res.data);

        const now = new Date().getTime();
        res.data.forEach(task => {
          if (task.reminderTime) {
            const reminderTime = new Date(task.reminderTime).getTime();
            const delay = reminderTime - now;
            
            if (delay > 0) {
              const timeoutId = setTimeout(() => {
                const reminderMessage = `Reminder: ${task.title}`;
                showNotification(reminderMessage, 'info');
                addReminder(reminderMessage);
              }, delay);
              timeoutIds.push(timeoutId);
            }
          }
        });
        
      } catch (err) {
        console.error(err);
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setError('Failed to fetch tasks.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();

    return () => {
      timeoutIds.forEach(id => clearTimeout(id));
    };

  }, [navigate, showNotification, addReminder]);

  const filteredTasks = useMemo(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();

    return tasks.filter(task => {
      const matchesSearch = 
        task.title.toLowerCase().includes(lowerSearchTerm) ||
        (task.description && task.description.toLowerCase().includes(lowerSearchTerm));
      
      const matchesStatus = 
        filterStatus === 'All' || task.status === filterStatus;
      
      const matchesPriority = 
        filterPriority === 'All' || task.priority === filterPriority;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, searchTerm, filterStatus, filterPriority]);

  const onTaskDelete = (id) => {
    setTasks(tasks.filter(task => task._id !== id));
  };
  
  const onTaskUpdate = (updatedTask) => {
    setTasks(tasks.map(task => task._id === updatedTask._id ? updatedTask : task));
  };

  if (loading) {
    return (
      <div style={{ padding: '1rem' }}>
        <h2>All My Tasks</h2>
        <TaskSkeleton />
        <TaskSkeleton />
        <TaskSkeleton />
      </div>
    );
  }

  if (error) {
    return <div style={{ padding: '1rem', color: 'red' }}>{error}</div>;
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h2>All My Tasks</h2>

      <div className="filter-container">
        <input
          type="text"
          placeholder="Search tasks..."
          className="filter-search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="filter-selects">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="To-Do">To-Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="All">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>

      <TaskList 
        tasks={filteredTasks} 
        onTaskDelete={onTaskDelete} 
        onTaskUpdate={onTaskUpdate} 
      />
    </div>
  );
};

export default TasksPage;