const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'music_streaming_secret_key_2024';

// In-memory user store (used when MongoDB is not connected)
const inMemoryUsers = [];

let User;
try {
  User = require('../models/User');
} catch (e) {
  User = null;
}

// Helper: sign a token
const signToken = (user) => jwt.sign(
  { id: user._id || user.id, username: user.username, email: user.email },
  JWT_SECRET,
  { expiresIn: '7d' }
);

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const hashed = await bcrypt.hash(password, 12);

    if (User && User.db && User.db.readyState === 1) {
      const existing = await User.findOne({ $or: [{ email }, { username }] });
      if (existing) return res.status(400).json({ message: 'User already exists' });
      const user = await User.create({ username, email, password: hashed });
      const token = signToken(user);
      return res.status(201).json({ token, user: { id: user._id, username: user.username, email: user.email, favorites: [], recentlyPlayed: [] } });
    }

    // In-memory fallback
    const existing = inMemoryUsers.find(u => u.email === email || u.username === username);
    if (existing) return res.status(400).json({ message: 'User already exists' });
    const id = Date.now().toString();
    const user = { id, username, email, password: hashed, favorites: [], playlists: [], recentlyPlayed: [], createdAt: new Date() };
    inMemoryUsers.push(user);
    const token = signToken(user);
    return res.status(201).json({ token, user: { id, username, email, favorites: [], recentlyPlayed: [] } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    let user;
    if (User && User.db && User.db.readyState === 1) {
      user = await User.findOne({ email });
      if (!user) return res.status(401).json({ message: 'Invalid credentials' });
      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(401).json({ message: 'Invalid credentials' });
      const token = signToken(user);
      return res.json({ token, user: { id: user._id, username: user.username, email: user.email, favorites: user.favorites || [], recentlyPlayed: user.recentlyPlayed || [] } });
    }

    // In-memory fallback
    user = inMemoryUsers.find(u => u.email === email);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });
    const token = signToken(user);
    return res.json({ token, user: { id: user.id, username: user.username, email: user.email, favorites: user.favorites || [], recentlyPlayed: user.recentlyPlayed || [] } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/auth/me
router.get('/me', require('../middleware/auth'), async (req, res) => {
  try {
    let user;
    if (User && User.db && User.db.readyState === 1) {
      user = await User.findById(req.user.id).select('-password');
      if (!user) return res.status(404).json({ message: 'User not found' });
      return res.json({ id: user._id, username: user.username, email: user.email, favorites: user.favorites || [], recentlyPlayed: user.recentlyPlayed || [] });
    }
    user = inMemoryUsers.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const { password: _, ...safeUser } = user;
    return res.json(safeUser);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = { router, inMemoryUsers };
