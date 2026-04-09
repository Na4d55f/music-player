import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMusic } from '../context/MusicContext';
import { useAuth } from '../context/AuthContext';
import SongCard from '../components/SongCard';

export default function Home() {
  const { songs, playSong } = useMusic();
  const { user } = useAuth();
  const [activeGenre, setActiveGenre] = useState('All');

  const genres = ['All', 'Pop', 'Bollywood', 'Rock', 'Hip-Hop', 'R&B', 'Soul', 'Latin', 'K-Pop', 'Telugu', 'Punjabi'];
  const filtered = activeGenre === 'All' ? songs : songs.filter(s => s.genre.includes(activeGenre));
  const trending = [...songs].sort((a, b) => b.plays - a.plays).slice(0, 6);

  return (
    <div className="min-h-screen px-4 py-6 max-w-7xl mx-auto">
      <div className="relative rounded-2xl overflow-hidden mb-10 bg-gradient-to-r from-purple-900 via-blue-900 to-purple-900 p-8 md:p-12">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #8B5CF6 0%, transparent 50%), radial-gradient(circle at 80% 50%, #3B82F6 0%, transparent 50%)' }} />
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Your Music,<br />
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Unlimited.</span>
          </h1>
          <p className="text-gray-300 text-lg mb-6">55+ songs • All genres • No limits</p>
          <div className="flex gap-3">
            <button
              onClick={() => playSong(trending[0])}
              className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-full font-medium transition-colors"
            >
              ▶️ Play Trending
            </button>
            {!user && (
              <Link to="/register" className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full font-medium transition-colors">
                Sign Up Free
              </Link>
            )}
          </div>
        </div>
      </div>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-white mb-5">🔥 Trending Now</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {trending.map(song => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-4">🎵 All Songs</h2>
        <div className="flex gap-2 flex-wrap mb-5">
          {genres.map(g => (
            <button
              key={g}
              onClick={() => setActiveGenre(g)}
              className={`px-4 py-1.5 rounded-full text-sm transition-colors ${activeGenre === g ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}
            >
              {g}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map(song => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      </section>
    </div>
  );
}
