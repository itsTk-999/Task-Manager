import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';

const TaskForm = ({ existingTask, onTaskUpdated }) => {
  const formKey = existingTask ? existingTask._id : 'new'; 
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    category: 'Personal',
    deadline: '',
    reminderTime: '',
  });
  const [error, setError] = useState('');
  
  const { showNotification } = useNotifications();
  const navigate = useNavigate();

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

  const { title, description, priority, category, deadline, reminderTime } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const config = {
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
      };
      
      const body = JSON.stringify(formData);
      let res;

      if (existingTask) {
        // --- EDIT MODE (PUT) ---
        // Use relative path
        await axios.put(`/api/tasks/${existingTask._id}`, body, config);
        showNotification('Task updated successfully!', 'success');
        if (onTaskUpdated) onTaskUpdated();
      
      } else {
        // --- CREATE MODE (POST) ---
        // Use relative path
        res = await axios.post('/api/tasks', body, config);
        const newTask = res.data;

        if (newTask.reminderTime) {
          const reminderTimeDate = new Date(newTask.reminderTime).getTime();
          const now = new Date().getTime();
          const delay = reminderTimeDate - now;

          if (delay > 0) {
            setTimeout(() => {
              const reminderMessage = `Reminder: ${newTask.title}`;
              showNotification(reminderMessage, 'info');
            }, delay);
          }
        }
        navigate('/tasks');
      }
      
    } catch (err) {
      const errorMsg = existingTask ? 'Failed to update task' : 'Failed to create task';
      setError(errorMsg);
      console.error(err.response?.data || err);
    }
  };

  return (
    <form onSubmit={onSubmit} className="task-form" key={formKey}> 
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
        {existingTask ? 'Save Changes' : 'Add Task'}
      </button>
    </form>
  );
};

export default TaskForm;