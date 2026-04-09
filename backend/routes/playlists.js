const express = require('express');
const router = express.Router();
const {
  getMyPlaylists,
  getPublicPlaylists,
  getPlaylist,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
} = require('../controllers/playlistController');
const { protect } = require('../middleware/auth');
const { validatePlaylist } = require('../middleware/validation');

router.get('/', protect, getMyPlaylists);
router.get('/public', getPublicPlaylists);
router.get('/:id', protect, getPlaylist);
router.post('/', protect, validatePlaylist, createPlaylist);
router.put('/:id', protect, updatePlaylist);
router.delete('/:id', protect, deletePlaylist);
router.post('/:id/songs', protect, addSongToPlaylist);
router.delete('/:id/songs/:songId', protect, removeSongFromPlaylist);

module.exports = router;
