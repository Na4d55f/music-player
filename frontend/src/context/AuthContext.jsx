import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Hash password using SubtleCrypto (SHA-256) for basic security.
// NOTE: This is a demo app using localStorage - not suitable for production use.
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('musicapp_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const register = async (name, email, password) => {
    const users = JSON.parse(localStorage.getItem('musicapp_users') || '[]');
    if (users.find(u => u.email === email)) {
      throw new Error('Email already registered');
    }
    const passwordHash = await hashPassword(password);
    const newUser = { id: Date.now(), name, email, passwordHash };
    users.push(newUser);
    localStorage.setItem('musicapp_users', JSON.stringify(users));
    const userData = { id: newUser.id, name: newUser.name, email: newUser.email };
    localStorage.setItem('musicapp_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const login = async (email, password) => {
    const users = JSON.parse(localStorage.getItem('musicapp_users') || '[]');
    const passwordHash = await hashPassword(password);
    const found = users.find(u => u.email === email && u.passwordHash === passwordHash);
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
