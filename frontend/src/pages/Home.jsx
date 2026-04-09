import React, { useState, useEffect, useCallback } from 'react';
import SongCard from '../components/SongCard';
import { useMusic } from '../context/MusicContext';
import { fetchTracks } from '../api/jamendo';

const GENRES = [
  { label: 'All', value: '' },
  { label: '🎸 Rock', value: 'rock' },
  { label: '🎷 Jazz', value: 'jazz' },
  { label: '⚡ Electronic', value: 'electronic' },
  { label: '🎤 Pop', value: 'pop' },
  { label: '🎻 Classical', value: 'classical' },
  { label: '🌊 Ambient', value: 'ambient' },
  { label: '🥁 Hip-Hop', value: 'hiphop' },
];

async function fetchTracksLocal(params = {}) {
  return fetchTracks(params);
}

export default function Home() {
  const [trending, setTrending] = useState([]);
  const [genreSongs, setGenreSongs] = useState([]);
  const [activeGenre, setActiveGenre] = useState('');
  const [loading, setLoading] = useState(true);
  const [genreLoading, setGenreLoading] = useState(false);
  const { recentlyPlayed, playSong } = useMusic();

  useEffect(() => {
    fetchTracksLocal({ order: 'popularity_total', limit: 20 })
      .then(setTrending)
      .finally(() => setLoading(false));
  }, []);

  const loadGenre = useCallback(async (tag) => {
    setActiveGenre(tag);
    if (!tag) {
      setGenreSongs([]);
      return;
    }
    setGenreLoading(true);
    try {
      const tracks = await fetchTracksLocal({ tags: tag, order: 'popularity_total', limit: 10 });
      setGenreSongs(tracks);
    } catch {
      setGenreSongs([]);
    } finally {
      setGenreLoading(false);
    }
  }, []);

  const displaySongs = activeGenre ? genreSongs : trending;

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div
        className="relative rounded-2xl overflow-hidden p-8 md:p-12"
        style={{
          background: 'linear-gradient(135deg, rgba(124,58,237,0.4) 0%, rgba(6,182,212,0.3) 50%, rgba(37,99,235,0.4) 100%)',
          border: '1px solid rgba(124,58,237,0.3)',
        }}
      >
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 80% 50%, rgba(124,58,237,0.2) 0%, transparent 60%)' }} />
        <div className="relative z-10">
          <h1 className="text-3xl md:text-5xl font-bold mb-3">
            Discover <span className="gradient-text">Free Music</span>
          </h1>
          <p className="text-white/70 text-lg mb-6 max-w-xl">
            Stream thousands of tracks from independent artists — completely free, powered by Jamendo.
          </p>
          <button
            onClick={() => trending[0] && playSong(trending[0], trending)}
            className="btn-primary flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            Play Trending
          </button>
        </div>
      </div>

      {/* Genre filters */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Browse by Genre</h2>
        <div className="flex gap-2 flex-wrap">
          {GENRES.map((g) => (
            <button
              key={g.value}
              onClick={() => loadGenre(g.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeGenre === g.value
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/30'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Song list */}
      <div>
        <h2 className="text-lg font-semibold mb-3">
          {activeGenre
            ? GENRES.find((g) => g.value === activeGenre)?.label + ' Songs'
            : '🔥 Trending Now'}
        </h2>

        {loading || genreLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : displaySongs.length > 0 ? (
          <div className="space-y-1">
            {displaySongs.map((song, i) => (
              <SongCard key={song.id} song={song} queue={displaySongs} showIndex={i} />
            ))}
          </div>
        ) : (
          <p className="text-white/40 text-center py-8">No songs found for this genre.</p>
        )}
      </div>

      {/* Recently played */}
      {recentlyPlayed.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">🕐 Recently Played</h2>
          <div className="space-y-1">
            {recentlyPlayed.slice(0, 5).map((song, i) => (
              <SongCard key={song.id} song={song} queue={recentlyPlayed} showIndex={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
