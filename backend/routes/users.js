const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { songs } = require('../data/songs');
const { inMemoryUsers } = require('./auth');

let User;
try {
  User = require('../models/User');
} catch (e) {
  User = null;
}

const useDB = () => User && User.db && User.db.readyState === 1;

// GET /api/users/favorites - Get user's favorite songs
router.get('/favorites', authMiddleware, async (req, res) => {
  try {
    let favorites = [];
    if (useDB()) {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      favorites = user.favorites || [];
    } else {
      const user = inMemoryUsers.find(u => u.id === req.user.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      favorites = user.favorites || [];
    }
    const favSongs = favorites.map(id => songs.find(s => s.id === id)).filter(Boolean);
    res.json({ songs: favSongs, ids: favorites });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/users/favorites/:songId - Toggle favorite
router.post('/favorites/:songId', authMiddleware, async (req, res) => {
  try {
    const { songId } = req.params;
    const song = songs.find(s => s.id === songId);
    if (!song) return res.status(404).json({ message: 'Song not found' });

    if (useDB()) {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      const idx = user.favorites.indexOf(songId);
      if (idx > -1) {
        user.favorites.splice(idx, 1);
      } else {
        user.favorites.push(songId);
      }
      await user.save();
      return res.json({ favorites: user.favorites, liked: idx === -1 });
    }

    const user = inMemoryUsers.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const idx = (user.favorites || []).indexOf(songId);
    if (!user.favorites) user.favorites = [];
    if (idx > -1) {
      user.favorites.splice(idx, 1);
    } else {
      user.favorites.push(songId);
    }
    res.json({ favorites: user.favorites, liked: idx === -1 });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/users/recently-played - Get recently played songs
router.get('/recently-played', authMiddleware, async (req, res) => {
  try {
    let recentlyPlayed = [];
    if (useDB()) {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      recentlyPlayed = user.recentlyPlayed || [];
    } else {
      const user = inMemoryUsers.find(u => u.id === req.user.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      recentlyPlayed = user.recentlyPlayed || [];
    }
    const recent = recentlyPlayed
      .slice(-10)
      .reverse()
      .map(r => ({ ...songs.find(s => s.id === (r.songId || r)), playedAt: r.playedAt }))
      .filter(r => r.id);
    res.json({ songs: recent });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/users/recently-played/:songId - Record recently played
router.post('/recently-played/:songId', authMiddleware, async (req, res) => {
  try {
    const { songId } = req.params;
    if (useDB()) {
      await User.findByIdAndUpdate(req.user.id, {
        $push: { recentlyPlayed: { $each: [{ songId, playedAt: new Date() }], $slice: -20 } }
      });
      return res.json({ message: 'Recorded' });
    }
    const user = inMemoryUsers.find(u => u.id === req.user.id);
    if (user) {
      if (!user.recentlyPlayed) user.recentlyPlayed = [];
      user.recentlyPlayed.push({ songId, playedAt: new Date() });
      if (user.recentlyPlayed.length > 20) user.recentlyPlayed = user.recentlyPlayed.slice(-20);
    }
    res.json({ message: 'Recorded' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/users/profile - Update profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { username, bio, avatar } = req.body;
    if (useDB()) {
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { ...(username && { username }), ...(bio !== undefined && { bio }), ...(avatar && { avatar }) },
        { new: true, select: '-password' }
      );
      return res.json(user);
    }
    const user = inMemoryUsers.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (username) user.username = username;
    if (bio !== undefined) user.bio = bio;
    if (avatar) user.avatar = avatar;
    const { password: _, ...safeUser } = user;
    res.json(safeUser);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
