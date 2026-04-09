const fetch = require('node-fetch');
const { LASTFM_BASE_URL, PAGINATION_LIMIT } = require('../config/constants');
const logger = require('../utils/logger');

const LASTFM_API_KEY = process.env.LASTFM_API_KEY;

const lastfmRequest = async (params) => {
  const url = new URL(LASTFM_BASE_URL);
  url.search = new URLSearchParams({
    ...params,
    api_key: LASTFM_API_KEY,
    format: 'json',
  }).toString();

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`LastFM API error: ${response.statusText}`);
  }
  return response.json();
};

const getImageUrl = (images) => {
  if (!images || !images.length) return '';
  const large = images.find((i) => i.size === 'extralarge') || images[images.length - 1];
  return large['#text'] || '';
};

// GET /api/music/search?q=query&type=track|artist|album&page=1
const searchMusic = async (req, res, next) => {
  try {
    const { q, type = 'track', page = 1, limit = PAGINATION_LIMIT } = req.query;

    if (!q) {
      return res.status(400).json({ success: false, message: 'Query parameter q is required' });
    }

    if (!LASTFM_API_KEY) {
      return res.json({ success: true, results: getMockResults(type, q), isMock: true });
    }

    let data;
    if (type === 'track') {
      data = await lastfmRequest({ method: 'track.search', track: q, page, limit });
      const tracks = data.results?.trackmatches?.track || [];
      return res.json({
        success: true,
        results: tracks.map((t) => ({
          id: t.mbid || `${t.artist}-${t.name}`,
          name: t.name,
          artist: t.artist,
          image: getImageUrl(t.image),
          url: t.url,
          listeners: parseInt(t.listeners || '0'),
          type: 'track',
        })),
        total: parseInt(data.results?.['opensearch:totalResults'] || '0'),
        page: parseInt(page),
      });
    } else if (type === 'artist') {
      data = await lastfmRequest({ method: 'artist.search', artist: q, page, limit });
      const artists = data.results?.artistmatches?.artist || [];
      return res.json({
        success: true,
        results: artists.map((a) => ({
          id: a.mbid || a.name,
          name: a.name,
          image: getImageUrl(a.image),
          url: a.url,
          listeners: parseInt(a.listeners || '0'),
          type: 'artist',
        })),
        total: parseInt(data.results?.['opensearch:totalResults'] || '0'),
        page: parseInt(page),
      });
    } else if (type === 'album') {
      data = await lastfmRequest({ method: 'album.search', album: q, page, limit });
      const albums = data.results?.albummatches?.album || [];
      return res.json({
        success: true,
        results: albums.map((a) => ({
          id: a.mbid || `${a.artist}-${a.name}`,
          name: a.name,
          artist: a.artist,
          image: getImageUrl(a.image),
          url: a.url,
          type: 'album',
        })),
        total: parseInt(data.results?.['opensearch:totalResults'] || '0'),
        page: parseInt(page),
      });
    }

    res.status(400).json({ success: false, message: 'Invalid search type' });
  } catch (error) {
    logger.error(`Music search error: ${error.message}`);
    next(error);
  }
};

// GET /api/music/trending
const getTrending = async (req, res, next) => {
  try {
    const { limit = 20 } = req.query;

    if (!LASTFM_API_KEY) {
      return res.json({ success: true, tracks: getMockTracks(), isMock: true });
    }

    const data = await lastfmRequest({ method: 'chart.gettoptracks', limit });
    const tracks = data.tracks?.track || [];

    res.json({
      success: true,
      tracks: tracks.map((t) => ({
        id: t.mbid || `${t.artist?.name}-${t.name}`,
        name: t.name,
        artist: t.artist?.name || '',
        image: getImageUrl(t.image),
        url: t.url,
        playCount: parseInt(t.playcount || '0'),
        listeners: parseInt(t.listeners || '0'),
        type: 'track',
      })),
    });
  } catch (error) {
    logger.error(`Trending tracks error: ${error.message}`);
    next(error);
  }
};

// GET /api/music/top-artists
const getTopArtists = async (req, res, next) => {
  try {
    const { limit = 20 } = req.query;

    if (!LASTFM_API_KEY) {
      return res.json({ success: true, artists: getMockArtists(), isMock: true });
    }

    const data = await lastfmRequest({ method: 'chart.gettopartists', limit });
    const artists = data.artists?.artist || [];

    res.json({
      success: true,
      artists: artists.map((a) => ({
        id: a.mbid || a.name,
        name: a.name,
        image: getImageUrl(a.image),
        url: a.url,
        listeners: parseInt(a.listeners || '0'),
        playCount: parseInt(a.playcount || '0'),
        type: 'artist',
      })),
    });
  } catch (error) {
    logger.error(`Top artists error: ${error.message}`);
    next(error);
  }
};

