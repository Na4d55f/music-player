import api from './api.js';

export const userAPI = {
  getFavorites: async () => {
    try {
      const res = await api.get('/users/favorites');
      return res.data;
    } catch {
      return { songs: [], ids: [] };
    }
  },

  toggleFavorite: async (songId) => {
    try {
      const res = await api.post(`/users/favorites/${songId}`);
      return res.data;
    } catch {
      return null;
    }
  },

  getRecentlyPlayed: async () => {
    try {
      const res = await api.get('/users/recently-played');
      return res.data;
    } catch {
      return { songs: [] };
    }
  },

  recordRecentlyPlayed: async (songId) => {
    try {
      await api.post(`/users/recently-played/${songId}`);
    } catch {
      // silent fail
    }
  },

  updateProfile: async (data) => {
    const res = await api.put('/users/profile', data);
    return res.data;
  },
};
