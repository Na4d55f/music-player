const mongoose = require('mongoose');

const songSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    artist: { type: String, required: true, trim: true },
    album: { type: String, default: '', trim: true },
    duration: { type: Number, default: 0 }, // seconds
    image: { type: String, default: '' },
    url: { type: String, default: '' }, // preview or stream url
    mbid: { type: String, default: '' }, // MusicBrainz ID
    lastfmUrl: { type: String, default: '' },
    tags: [{ type: String }],
    playCount: { type: Number, default: 0 },
    genre: { type: String, default: '' },
    year: { type: Number },
    lyrics: { type: String, default: '' },
  },
  { timestamps: true }
);

songSchema.index({ name: 'text', artist: 'text', album: 'text' });
songSchema.index({ mbid: 1 });
songSchema.index({ artist: 1 });
songSchema.index({ playCount: -1 });

module.exports = mongoose.model('Song', songSchema);
