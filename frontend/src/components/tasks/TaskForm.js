import React, { useState, useEffect } from 'react'; // <-- 1. Import useEffect
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';

// --- 2. Accept new props ---
const TaskForm = ({ existingTask, onTaskUpdated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    category: 'Personal',
    deadline: '',
    reminderTime: '',
  });
  const [error, setError] = useState('');
  
  const { showNotification } = useNotifications(); // 3. Get showNotification
  const navigate = useNavigate();

  // --- 4. NEW: This effect fills the form when an 'existingTask' is passed in ---
  useEffect(() => {
    if (existingTask) {
      // Format dates correctly for the form inputs
      const formattedDeadline = existingTask.deadline 
        ? new Date(existingTask.deadline).toISOString().split('T')[0] 
        : '';
      const formattedReminder = existingTask.reminderTime
        ? new Date(existingTask.reminderTime).toISOString().substring(0, 16)
        : '';

      setFormData({
        title: existingTask.title || '',
        description: existingTask.description || '',
        priority: existingTask.priority || 'Medium',
        category: existingTask.category || 'Personal',
        deadline: formattedDeadline,
        reminderTime: formattedReminder,
      });
    }
  }, [existingTask]);
  // --- END NEW ---

  const { title, description, priority, category, deadline, reminderTime } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // --- 5. MAJOR UPDATE: onSubmit now handles CREATE and UPDATE ---
  const onSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const config = {
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
      };
      
      const body = JSON.stringify(formData);

      if (existingTask) {
        // --- EDIT MODE ---
        // We are editing, so use the PUT route
        await axios.put(`http://localhost:5000/api/tasks/${existingTask._id}`, body, config);
        showNotification('Task updated successfully!', 'success');
        if (onTaskUpdated) onTaskUpdated(); // Close the modal
      
      } else {
        // --- CREATE MODE ---
        // We are creating a new task, so use the POST route
        const res = await axios.post('http://localhost:5000/api/tasks', body, config);
        const newTask = res.data;

        // (We removed the reminder logic from here, which was correct)
        navigate('/tasks'); // Navigate to the task list on success
      }

    } catch (err) {
      const errorMsg = existingTask ? 'Failed to update task' : 'Failed to create task';
      setError(errorMsg);
      console.error(err.response?.data || err);
    }
  };

  return (
    <form onSubmit={onSubmit} className="task-form">
      {error && <p className="error-text">{error}</p>}
      
      <div className="form-group-light">
        <label htmlFor="title">Title</label>
        <input type="text" id="title" name="title" value={title} onChange={onChange} required />
      </div>
      
      <div className="form-group-light">
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" value={description} onChange={onChange} rows="3"></textarea>
      </div>
      
      <div className="form-group-light">
        <label htmlFor="priority">Priority</label>
        <select name="priority" value={priority} onChange={onChange}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>
      
      <div className="form-group-light">
        <label htmlFor="category">Category</label>
        <input type="text" id="category" name="category" value={category} onChange={onChange} />
      </div>
      
      <div className="form-group-light">
        <label htmlFor="deadline">Deadline</label>
        <input type="date" id="deadline" name="deadline" value={deadline || ''} onChange={onChange} />
      </div>

      <div className="form-group-light">
        <label htmlFor="reminderTime">Set Reminder</label>
        <input type="datetime-local" id="reminderTime" name="reminderTime" value={reminderTime || ''} onChange={onChange} />
      </div>

      <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
        {/* 6. Change button text based on mode */}
        {existingTask ? 'Save Changes' : 'Add Task'}
      </button>
    </form>
  );
};

export default TaskForm;