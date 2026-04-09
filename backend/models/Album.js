const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    artist: { type: String, required: true, trim: true },
    mbid: { type: String, default: '' },
    image: { type: String, default: '' },
    releaseDate: { type: String, default: '' },
    tracks: [
      {
        name: String,
        duration: Number,
        url: String,
        rank: Number,
      },
    ],
    tags: [{ type: String }],
    lastfmUrl: { type: String, default: '' },
    listeners: { type: Number, default: 0 },
    playCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

albumSchema.index({ name: 'text', artist: 'text' });
albumSchema.index({ artist: 1 });
albumSchema.index({ mbid: 1 });

module.exports = mongoose.model('Album', albumSchema);
