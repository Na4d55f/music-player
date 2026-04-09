const User = require('../models/User');
const logger = require('../utils/logger');

// GET /api/users/profile
const getProfile = async (req, res) => {
  res.json({ success: true, user: req.user });
};

// PUT /api/users/profile
const updateProfile = async (req, res, next) => {
  try {
    const { username, bio, avatar } = req.body;
    const updates = {};
    if (username !== undefined) updates.username = username;
    if (bio !== undefined) updates.bio = bio;
    if (avatar !== undefined) updates.avatar = avatar;

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// PUT /api/users/password
const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};

// POST /api/users/favorites/:songId
const addFavorite = async (req, res, next) => {
  try {
    const { songId } = req.params;
    const user = await User.findById(req.user._id);

    if (user.favorites.includes(songId)) {
      return res.json({ success: true, message: 'Already in favorites', favorites: user.favorites });
    }

    user.favorites.push(songId);
    await user.save();

    res.json({ success: true, favorites: user.favorites });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/users/favorites/:songId
const removeFavorite = async (req, res, next) => {
  try {
    const { songId } = req.params;
    await User.findByIdAndUpdate(req.user._id, { $pull: { favorites: songId } });
    const user = await User.findById(req.user._id);
    res.json({ success: true, favorites: user.favorites });
  } catch (error) {
    next(error);
  }
};

// GET /api/users/favorites
const getFavorites = async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ success: true, favorites: user.favorites });
};

// POST /api/users/recently-played
const addRecentlyPlayed = async (req, res, next) => {
  try {
    const { songId, songName, artist, image } = req.body;

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { recentlyPlayed: { songId } },
    });

    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        recentlyPlayed: {
          $each: [{ songId, songName, artist, image }],
          $position: 0,
          $slice: 30,
        },
      },
    });

    res.json({ success: true, message: 'Added to recently played' });
  } catch (error) {
    next(error);
  }
};

// GET /api/users/recently-played
const getRecentlyPlayed = async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ success: true, recentlyPlayed: user.recentlyPlayed });
};

module.exports = {
  getProfile,
  updateProfile,
  updatePassword,
  addFavorite,
  removeFavorite,
  getFavorites,
  addRecentlyPlayed,
  getRecentlyPlayed,
};
