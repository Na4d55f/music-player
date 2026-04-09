import api from './authAPI';

export const searchMusic = (q, type = 'track', page = 1) =>
  api.get('/music/search', { params: { q, type, page } }).then((r) => r.data);

export const getTrending = (limit = 20) =>
  api.get('/music/trending', { params: { limit } }).then((r) => r.data);

export const getTopArtists = (limit = 20) =>
  api.get('/music/top-artists', { params: { limit } }).then((r) => r.data);

export const getArtistInfo = (name) =>
  api.get(`/music/artist/${encodeURIComponent(name)}`).then((r) => r.data);

export const getAlbumInfo = (artist, album) =>
  api.get(`/music/album/${encodeURIComponent(artist)}/${encodeURIComponent(album)}`).then((r) => r.data);

export const getByGenre = (tag, limit = 20) =>
  api.get(`/music/genre/${encodeURIComponent(tag)}`, { params: { limit } }).then((r) => r.data);
