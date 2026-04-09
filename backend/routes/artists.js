const express = require('express');
const router = express.Router();
const { getArtistInfo, getTopArtists } = require('../controllers/musicController');

router.get('/', getTopArtists);
router.get('/:name', getArtistInfo);

module.exports = router;
