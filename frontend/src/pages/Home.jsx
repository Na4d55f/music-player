import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiTrendingUp, FiUsers, FiMusic, FiArrowRight } from 'react-icons/fi';
import { getTrending, getTopArtists } from '../services/musicAPI';
import { useAuth } from '../context/AuthContext';
import { useMusic } from '../context/MusicContext';
import SongCard from '../components/SongCard';
import ArtistCard from '../components/ArtistCard';
import SearchBar from '../components/SearchBar';

const Home = () => {
  const { user, isAuthenticated } = useAuth();
  const { playSong } = useMusic();
  const [trending, setTrending] = useState([]);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trendingData, artistsData] = await Promise.all([
          getTrending(12),
          getTopArtists(8),
        ]);
        setTrending(trendingData.tracks || []);
        setArtists(artistsData.artists || []);
      } catch (err) {
        console.error('Failed to fetch home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const genres = [
    { name: 'Pop', color: 'from-pink-500 to-rose-500', tag: 'pop' },
    { name: 'Hip-Hop', color: 'from-yellow-500 to-orange-500', tag: 'hip-hop' },
    { name: 'Electronic', color: 'from-cyan-500 to-blue-500', tag: 'electronic' },
    { name: 'Rock', color: 'from-red-500 to-orange-600', tag: 'rock' },
    { name: 'Jazz', color: 'from-amber-500 to-yellow-600', tag: 'jazz' },
    { name: 'Classical', color: 'from-purple-500 to-violet-600', tag: 'classical' },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative py-16 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
            <span className="gradient-text">Stream Music</span>
            <br />
            <span className="text-white">Without Limits</span>
          </h1>
          <p className="text-white/60 text-lg mb-8 max-w-xl mx-auto">
            Discover trending tracks, explore new artists, and build your perfect playlists.
          </p>
          <div className="flex justify-center mb-8">
            <SearchBar fullWidth={false} />
          </div>

          {!isAuthenticated && (
            <div className="flex items-center justify-center gap-4">
              <Link to="/register" className="btn-primary">
                Get Started Free
              </Link>
              <Link to="/browse" className="btn-secondary">
                Browse Music
              </Link>
            </div>
          )}
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-8 -left-8 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Stats */}
      <section className="grid grid-cols-3 gap-4 max-w-2xl mx-auto px-4">
        {[
          { icon: FiMusic, value: '50M+', label: 'Songs' },
          { icon: FiUsers, value: '5M+', label: 'Artists' },
          { icon: FiTrendingUp, value: '200M+', label: 'Streams' },
        ].map(({ icon: Icon, value, label }) => (
          <div key={label} className="glass-card p-4 text-center rounded-xl">
            <Icon size={24} className="text-accent mx-auto mb-2" />
            <div className="text-xl font-bold gradient-text">{value}</div>
            <div className="text-white/40 text-sm">{label}</div>
          </div>
        ))}
      </section>

      {/* Genres */}
      <section className="px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-title mb-0">Browse by Genre</h2>
          <Link to="/browse" className="flex items-center gap-1 text-sm text-accent hover:text-accent/80 transition-colors">
            See all <FiArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {genres.map((genre) => (
            <Link
              key={genre.tag}
              to={`/browse?genre=${genre.tag}`}
              className={`bg-gradient-to-br ${genre.color} p-4 rounded-xl text-white font-bold text-sm text-center
                hover:opacity-90 active:scale-95 transition-all duration-200 shadow-lg`}
            >
              {genre.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Tracks */}
      <section className="px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-title mb-0 flex items-center gap-2">
            <FiTrendingUp className="text-accent" /> Trending Now
          </h2>
          <Link to="/browse" className="flex items-center gap-1 text-sm text-accent hover:text-accent/80 transition-colors">
            See all <FiArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="glass-card rounded-xl p-4 animate-pulse">
                <div className="aspect-square rounded-lg shimmer mb-3" />
                <div className="h-3 shimmer rounded mb-2" />
                <div className="h-2 shimmer rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {trending.map((song) => (
              <SongCard
                key={song.id}
                song={song}
                songList={trending}
              />
            ))}
          </div>
        )}
      </section>

      {/* Top Artists */}
      <section className="px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-title mb-0 flex items-center gap-2">
            <FiUsers className="text-accent" /> Top Artists
          </h2>
          <Link to="/browse?tab=artists" className="flex items-center gap-1 text-sm text-accent hover:text-accent/80 transition-colors">
            See all <FiArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="glass-card rounded-xl p-4 animate-pulse flex flex-col items-center">
                <div className="w-20 h-20 rounded-full shimmer mb-3" />
                <div className="h-3 shimmer rounded w-3/4 mb-1" />
                <div className="h-2 shimmer rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
            {artists.map((artist) => (
              <ArtistCard key={artist.id || artist.name} artist={artist} />
            ))}
          </div>
        )}
      </section>

      {/* CTA for non-authenticated users */}
      {!isAuthenticated && (
        <section className="px-4 py-8">
          <div className="glass-card rounded-2xl p-8 text-center max-w-2xl mx-auto gradient-border">
            <h2 className="text-2xl font-bold text-white mb-3">Ready to start listening?</h2>
            <p className="text-white/60 mb-6">Create your free account to save favorites, build playlists, and more.</p>
            <Link to="/register" className="btn-primary">
              Create Free Account
            </Link>
          </div>
        </section>
      )}

      <div className="h-24" />
    </div>
  );
};

export default Home;
