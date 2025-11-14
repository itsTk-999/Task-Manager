import React, { useState, useEffect, useMemo } from 'react'; // <-- Import useMemo
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TaskList from '../components/tasks/TaskList';
import { useNotifications } from '../context/NotificationContext';
import TaskSkeleton from '../components/tasks/TaskSkeleton';
import './TasksPage.css'; // <-- 1. Import new CSS

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // --- 2. ADD NEW STATE FOR FILTERS ---
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  // --- END NEW STATE ---

  const { showNotification, addReminder } = useNotifications();
  const navigate = useNavigate();

  // useEffect (fetchTasks) remains unchanged...
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
        const res = await axios.get('http://localhost:5000/api/tasks', config);
        setTasks(res.data); // Set the original, full list of tasks

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

  // --- 3. CREATE A MEMO-IZED, FILTERED LIST ---
  // This code only re-runs when the tasks or filters change
  const filteredTasks = useMemo(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();

    return tasks.filter(task => {
      // Check for search term (in title or description)
      const matchesSearch = 
        task.title.toLowerCase().includes(lowerSearchTerm) ||
        (task.description && task.description.toLowerCase().includes(lowerSearchTerm));
      
      // Check for status filter
      const matchesStatus = 
        filterStatus === 'All' || task.status === filterStatus;
      
      // Check for priority filter
      const matchesPriority = 
        filterPriority === 'All' || task.priority === filterPriority;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, searchTerm, filterStatus, filterPriority]);
  // --- END MEMO ---

  // ... (onTaskDelete, onTaskUpdate functions remain unchanged)
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

  // --- 4. UPDATE THE RETURN JSX ---
  return (
    <div style={{ padding: '1rem' }}>
      <h2>All My Tasks</h2>

      {/* NEW FILTER UI */}
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
      {/* END FILTER UI */}

      <TaskList 
        tasks={filteredTasks} // <-- Pass the filtered list
        onTaskDelete={onTaskDelete} 
        onTaskUpdate={onTaskUpdate} 
      />
    </div>
  );
};

export default TasksPage;