import React, { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

/**
 * NOTE: This is a DEMO-ONLY implementation.
 * Passwords are hashed with a simple djb2-style hash before being stored in
 * localStorage. This is NOT cryptographically secure and should NOT be used
 * in a production app. In production, use a proper backend with bcrypt/argon2.
 */
async function hashPassword(password) {
  const msgBuffer = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  });

  const register = useCallback(async (email, password, name) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some((u) => u.email === email)) {
      throw new Error('Email already registered');
    }
    const newUser = { id: Date.now().toString(), email, passwordHash: await hashPassword(password), name };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    const { passwordHash: _ph, ...safeUser } = newUser;
    localStorage.setItem('user', JSON.stringify(safeUser));
    setUser(safeUser);
    return safeUser;
  }, []);

  const login = useCallback(async (email, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const hash = await hashPassword(password);
    const found = users.find(
      (u) => u.email === email && u.passwordHash === hash
    );
    if (!found) throw new Error('Invalid email or password');
    const { passwordHash: _ph, ...safeUser } = found;
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
