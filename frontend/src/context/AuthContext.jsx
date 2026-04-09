import React, { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  });

  const register = useCallback((email, password, name) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some((u) => u.email === email)) {
      throw new Error('Email already registered');
    }
    const newUser = { id: Date.now().toString(), email, password, name };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    const { password: _p, ...safeUser } = newUser;
    localStorage.setItem('user', JSON.stringify(safeUser));
    setUser(safeUser);
    return safeUser;
  }, []);

  const login = useCallback((email, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const found = users.find((u) => u.email === email && u.password === password);
    if (!found) throw new Error('Invalid email or password');
    const { password: _p, ...safeUser } = found;
    localStorage.setItem('user', JSON.stringify(safeUser));
    setUser(safeUser);
    return safeUser;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
