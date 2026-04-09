const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  updatePassword,
  addFavorite,
  removeFavorite,
  getFavorites,
  addRecentlyPlayed,
  getRecentlyPlayed,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, updatePassword);
router.get('/favorites', protect, getFavorites);
router.post('/favorites/:songId', protect, addFavorite);
router.delete('/favorites/:songId', protect, removeFavorite);
router.get('/recently-played', protect, getRecentlyPlayed);
router.post('/recently-played', protect, addRecentlyPlayed);

module.exports = router;
