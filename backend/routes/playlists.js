const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { songs } = require('../data/songs');

// In-memory playlist store (used when MongoDB is not connected)
const inMemoryPlaylists = [];

let Playlist;
try {
  Playlist = require('../models/Playlist');
} catch (e) {
  Playlist = null;
}

const useDB = () => Playlist && Playlist.db && Playlist.db.readyState === 1;

// GET /api/playlists - Get user's playlists
router.get('/', authMiddleware, async (req, res) => {
  try {
    if (useDB()) {
      const playlists = await Playlist.find({ owner: req.user.id });
      return res.json({ playlists });
    }
    const playlists = inMemoryPlaylists.filter(p => p.owner === req.user.id);
    res.json({ playlists });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/playlists - Create a playlist
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, description, isPublic } = req.body;
    if (!name) return res.status(400).json({ message: 'Playlist name is required' });

    if (useDB()) {
      const playlist = await Playlist.create({ name, description: description || '', owner: req.user.id, songs: [], isPublic: isPublic || false });
      return res.status(201).json(playlist);
    }
    const playlist = {
      id: Date.now().toString(), name, description: description || '',
      owner: req.user.id, songs: [], isPublic: isPublic || false,
      coverUrl: '', createdAt: new Date(), updatedAt: new Date()
    };
    inMemoryPlaylists.push(playlist);
    res.status(201).json(playlist);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/playlists/:id - Get a specific playlist
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    let playlist;
    if (useDB()) {
      playlist = await Playlist.findById(req.params.id);
    } else {
      playlist = inMemoryPlaylists.find(p => p.id === req.params.id);
    }
    if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
    const ownerId = playlist.owner?.toString() || playlist.owner;
    if (ownerId !== req.user.id && !playlist.isPublic) {
      return res.status(403).json({ message: 'Access denied' });
    }
    // Enrich with song data
    const songData = (playlist.songs || []).map(id => songs.find(s => s.id === id)).filter(Boolean);
    res.json({ ...playlist.toObject?.() || playlist, songData });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/playlists/:id - Update a playlist
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, description, isPublic } = req.body;
    if (useDB()) {
      const playlist = await Playlist.findOneAndUpdate(
        { _id: req.params.id, owner: req.user.id },
        { name, description, isPublic, updatedAt: Date.now() },
        { new: true }
      );
      if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
      return res.json(playlist);
    }
    const idx = inMemoryPlaylists.findIndex(p => p.id === req.params.id && p.owner === req.user.id);
    if (idx === -1) return res.status(404).json({ message: 'Playlist not found' });
    inMemoryPlaylists[idx] = { ...inMemoryPlaylists[idx], name: name || inMemoryPlaylists[idx].name, description: description ?? inMemoryPlaylists[idx].description, isPublic: isPublic ?? inMemoryPlaylists[idx].isPublic, updatedAt: new Date() };
    res.json(inMemoryPlaylists[idx]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/playlists/:id - Delete a playlist
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    if (useDB()) {
      const playlist = await Playlist.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
      if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
      return res.json({ message: 'Playlist deleted' });
    }
    const idx = inMemoryPlaylists.findIndex(p => p.id === req.params.id && p.owner === req.user.id);
    if (idx === -1) return res.status(404).json({ message: 'Playlist not found' });
    inMemoryPlaylists.splice(idx, 1);
    res.json({ message: 'Playlist deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/playlists/:id/songs - Add song to playlist
router.post('/:id/songs', authMiddleware, async (req, res) => {
  try {
    const { songId } = req.body;
    if (!songId) return res.status(400).json({ message: 'Song ID required' });
    if (useDB()) {
      const playlist = await Playlist.findOne({ _id: req.params.id, owner: req.user.id });
      if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
      if (!playlist.songs.includes(songId)) playlist.songs.push(songId);
      await playlist.save();
      return res.json(playlist);
    }
    const playlist = inMemoryPlaylists.find(p => p.id === req.params.id && p.owner === req.user.id);
    if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
    if (!playlist.songs.includes(songId)) playlist.songs.push(songId);
    playlist.updatedAt = new Date();
    res.json(playlist);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/playlists/:id/songs/:songId - Remove song from playlist
router.delete('/:id/songs/:songId', authMiddleware, async (req, res) => {
  try {
    if (useDB()) {
      const playlist = await Playlist.findOne({ _id: req.params.id, owner: req.user.id });
      if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
      playlist.songs = playlist.songs.filter(s => s !== req.params.songId);
      await playlist.save();
      return res.json(playlist);
    }
    const playlist = inMemoryPlaylists.find(p => p.id === req.params.id && p.owner === req.user.id);
    if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
    playlist.songs = playlist.songs.filter(s => s !== req.params.songId);
    playlist.updatedAt = new Date();
    res.json(playlist);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
