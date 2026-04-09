const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Playlist name is required'],
      trim: true,
      maxlength: [100, 'Playlist name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      default: '',
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    songs: [
      {
        songId: { type: String, required: true },
        name: { type: String, required: true },
        artist: { type: String, required: true },
        album: { type: String, default: '' },
        image: { type: String, default: '' },
        duration: { type: Number, default: 0 },
        url: { type: String, default: '' },
        addedAt: { type: Date, default: Date.now },
      },
    ],
    isPublic: { type: Boolean, default: false },
    coverImage: { type: String, default: '' },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

playlistSchema.virtual('songCount').get(function () {
  return this.songs.length;
});

playlistSchema.index({ owner: 1 });
playlistSchema.index({ isPublic: 1 });
playlistSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Playlist', playlistSchema);
