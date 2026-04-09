import { useEffect, useState } from 'react';
import { useMusic } from '../context/MusicContext.jsx';
import SongCard from '../components/SongCard.jsx';
import { musicAPI } from '../services/musicAPI.js';

export default function Favorites() {
  const { favorites } = useMusic();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { playSong } = useMusic();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await musicAPI.getSongs({ limit: 52 });
        const allSongs = data.songs || [];
        const favSongs = favorites.map(id => allSongs.find(s => s.id === id)).filter(Boolean);
        setSongs(favSongs);
      } catch {
        setSongs([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [favorites]);

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">❤️ Favorites</h1>
          <p className="text-slate-500 mt-1">{songs.length} liked songs</p>
        </div>
        {songs.length > 0 && (
          <button
            onClick={() => playSong(songs[0], songs)}
            className="btn-primary flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            Play All
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full spinner" />
        </div>
      ) : songs.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <svg className="w-16 h-16 mx-auto mb-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-slate-400 mb-2">No favorites yet</h3>
          <p className="text-slate-600 text-sm">Click the heart icon on any song to add it to your favorites</p>
        </div>
      ) : (
        <div className="glass rounded-2xl p-4 divide-y divide-white/5">
          {songs.map((song, idx) => (
            <SongCard key={song.id} song={song} songs={songs} compact showIndex={idx} />
          ))}
        </div>
      )}
    </div>
  );
}
