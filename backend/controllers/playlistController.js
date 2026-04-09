const Playlist = require('../models/Playlist');
const { MAX_PLAYLIST_SONGS, MAX_PLAYLISTS_PER_USER } = require('../config/constants');
const logger = require('../utils/logger');

// GET /api/playlists
const getMyPlaylists = async (req, res, next) => {
  try {
    const playlists = await Playlist.find({ owner: req.user._id }).sort({ updatedAt: -1 });
    res.json({ success: true, playlists });
  } catch (error) {
    next(error);
  }
};

// GET /api/playlists/public
const getPublicPlaylists = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [playlists, total] = await Promise.all([
      Playlist.find({ isPublic: true })
        .populate('owner', 'username avatar')
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Playlist.countDocuments({ isPublic: true }),
    ]);

    res.json({ success: true, playlists, total, page: parseInt(page) });
  } catch (error) {
    next(error);
  }
};

// GET /api/playlists/:id
const getPlaylist = async (req, res, next) => {
  try {
    const playlist = await Playlist.findById(req.params.id).populate('owner', 'username avatar');

    if (!playlist) {
      return res.status(404).json({ success: false, message: 'Playlist not found' });
    }

    const isOwner = playlist.owner._id.toString() === req.user?._id?.toString();
    if (!playlist.isPublic && !isOwner) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.json({ success: true, playlist });
  } catch (error) {
    next(error);
  }
};

// POST /api/playlists
const createPlaylist = async (req, res, next) => {
  try {
    const count = await Playlist.countDocuments({ owner: req.user._id });
    if (count >= MAX_PLAYLISTS_PER_USER) {
      return res.status(400).json({ success: false, message: `Maximum ${MAX_PLAYLISTS_PER_USER} playlists allowed` });
    }

    const { name, description, isPublic, coverImage } = req.body;
    const playlist = await Playlist.create({
      name,
      description,
      isPublic: isPublic || false,
      coverImage: coverImage || '',
      owner: req.user._id,
    });

    res.status(201).json({ success: true, playlist });
  } catch (error) {
    next(error);
  }
};

// PUT /api/playlists/:id
const updatePlaylist = async (req, res, next) => {
  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ success: false, message: 'Playlist not found' });
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const { name, description, isPublic, coverImage } = req.body;
    if (name !== undefined) playlist.name = name;
    if (description !== undefined) playlist.description = description;
    if (isPublic !== undefined) playlist.isPublic = isPublic;
    if (coverImage !== undefined) playlist.coverImage = coverImage;

    await playlist.save();
    res.json({ success: true, playlist });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/playlists/:id
const deletePlaylist = async (req, res, next) => {
  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ success: false, message: 'Playlist not found' });
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await playlist.deleteOne();
    res.json({ success: true, message: 'Playlist deleted' });
  } catch (error) {
    next(error);
  }
};

// POST /api/playlists/:id/songs
const addSongToPlaylist = async (req, res, next) => {
  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ success: false, message: 'Playlist not found' });
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (playlist.songs.length >= MAX_PLAYLIST_SONGS) {
      return res.status(400).json({ success: false, message: `Maximum ${MAX_PLAYLIST_SONGS} songs per playlist` });
    }

    const { songId, name, artist, album, image, duration, url } = req.body;

    const alreadyExists = playlist.songs.some((s) => s.songId === songId);
    if (alreadyExists) {
      return res.json({ success: true, message: 'Song already in playlist', playlist });
    }

    playlist.songs.push({ songId, name, artist, album, image, duration, url });
    await playlist.save();

    res.json({ success: true, playlist });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/playlists/:id/songs/:songId
const removeSongFromPlaylist = async (req, res, next) => {
  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ success: false, message: 'Playlist not found' });
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    playlist.songs = playlist.songs.filter((s) => s.songId !== req.params.songId);
    await playlist.save();

    res.json({ success: true, playlist });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyPlaylists,
  getPublicPlaylists,
  getPlaylist,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
};
