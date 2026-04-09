import api from './authAPI';

export const getProfile = () =>
  api.get('/users/profile').then((r) => r.data);

export const updateProfile = (data) =>
  api.put('/users/profile', data).then((r) => r.data);

export const updatePassword = (currentPassword, newPassword) =>
  api.put('/users/password', { currentPassword, newPassword }).then((r) => r.data);

export const getFavorites = () =>
  api.get('/users/favorites').then((r) => r.data);

export const addFavorite = (songId) =>
  api.post(`/users/favorites/${encodeURIComponent(songId)}`).then((r) => r.data);

export const removeFavorite = (songId) =>
  api.delete(`/users/favorites/${encodeURIComponent(songId)}`).then((r) => r.data);

export const getRecentlyPlayed = () =>
  api.get('/users/recently-played').then((r) => r.data);

export const addRecentlyPlayed = (songData) =>
  api.post('/users/recently-played', songData).then((r) => r.data);

export const getMyPlaylists = () =>
  api.get('/playlists').then((r) => r.data);

export const createPlaylist = (data) =>
  api.post('/playlists', data).then((r) => r.data);

export const updatePlaylist = (id, data) =>
  api.put(`/playlists/${id}`, data).then((r) => r.data);

export const deletePlaylist = (id) =>
  api.delete(`/playlists/${id}`).then((r) => r.data);

export const addSongToPlaylist = (playlistId, songData) =>
  api.post(`/playlists/${playlistId}/songs`, songData).then((r) => r.data);

export const removeSongFromPlaylist = (playlistId, songId) =>
  api.delete(`/playlists/${playlistId}/songs/${encodeURIComponent(songId)}`).then((r) => r.data);