// GET /api/music/artist/:name
const getArtistInfo = async (req, res, next) => {
  try {
    const { name } = req.params;

    if (!LASTFM_API_KEY) {
      return res.json({ success: true, artist: getMockArtistInfo(name), isMock: true });
    }

    const [artistData, topTracksData] = await Promise.all([
      lastfmRequest({ method: 'artist.getinfo', artist: name }),
      lastfmRequest({ method: 'artist.gettoptracks', artist: name, limit: 10 }),
    ]);

    const artist = artistData.artist;
    const topTracks = topTracksData.toptracks?.track || [];

    res.json({
      success: true,
      artist: {
        name: artist.name,
        image: getImageUrl(artist.image),
        bio: artist.bio?.summary || '',
        tags: (artist.tags?.tag || []).map((t) => t.name),
        listeners: parseInt(artist.stats?.listeners || '0'),
        playCount: parseInt(artist.stats?.playcount || '0'),
        similarArtists: (artist.similar?.artist || []).map((a) => ({
          name: a.name,
          image: getImageUrl(a.image),
        })),
        topTracks: topTracks.map((t) => ({
          id: t.mbid || `${artist.name}-${t.name}`,
          name: t.name,
          image: getImageUrl(t.image),
          playCount: parseInt(t.playcount || '0'),
          listeners: parseInt(t.listeners || '0'),
        })),
      },
    });
  } catch (error) {
    logger.error(`Artist info error: ${error.message}`);
    next(error);
  }
};

// GET /api/music/album/:artist/:album
const getAlbumInfo = async (req, res, next) => {
  try {
    const { artist, album } = req.params;

    if (!LASTFM_API_KEY) {
      return res.json({ success: true, album: getMockAlbumInfo(artist, album), isMock: true });
    }

    const data = await lastfmRequest({ method: 'album.getinfo', artist, album });
    const albumData = data.album;

    res.json({
      success: true,
      album: {
        name: albumData.name,
        artist: albumData.artist,
        image: getImageUrl(albumData.image),
        tracks: (albumData.tracks?.track || []).map((t, i) => ({
          id: t.mbid || `${albumData.artist}-${t.name}`,
          name: t.name,
          duration: parseInt(t.duration || '0'),
          rank: i + 1,
          url: t.url,
        })),
        tags: (albumData.tags?.tag || []).map((t) => t.name),
        listeners: parseInt(albumData.listeners || '0'),
        playCount: parseInt(albumData.playcount || '0'),
      },
    });
  } catch (error) {
    logger.error(`Album info error: ${error.message}`);
    next(error);
  }
};

// GET /api/music/genre/:tag
const getByGenre = async (req, res, next) => {
  try {
    const { tag } = req.params;
    const { limit = 20 } = req.query;

    if (!LASTFM_API_KEY) {
      return res.json({ success: true, tracks: getMockTracks(), isMock: true });
    }

    const data = await lastfmRequest({ method: 'tag.gettoptracks', tag, limit });
    const tracks = data.tracks?.track || [];

    res.json({
      success: true,
      tracks: tracks.map((t) => ({
        id: t.mbid || `${t.artist?.name}-${t.name}`,
        name: t.name,
        artist: t.artist?.name || '',
        image: getImageUrl(t.image),
        url: t.url,
        type: 'track',
      })),
    });
  } catch (error) {
    logger.error(`Genre tracks error: ${error.message}`);
    next(error);
  }
};

