const express = require('express');
const router = express.Router();
const { songs, artists, genres } = require('../data/songs');

// GET /api/music/songs - Get all songs with optional filters
router.get('/songs', (req, res) => {
  try {
    const { genre, artist, search, limit = 50, offset = 0 } = req.query;
    let filtered = [...songs];

    if (genre) filtered = filtered.filter(s => s.genre.toLowerCase() === genre.toLowerCase());
    if (artist) filtered = filtered.filter(s => s.artist.toLowerCase().includes(artist.toLowerCase()));
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(s =>
        s.title.toLowerCase().includes(q) ||
        s.artist.toLowerCase().includes(q) ||
        s.album.toLowerCase().includes(q) ||
        s.genre.toLowerCase().includes(q)
      );
    }

    const total = filtered.length;
    const paginated = filtered.slice(Number(offset), Number(offset) + Number(limit));
    res.json({ songs: paginated, total, limit: Number(limit), offset: Number(offset) });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/music/songs/trending - Get trending songs
router.get('/songs/trending', (req, res) => {
  const trending = [...songs].sort((a, b) => b.plays - a.plays).slice(0, 10);
  res.json({ songs: trending });
});

// GET /api/music/songs/recent - Get recently added songs
router.get('/songs/recent', (req, res) => {
  const recent = [...songs].slice(-10).reverse();
  res.json({ songs: recent });
});

// GET /api/music/songs/:id - Get a specific song
router.get('/songs/:id', (req, res) => {
  const song = songs.find(s => s.id === req.params.id);
  if (!song) return res.status(404).json({ message: 'Song not found' });
  res.json(song);
});

// GET /api/music/artists - Get all artists
router.get('/artists', (req, res) => {
  const { search, genre } = req.query;
  let filtered = [...artists];
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(a => a.name.toLowerCase().includes(q));
  }
  if (genre) filtered = filtered.filter(a => a.genre.toLowerCase() === genre.toLowerCase());
  res.json({ artists: filtered });
});

// GET /api/music/artists/:id - Get a specific artist
router.get('/artists/:id', (req, res) => {
  const artist = artists.find(a => a.id === req.params.id);
  if (!artist) return res.status(404).json({ message: 'Artist not found' });
  const artistSongs = songs.filter(s => s.artistId === req.params.id);
  res.json({ ...artist, songs: artistSongs });
});

// GET /api/music/genres - Get all genres
router.get('/genres', (req, res) => {
  res.json({ genres });
});

// GET /api/music/search - Search across songs and artists
router.get('/search', (req, res) => {
  const { q } = req.query;
  if (!q) return res.json({ songs: [], artists: [] });
  const query = q.toLowerCase();

  const foundSongs = songs.filter(s =>
    s.title.toLowerCase().includes(query) ||
    s.artist.toLowerCase().includes(query) ||
    s.album.toLowerCase().includes(query) ||
    s.genre.toLowerCase().includes(query)
  ).slice(0, 20);

  const foundArtists = artists.filter(a =>
    a.name.toLowerCase().includes(query) ||
    a.genre.toLowerCase().includes(query)
  ).slice(0, 10);

  res.json({ songs: foundSongs, artists: foundArtists });
});

// GET /api/music/recommendations - Get music recommendations
router.get('/recommendations', (req, res) => {
  const { genre } = req.query;
  let recs;
  if (genre) {
    recs = songs.filter(s => s.genre.toLowerCase() === genre.toLowerCase());
    if (recs.length < 5) recs = songs;
  } else {
    recs = songs;
  }
  // Return 10 random songs
  const shuffled = recs.sort(() => Math.random() - 0.5).slice(0, 10);
  res.json({ songs: shuffled });
});

module.exports = router;
