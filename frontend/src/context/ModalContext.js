import React, { createContext, useState, useContext, useCallback } from 'react';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [onConfirm, setOnConfirm] = useState(null);

  // This is the function our components will call
  const showModal = useCallback((msg, confirmAction) => {
    setMessage(msg);
    // We store the function to run if the user clicks "Confirm"
    setOnConfirm(() => confirmAction); 
    setIsOpen(true);
  }, []);

  const hideModal = () => {
    setIsOpen(false);
    setMessage('');
    setOnConfirm(null);
  };

  // This runs the stored function and then closes the modal
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    hideModal();
  };

  return (
    <ModalContext.Provider value={{ isOpen, message, showModal, hideModal, handleConfirm }}>
      {children}
    </ModalContext.Provider>
  );
};

// Custom hook to make it easy to use
export const useModal = () => {
  return useContext(ModalContext);
};