// Mock data for when no API key is available
const getMockTracks = () => [
  { id: '1', name: 'Blinding Lights', artist: 'The Weeknd', image: 'https://picsum.photos/seed/track1/300/300', playCount: 3200000, listeners: 8500000, type: 'track' },
  { id: '2', name: 'Shape of You', artist: 'Ed Sheeran', image: 'https://picsum.photos/seed/track2/300/300', playCount: 2900000, listeners: 7800000, type: 'track' },
  { id: '3', name: 'Dance Monkey', artist: 'Tones and I', image: 'https://picsum.photos/seed/track3/300/300', playCount: 2700000, listeners: 7200000, type: 'track' },
  { id: '4', name: 'Rockstar', artist: 'Post Malone', image: 'https://picsum.photos/seed/track4/300/300', playCount: 2500000, listeners: 6900000, type: 'track' },
  { id: '5', name: 'Levitating', artist: 'Dua Lipa', image: 'https://picsum.photos/seed/track5/300/300', playCount: 2300000, listeners: 6600000, type: 'track' },
  { id: '6', name: 'Good 4 U', artist: 'Olivia Rodrigo', image: 'https://picsum.photos/seed/track6/300/300', playCount: 2100000, listeners: 6000000, type: 'track' },
  { id: '7', name: 'Stay', artist: 'The Kid LAROI', image: 'https://picsum.photos/seed/track7/300/300', playCount: 1950000, listeners: 5700000, type: 'track' },
  { id: '8', name: 'Peaches', artist: 'Justin Bieber', image: 'https://picsum.photos/seed/track8/300/300', playCount: 1800000, listeners: 5400000, type: 'track' },
  { id: '9', name: 'Bad Guy', artist: 'Billie Eilish', image: 'https://picsum.photos/seed/track9/300/300', playCount: 1700000, listeners: 5200000, type: 'track' },
  { id: '10', name: 'Watermelon Sugar', artist: 'Harry Styles', image: 'https://picsum.photos/seed/track10/300/300', playCount: 1600000, listeners: 4900000, type: 'track' },
  { id: '11', name: 'Mood', artist: '24kGoldn', image: 'https://picsum.photos/seed/track11/300/300', playCount: 1550000, listeners: 4700000, type: 'track' },
  { id: '12', name: 'Drivers License', artist: 'Olivia Rodrigo', image: 'https://picsum.photos/seed/track12/300/300', playCount: 1500000, listeners: 4500000, type: 'track' },
];

const getMockArtists = () => [
  { id: 'a1', name: 'The Weeknd', image: 'https://picsum.photos/seed/artist1/300/300', listeners: 18500000, type: 'artist' },
  { id: 'a2', name: 'Taylor Swift', image: 'https://picsum.photos/seed/artist2/300/300', listeners: 17800000, type: 'artist' },
  { id: 'a3', name: 'Drake', image: 'https://picsum.photos/seed/artist3/300/300', listeners: 16900000, type: 'artist' },
  { id: 'a4', name: 'Ed Sheeran', image: 'https://picsum.photos/seed/artist4/300/300', listeners: 16200000, type: 'artist' },
  { id: 'a5', name: 'Billie Eilish', image: 'https://picsum.photos/seed/artist5/300/300', listeners: 15700000, type: 'artist' },
  { id: 'a6', name: 'Dua Lipa', image: 'https://picsum.photos/seed/artist6/300/300', listeners: 14800000, type: 'artist' },
  { id: 'a7', name: 'Post Malone', image: 'https://picsum.photos/seed/artist7/300/300', listeners: 14200000, type: 'artist' },
  { id: 'a8', name: 'Ariana Grande', image: 'https://picsum.photos/seed/artist8/300/300', listeners: 13900000, type: 'artist' },
];

const getMockArtistInfo = (name) => ({
  name,
  image: 'https://picsum.photos/seed/artistinfo/400/400',
  bio: `${name} is a celebrated musician with a unique sound that has captivated millions of fans worldwide. Known for their innovative approach to music and spectacular live performances.`,
  tags: ['pop', 'indie', 'alternative'],
  listeners: 12500000,
  playCount: 450000000,
  similarArtists: [
    { name: 'Similar Artist 1', image: 'https://picsum.photos/seed/sim1/100/100' },
    { name: 'Similar Artist 2', image: 'https://picsum.photos/seed/sim2/100/100' },
  ],
  topTracks: getMockTracks().slice(0, 5).map((t) => ({ ...t, artist: name })),
});

const getMockAlbumInfo = (artist, album) => ({
  name: album,
  artist,
  image: 'https://picsum.photos/seed/album/400/400',
  tracks: Array.from({ length: 10 }, (_, i) => ({
    id: `track-${i + 1}`,
    name: `Track ${i + 1}`,
    duration: 180 + Math.floor(Math.random() * 120),
    rank: i + 1,
  })),
  tags: ['pop', 'electronic'],
  listeners: 5000000,
  playCount: 90000000,
});

const getMockResults = (type, q) => {
  if (type === 'track') return getMockTracks().filter((t) => t.name.toLowerCase().includes(q.toLowerCase()) || t.artist.toLowerCase().includes(q.toLowerCase()));
  if (type === 'artist') return getMockArtists().filter((a) => a.name.toLowerCase().includes(q.toLowerCase()));
  return [];
};

module.exports = {
  searchMusic,
  getTrending,
  getTopArtists,
  getArtistInfo,
  getAlbumInfo,
  getByGenre,
};
