import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('auth:logout'));
    }
    return Promise.reject(error);
  }
);

export const login = (email, password) =>
  api.post('/auth/login', { email, password }).then((r) => r.data);

export const register = (username, email, password) =>
  api.post('/auth/register', { username, email, password }).then((r) => r.data);

export const logout = () =>
  api.post('/auth/logout').then((r) => r.data);

export const getMe = () =>
  api.get('/auth/me').then((r) => r.data);

export const forgotPassword = (email) =>
  api.post('/auth/forgot-password', { email }).then((r) => r.data);

export const resetPassword = (token, password) =>
  api.put(`/auth/reset-password/${token}`, { password }).then((r) => r.data);

export default api;
