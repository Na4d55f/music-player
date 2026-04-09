// Mock music data for offline/no-backend mode
const MOCK_SONGS = [
  { id: "1", title: "Electric Dreams", artist: "SynthWave Collective", artistId: "a1", album: "Neon Horizons", albumId: "al1", duration: 214, genre: "Electronic", year: 2023, coverUrl: "https://picsum.photos/seed/song1/300/300", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", plays: 1245000 },
  { id: "2", title: "Midnight Jazz", artist: "Blue Note Ensemble", artistId: "a2", album: "After Hours", albumId: "al2", duration: 287, genre: "Jazz", year: 2022, coverUrl: "https://picsum.photos/seed/song2/300/300", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", plays: 892000 },
  { id: "3", title: "Mountain Echo", artist: "Acoustic Journey", artistId: "a3", album: "Nature Sounds", albumId: "al3", duration: 198, genre: "Folk", year: 2023, coverUrl: "https://picsum.photos/seed/song3/300/300", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", plays: 654000 },
  { id: "4", title: "City Lights", artist: "Urban Beats", artistId: "a4", album: "Downtown", albumId: "al4", duration: 223, genre: "Hip-Hop", year: 2023, coverUrl: "https://picsum.photos/seed/song4/300/300", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", plays: 2100000 },
  { id: "5", title: "Ocean Waves", artist: "Chill Vibes", artistId: "a5", album: "Relaxation Vol. 1", albumId: "al5", duration: 312, genre: "Ambient", year: 2022, coverUrl: "https://picsum.photos/seed/song5/300/300", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3", plays: 3200000 },
  { id: "6", title: "Rock Anthem", artist: "Thunder Road", artistId: "a6", album: "Live Fast", albumId: "al6", duration: 241, genre: "Rock", year: 2021, coverUrl: "https://picsum.photos/seed/song6/300/300", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3", plays: 1800000 },
  { id: "7", title: "Tropical Sunset", artist: "Beach House Band", artistId: "a7", album: "Paradise", albumId: "al7", duration: 195, genre: "Reggae", year: 2023, coverUrl: "https://picsum.photos/seed/song7/300/300", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3", plays: 756000 },
  { id: "8", title: "Classical Reverie", artist: "Philharmonic Dreams", artistId: "a8", album: "Masterworks", albumId: "al8", duration: 342, genre: "Classical", year: 2020, coverUrl: "https://picsum.photos/seed/song8/300/300", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3", plays: 432000 },
  { id: "9", title: "Dance Floor", artist: "DJ Pulse", artistId: "a9", album: "Club Night", albumId: "al9", duration: 267, genre: "Dance", year: 2023, coverUrl: "https://picsum.photos/seed/song9/300/300", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3", plays: 4500000 },
  { id: "10", title: "Soul Kitchen", artist: "Motown Groove", artistId: "a10", album: "Old School", albumId: "al10", duration: 228, genre: "Soul", year: 2022, coverUrl: "https://picsum.photos/seed/song10/300/300", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3", plays: 967000 },
  { id: "11", title: "Stargazer", artist: "Cosmos Band", artistId: "a11", album: "Infinite Space", albumId: "al11", duration: 256, genre: "Electronic", year: 2023, coverUrl: "https://picsum.photos/seed/song11/300/300", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3", plays: 1123000 },
  { id: "12", title: "Country Road", artist: "Southern Comfort", artistId: "a12", album: "Heartland", albumId: "al12", duration: 219, genre: "Country", year: 2021, coverUrl: "https://picsum.photos/seed/song12/300/300", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3", plays: 834000 },
  { id: "13", title: "Funk Machine", artist: "Groove Masters", artistId: "a13", album: "Funky Business", albumId: "al13", duration: 243, genre: "Funk", year: 2022, coverUrl: "https://picsum.photos/seed/song13/300/300", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3", plays: 678000 },
  { id: "14", title: "Blues Journey", artist: "Delta Kings", artistId: "a14", album: "Crossroads", albumId: "al14", duration: 298, genre: "Blues", year: 2020, coverUrl: "https://picsum.photos/seed/song14/300/300", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3", plays: 523000 },
  { id: "15", title: "Pop Sensation", artist: "Bright Stars", artistId: "a15", album: "Summer Hits", albumId: "al15", duration: 188, genre: "Pop", year: 2023, coverUrl: "https://picsum.photos/seed/song15/300/300", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3", plays: 5600000 },
  { id: "16", title: "Metal Storm", artist: "Iron Thunder", artistId: "a16", album: "Rage Unleashed", albumId: "al16", duration: 276, genre: "Metal", year: 2022, coverUrl: "https://picsum.photos/seed/song16/300/300", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3", plays: 987000 },
  { id: "17", title: "Indie Vibes", artist: "Cafe Wanderer", artistId: "a17", album: "Coffee Shop", albumId: "al17", duration: 214, genre: "Indie", year: 2023, coverUrl: "https://picsum.photos/seed/song17/300/300", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3", plays: 743000 },
  { id: "18", title: "Latin Fire", artist: "Salsa Kings", artistId: "a18", album: "Caliente", albumId: "al18", duration: 232, genre: "Latin", year: 2023, coverUrl: "https://picsum.photos/seed/song18/300/300", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", plays: 1340000 },
  { id: "19", title: "R&B Nights", artist: "Smooth Operator", artistId: "a19", album: "After Midnight", albumId: "al19", duration: 251, genre: "R&B", year: 2022, coverUrl: "https://picsum.photos/seed/song19/300/300", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", plays: 2300000 },
  { id: "20", title: "Gospel Glory", artist: "Heavenly Choir", artistId: "a20", album: "Spirit Rising", albumId: "al20", duration: 318, genre: "Gospel", year: 2021, coverUrl: "https://picsum.photos/seed/song20/300/300", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", plays: 456000 },
  { id: "21", title: "Dreaming Deep", artist: "SynthWave Collective", artistId: "a1", album: "Neon Horizons", albumId: "al1", duration: 234, genre: "Electronic", year: 2023, coverUrl: "https://picsum.photos/seed/song21/300/300", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", plays: 876000 },
  { id: "22", title: "Jazz Odyssey", artist: "Blue Note Ensemble", artistId: "a2", album: "After Hours", albumId: "al2", duration: 304, genre: "Jazz", year: 2022, coverUrl: "https://picsum.photos/seed/song22/300/300", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3", plays: 543000 },
  { id: "23", title: "Wild Heart", artist: "Thunder Road", artistId: "a6", album: "Live Fast", albumId: "al6", duration: 258, genre: "Rock", year: 2021, coverUrl: "https://picsum.photos/seed/song23/300/300", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3", plays: 1230000 },
  { id: "24", title: "Sunrise Melody", artist: "Acoustic Journey", artistId: "a3", album: "Nature Sounds", albumId: "al3", duration: 211, genre: "Folk", year: 2023, coverUrl: "https://picsum.photos/seed/song24/300/300", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3", plays: 432000 },
  { id: "25", title: "Urban Flow", artist: "Urban Beats", artistId: "a4", album: "Downtown", albumId: "al4", duration: 237, genre: "Hip-Hop", year: 2023, coverUrl: "https://picsum.photos/seed/song25/300/300", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3", plays: 3400000 },
  { id: "26", title: "Summer Breeze", artist: "Beach House Band", artistId: "a7", album: "Paradise", albumId: "al7", duration: 207, genre: "Reggae", year: 2023, coverUrl: "https://picsum.photos/seed/song26/300/300", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3", plays: 678000 },
  { id: "27", title: "Neon Pulse", artist: "DJ Pulse", artistId: "a9", album: "Club Night", albumId: "al9", duration: 278, genre: "Dance", year: 2023, coverUrl: "https://picsum.photos/seed/song27/300/300", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3", plays: 5100000 },
  { id: "28", title: "Deep Soul", artist: "Motown Groove", artistId: "a10", album: "Old School", albumId: "al10", duration: 246, genre: "Soul", year: 2022, coverUrl: "https://picsum.photos/seed/song28/300/300", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3", plays: 789000 },
  { id: "29", title: "Galaxy Run", artist: "Cosmos Band", artistId: "a11", album: "Infinite Space", albumId: "al11", duration: 261, genre: "Electronic", year: 2023, coverUrl: "https://picsum.photos/seed/song29/300/300", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3", plays: 934000 },
  { id: "30", title: "Honky Tonk", artist: "Southern Comfort", artistId: "a12", album: "Heartland", albumId: "al12", duration: 208, genre: "Country", year: 2021, coverUrl: "https://picsum.photos/seed/song30/300/300", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3", plays: 612000 },
];

const MOCK_ARTISTS = [
  { id: "a1", name: "SynthWave Collective", genre: "Electronic", imageUrl: "https://picsum.photos/seed/artist1/300/300", followers: 125000 },
  { id: "a2", name: "Blue Note Ensemble", genre: "Jazz", imageUrl: "https://picsum.photos/seed/artist2/300/300", followers: 89000 },
  { id: "a3", name: "Acoustic Journey", genre: "Folk", imageUrl: "https://picsum.photos/seed/artist3/300/300", followers: 67000 },
  { id: "a4", name: "Urban Beats", genre: "Hip-Hop", imageUrl: "https://picsum.photos/seed/artist4/300/300", followers: 340000 },
  { id: "a5", name: "Chill Vibes", genre: "Ambient", imageUrl: "https://picsum.photos/seed/artist5/300/300", followers: 210000 },
  { id: "a6", name: "Thunder Road", genre: "Rock", imageUrl: "https://picsum.photos/seed/artist6/300/300", followers: 156000 },
  { id: "a7", name: "Beach House Band", genre: "Reggae", imageUrl: "https://picsum.photos/seed/artist7/300/300", followers: 78000 },
  { id: "a8", name: "Philharmonic Dreams", genre: "Classical", imageUrl: "https://picsum.photos/seed/artist8/300/300", followers: 45000 },
  { id: "a9", name: "DJ Pulse", genre: "Dance", imageUrl: "https://picsum.photos/seed/artist9/300/300", followers: 567000 },
  { id: "a10", name: "Motown Groove", genre: "Soul", imageUrl: "https://picsum.photos/seed/artist10/300/300", followers: 92000 },
];

const GENRES = ["Electronic", "Jazz", "Folk", "Hip-Hop", "Ambient", "Rock", "Reggae", "Classical", "Dance", "Soul", "Country", "Funk", "Blues", "Pop", "Metal", "Indie", "Latin", "R&B", "Gospel"];

import api from './api.js';

const withFallback = async (apiCall, fallbackFn) => {
  try {
    return await apiCall();
  } catch {
    return fallbackFn();
  }
};

export const musicAPI = {
  getSongs: (params = {}) => withFallback(
    async () => {
      const res = await api.get('/music/songs', { params });
      return res.data;
    },
    () => {
      let songs = [...MOCK_SONGS];
      if (params.genre) songs = songs.filter(s => s.genre.toLowerCase() === params.genre.toLowerCase());
      if (params.search) {
        const q = params.search.toLowerCase();
        songs = songs.filter(s => s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q));
      }
      return { songs: songs.slice(0, params.limit || 50), total: songs.length };
    }
  ),

  getTrending: () => withFallback(
    async () => { const res = await api.get('/music/songs/trending'); return res.data; },
    () => ({ songs: [...MOCK_SONGS].sort((a, b) => b.plays - a.plays).slice(0, 10) })
  ),

  getRecent: () => withFallback(
    async () => { const res = await api.get('/music/songs/recent'); return res.data; },
    () => ({ songs: MOCK_SONGS.slice(-8).reverse() })
  ),

  getSong: (id) => withFallback(
    async () => { const res = await api.get(`/music/songs/${id}`); return res.data; },
    () => MOCK_SONGS.find(s => s.id === id) || null
  ),

  getArtists: (params = {}) => withFallback(
    async () => { const res = await api.get('/music/artists', { params }); return res.data; },
    () => ({ artists: MOCK_ARTISTS })
  ),

  getArtist: (id) => withFallback(
    async () => { const res = await api.get(`/music/artists/${id}`); return res.data; },
    () => {
      const artist = MOCK_ARTISTS.find(a => a.id === id);
      const songs = MOCK_SONGS.filter(s => s.artistId === id);
      return { ...artist, songs };
    }
  ),

  getGenres: () => withFallback(
    async () => { const res = await api.get('/music/genres'); return res.data; },
    () => ({ genres: GENRES })
  ),

  search: (q) => withFallback(
    async () => { const res = await api.get('/music/search', { params: { q } }); return res.data; },
    () => {
      const query = q.toLowerCase();
      return {
        songs: MOCK_SONGS.filter(s => s.title.toLowerCase().includes(query) || s.artist.toLowerCase().includes(query) || s.genre.toLowerCase().includes(query)).slice(0, 20),
        artists: MOCK_ARTISTS.filter(a => a.name.toLowerCase().includes(query) || a.genre.toLowerCase().includes(query)).slice(0, 10)
      };
    }
  ),

  getRecommendations: (genre) => withFallback(
    async () => { const res = await api.get('/music/recommendations', { params: { genre } }); return res.data; },
    () => ({ songs: [...MOCK_SONGS].sort(() => Math.random() - 0.5).slice(0, 10) })
  ),
};
