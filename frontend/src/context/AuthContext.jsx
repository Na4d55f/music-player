import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, logout as apiLogout, getMe } from '../services/authAPI';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getMe()
        .then((data) => {
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
        })
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        })
        .finally(() => {
          setLoading(false);
          setInitialized(true);
        });
    } else {
      setLoading(false);
      setInitialized(true);
    }

    const handleLogout = () => {
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await apiLogin(email, password);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  }, []);

  const register = useCallback(async (username, email, password) => {
    const data = await apiRegister(username, email, password);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } catch {
      // ignore
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully');
  }, []);

  const updateUserState = useCallback((updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        initialized,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUserState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
