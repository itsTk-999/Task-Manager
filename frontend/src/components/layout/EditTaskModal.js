import React from 'react';
import { useEditModal } from '../../context/EditModalContext';
import TaskForm from '../tasks/TaskForm';
import './EditTaskModal.css'; // We'll create this next

const EditTaskModal = () => {
  const { isOpen, closeModal, editingTask } = useEditModal();

  if (!isOpen || !editingTask) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Task</h2>
          <button className="close-btn" onClick={closeModal}>&times;</button>
        </div>
        <div className="modal-body">
          {/* We re-use the TaskForm component in 'edit' mode */}
          <TaskForm 
            existingTask={editingTask} 
            onTaskUpdated={closeModal} 
          />
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;