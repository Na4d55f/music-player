const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    mbid: { type: String, default: '' },
    image: { type: String, default: '' },
    bio: { type: String, default: '' },
    tags: [{ type: String }],
    similarArtists: [{ type: String }],
    listeners: { type: Number, default: 0 },
    playCount: { type: Number, default: 0 },
    lastfmUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

artistSchema.index({ name: 'text' });
artistSchema.index({ mbid: 1 });
artistSchema.index({ listeners: -1 });

module.exports = mongoose.model('Artist', artistSchema);
