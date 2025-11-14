import React from 'react';
import axios from 'axios';
// Import all the icons we need
import { FaTrash, FaCheck, FaSpinner, FaBell, FaPencilAlt } from 'react-icons/fa';
// Import the hooks for both modals
import { useModal } from '../../context/ModalContext';
import { useEditModal } from '../../context/EditModalContext'; 

const TaskItem = ({ task, onTaskDelete, onTaskUpdate }) => {
  const { showModal } = useModal(); // Hook for the delete confirmation
  const { openModal } = useEditModal(); // Hook for the edit modal

  /**
   * Returns a color based on the task priority.
   */
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'var(--orange)';
      case 'Medium':
        return '#f0e68c'; // Khaki
      case 'Low':
        return 'var(--green)';
      default:
        return '#ccc';
    }
  };
  
  /**
   * Toggles the task status between 'Completed' and 'To-Do'.
   */
  const handleToggleStatus = async () => {
    const newStatus = task.status === 'Completed' ? 'To-Do' : 'Completed';
    const token = localStorage.getItem('token');
    
    try {
      const config = { headers: { 'x-auth-token': token } };
      const res = await axios.put(
        `/api/tasks/${task._id}`,
        { ...task, status: newStatus }, // Send updated status
        config
      );
      onTaskUpdate(res.data); // Update the list in TasksPage
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };
  
  /**
   * This is the actual delete logic that will be passed to the modal.
   */
  const doDelete = async () => {
    const token = localStorage.getItem('token');
    try {
      const config = { headers: { 'x-auth-token': token } };
      await axios.delete(`/api/tasks/${task._id}`, config);
      onTaskDelete(task._id); // Update the list in TasksPage
    } catch (err) {
      console.error('Failed to delete task', err);
    }
  };

  /**
   * This function opens the confirmation modal for deleting.
   */
  const handleDelete = () => {
    showModal(
      `Are you sure you want to delete the task: "${task.title}"?`,
      doDelete // Pass the delete function as the callback
    );
  };

  /**
   * This function opens the edit modal.
   */
  const handleEdit = () => {
    openModal(task); // Pass the entire task object to the edit context
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
        
        {/* --- NEW EDIT BUTTON --- */}
        <button 
          className="task-action-btn edit-btn"
          onClick={handleEdit}
          aria-label="Edit task"
        >
          <FaPencilAlt />
        </button>
        {/* --- END NEW BUTTON --- */}

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