import React, { createContext, useState, useContext, useCallback } from 'react';

const EditModalContext = createContext();

export const EditModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null); // This will hold the task to edit

  // Call this to open the modal with a specific task
  const openModal = useCallback((task) => {
    setEditingTask(task);
    setIsOpen(true);
  }, []);

  const closeModal = () => {
    setIsOpen(false);
    setEditingTask(null);
  };

  return (
    <EditModalContext.Provider value={{ isOpen, openModal, closeModal, editingTask }}>
      {children}
    </EditModalContext.Provider>
  );
};

// Custom hook
export const useEditModal = () => {
  return useContext(EditModalContext);
};