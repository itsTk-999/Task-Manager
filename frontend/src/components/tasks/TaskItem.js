import React from 'react';
import axios from 'axios';
import { FaTrash, FaCheck, FaSpinner, FaBell, FaPencilAlt } from 'react-icons/fa';
import { useModal } from '../../context/ModalContext';
import { useEditModal } from '../../context/EditModalContext'; 

const TaskItem = ({ task, onTaskDelete, onTaskUpdate }) => {
  const { showModal } = useModal(); 
  const { openModal } = useEditModal(); 

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'var(--orange)';
      case 'Medium':
        return '#f0e68c';
      case 'Low':
        return 'var(--green)';
      default:
        return '#ccc';
    }
  };
  
  const handleToggleStatus = async () => {
    const newStatus = task.status === 'Completed' ? 'To-Do' : 'Completed';
    const token = localStorage.getItem('token');
    
    try {
      const config = { headers: { 'x-auth-token': token } };
      // Use relative path
      const res = await axios.put(
        `/api/tasks/${task._id}`,
        { ...task, status: newStatus }, 
        config
      );
      onTaskUpdate(res.data);
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };
  
  const doDelete = async () => {
    const token = localStorage.getItem('token');
    try {
      const config = { headers: { 'x-auth-token': token } };
      // Use relative path
      await axios.delete(`/api/tasks/${task._id}`, config);
      onTaskDelete(task._id);
    } catch (err) {
      console.error('Failed to delete task', err);
    }
  };

  const handleDelete = () => {
    showModal(
      `Are you sure you want to delete the task: "${task.title}"?`,
      doDelete
    );
  };

  const handleEdit = () => {
    openModal(task);
  };

  return (
    <div className={`task-item ${task.status === 'Completed' ? 'completed' : ''}`}>
      <div className="task-item-header">
        <span 
          className="task-priority" 
          style={{ backgroundColor: getPriorityColor(task.priority) }}
        >
          {task.priority}
        </span>
        <span className="task-category">{task.category}</span>
      </div>

      <h3 className="task-title" style={{ color: 'var(--text-dark)' }}>{task.title}</h3>
      
      {task.description && <p className="task-description">{task.description}</p>}
      
      {task.reminderTime && (
        <p className="task-reminder">
          <FaBell style={{ marginRight: '5px', color: 'var(--blue)' }} />
          Reminder at: {new Date(task.reminderTime).toLocaleString()}
        </p>
      )}

      {task.deadline && (
        <p className="task-deadline">
          Due: {new Date(task.deadline).toLocaleDateString()}
        </p>
      )}
      
      <div className="task-item-footer">
        <button 
          className="task-action-btn complete-btn"
          onClick={handleToggleStatus}
          aria-label="Toggle task completion"
        >
          {task.status === 'Completed' ? <FaCheck /> : (task.status === 'In Progress' ? <FaSpinner /> : 'Complete')}
        </button>
        
        <button 
          className="task-action-btn edit-btn"
          onClick={handleEdit}
          aria-label="Edit task"
        >
          <FaPencilAlt />
        </button>
        
        <button 
          className="task-action-btn delete-btn"
          onClick={handleDelete}
          aria-label="Delete task"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;