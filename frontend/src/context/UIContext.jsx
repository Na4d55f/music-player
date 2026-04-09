import { createContext, useContext, useState } from 'react';

const UIContext = createContext(null);

export const UIProvider = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null);

  const showToast = (message, type = 'success', duration = 3000) => {
    const id = Date.now();
    setToast({ id, message, type });
    setTimeout(() => setToast(null), duration);
  };

  const openModal = (content) => setModal(content);
  const closeModal = () => setModal(null);

  const value = {
    sidebarOpen,
    setSidebarOpen,
    toast,
    showToast,
    modal,
    openModal,
    closeModal,
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

export const useUI = () => {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used inside UIProvider');
  return ctx;
};

export default UIContext;
