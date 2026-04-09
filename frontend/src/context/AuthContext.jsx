import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('musicapp_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const register = (name, email, password) => {
    const users = JSON.parse(localStorage.getItem('musicapp_users') || '[]');
    if (users.find(u => u.email === email)) {
      throw new Error('Email already registered');
    }
    const newUser = { id: Date.now(), name, email, password };
    users.push(newUser);
    localStorage.setItem('musicapp_users', JSON.stringify(users));
    const userData = { id: newUser.id, name: newUser.name, email: newUser.email };
    localStorage.setItem('musicapp_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('musicapp_users') || '[]');
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) throw new Error('Invalid credentials');
    const userData = { id: found.id, name: found.name, email: found.email };
    localStorage.setItem('musicapp_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('musicapp_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
