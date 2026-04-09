import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { musicAPI } from '../services/musicAPI.js';
import SongCard from '../components/SongCard.jsx';
import ArtistCard from '../components/ArtistCard.jsx';
import { useMusic } from '../context/MusicContext.jsx';

export default function Home() {
  const [trending, setTrending] = useState([]);
  const [recent, setRecent] = useState([]);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const { playSong } = useMusic();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [trendingData, recentData, artistsData] = await Promise.all([
          musicAPI.getTrending(),
          musicAPI.getRecent(),
          musicAPI.getArtists(),
        ]);
        setTrending(trendingData.songs || []);
        setRecent(recentData.songs || []);
        setArtists((artistsData.artists || []).slice(0, 8));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl mb-8 p-8 lg:p-12"
        style={{ background: 'linear-gradient(135deg, #1a0533 0%, #0f1a33 50%, #001a2e 100%)' }}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl float-animation" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl float-animation" style={{animationDelay: '1s'}} />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            Now Streaming
          </div>
          <h1 className="text-3xl lg:text-5xl font-bold text-white mb-3">
            Your Music,<br />
            <span className="gradient-text">Your World</span>
          </h1>
          <p className="text-slate-400 text-lg mb-6 max-w-md">
            Discover, stream, and save your favorite music. 52+ songs from 20 artists across all genres.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => trending[0] && playSong(trending[0], trending)}
              className="btn-primary flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              Play Trending
            </button>
            <Link to="/browse" className="btn-secondary flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 6h16v2H4zm4 5h12v2H8zm5 5h7v2h-7z"/>
              </svg>
              Browse All
            </Link>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 mt-8">
            {[['52+', 'Songs'], ['20', 'Artists'], ['19', 'Genres'], ['Free', 'Forever']].map(([num, label]) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-bold gradient-text">{num}</p>
                <p className="text-xs text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full spinner" />
        </div>
      ) : (
        <>
          {/* Trending Songs */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">🔥 Trending Now</h2>
              <Link to="/browse" className="text-sm text-primary hover:text-primary-light transition-colors">See all</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {trending.slice(0, 10).map(song => (
                <SongCard key={song.id} song={song} songs={trending} />
              ))}
            </div>
          </section>

          {/* Featured Artists */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">🎤 Featured Artists</h2>
              <Link to="/browse" className="text-sm text-primary hover:text-primary-light transition-colors">See all</Link>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {artists.map(artist => (
                <ArtistCard key={artist.id} artist={artist} />
              ))}
            </div>
          </section>

          {/* Recently Added */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">✨ Recently Added</h2>
              <Link to="/browse" className="text-sm text-primary hover:text-primary-light transition-colors">See all</Link>
            </div>
            <div className="glass rounded-2xl p-4 divide-y divide-white/5">
              {recent.map((song, idx) => (
                <SongCard key={song.id} song={song} songs={recent} compact showIndex={idx} />
              ))}
            </div>
          </section>

          {/* Genres Banner */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">🎵 Browse by Genre</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {['Electronic', 'Jazz', 'Hip-Hop', 'Rock', 'Pop', 'R&B', 'Classical', 'Dance', 'Soul', 'Folk'].map((genre, i) => {
                const colors = ['from-purple-600 to-pink-600', 'from-blue-600 to-cyan-600', 'from-orange-600 to-red-600', 'from-gray-600 to-slate-700', 'from-pink-600 to-rose-600', 'from-indigo-600 to-purple-600', 'from-green-600 to-teal-600', 'from-cyan-600 to-blue-600', 'from-amber-600 to-orange-600', 'from-emerald-600 to-green-600'];
                return (
                  <Link
                    key={genre}
                    to={`/browse?genre=${encodeURIComponent(genre)}`}
                    className={`bg-gradient-to-br ${colors[i % colors.length]} rounded-xl p-4 text-white font-semibold hover:scale-105 transition-transform text-sm`}
                  >
                    {genre}
                  </Link>
                );
              })}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
