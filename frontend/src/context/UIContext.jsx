import { createContext, useContext, useState, useEffect } from 'react';

const UIContext = createContext(null);

export const UIProvider = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.classList.add(savedTheme);
  }, []);

  const toggleSidebar = () => setSidebarOpen((o) => !o);
  const toggleSearch = () => setSearchOpen((o) => !o);

  const openModal = (content) => {
    setModalContent(content);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalContent(null);
  };

  return (
    <UIContext.Provider
      value={{
        sidebarOpen,
        searchOpen,
        theme,
        modalOpen,
        modalContent,
        toggleSidebar,
        toggleSearch,
        openModal,
        closeModal,
        setSidebarOpen,
        setSearchOpen,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used within UIProvider');
  return ctx;
};

export default UIContext;
