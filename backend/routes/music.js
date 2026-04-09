const express = require('express');
const router = express.Router();
const {
  searchMusic,
  getTrending,
  getTopArtists,
  getArtistInfo,
  getAlbumInfo,
  getByGenre,
} = require('../controllers/musicController');
const { protect } = require('../middleware/auth');

router.get('/search', searchMusic);
router.get('/trending', getTrending);
router.get('/top-artists', getTopArtists);
router.get('/artist/:name', getArtistInfo);
router.get('/album/:artist/:album', getAlbumInfo);
router.get('/genre/:tag', getByGenre);

module.exports = router;
