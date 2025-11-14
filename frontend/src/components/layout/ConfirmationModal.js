import React from 'react';
import { useModal } from '../../context/ModalContext';
import './ConfirmationModal.css'; // We'll create this next

const ConfirmationModal = () => {
  const { isOpen, message, hideModal, handleConfirm } = useModal();

  if (!isOpen) {
    return null; // Don't render if it's not open
  }

  return (
    <div className="modal-overlay" onClick={hideModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-body">
          <p>{message}</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={hideModal}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={handleConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;