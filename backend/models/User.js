const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 30 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  avatar: { type: String, default: '' },
  bio: { type: String, default: '', maxlength: 200 },
  favorites: [{ type: String }],
  playlists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Playlist' }],
  recentlyPlayed: [{ songId: String, playedAt: { type: Date, default: Date.now } }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
