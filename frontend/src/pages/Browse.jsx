import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiCompass, FiTrendingUp, FiUser, FiMusic } from 'react-icons/fi';
import { getTrending, getTopArtists, getByGenre, getArtistInfo } from '../services/musicAPI';
import SongCard from '../components/SongCard';
import ArtistCard from '../components/ArtistCard';

const GENRES = [
  { tag: 'pop', label: 'Pop', gradient: 'from-pink-500 to-rose-500' },
  { tag: 'hip-hop', label: 'Hip-Hop', gradient: 'from-yellow-500 to-orange-500' },
  { tag: 'electronic', label: 'Electronic', gradient: 'from-cyan-500 to-blue-500' },
  { tag: 'rock', label: 'Rock', gradient: 'from-red-500 to-orange-600' },
  { tag: 'jazz', label: 'Jazz', gradient: 'from-amber-500 to-yellow-600' },
  { tag: 'classical', label: 'Classical', gradient: 'from-purple-500 to-violet-600' },
  { tag: 'rnb', label: 'R&B', gradient: 'from-rose-500 to-pink-600' },
  { tag: 'indie', label: 'Indie', gradient: 'from-green-500 to-teal-600' },
  { tag: 'metal', label: 'Metal', gradient: 'from-gray-600 to-gray-900' },
  { tag: 'country', label: 'Country', gradient: 'from-yellow-600 to-amber-700' },
  { tag: 'latin', label: 'Latin', gradient: 'from-orange-500 to-red-500' },
  { tag: 'soul', label: 'Soul', gradient: 'from-violet-500 to-purple-600' },
];

const TABS = [
  { id: 'trending', label: 'Trending', icon: FiTrendingUp },
  { id: 'artists', label: 'Artists', icon: FiUser },
  { id: 'genres', label: 'Genres', icon: FiMusic },
];

const Browse = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'trending';
  const initialGenre = searchParams.get('genre') || null;
  const initialArtist = searchParams.get('artist') || null;

  const [activeTab, setActiveTab] = useState(initialTab);
  const [tracks, setTracks] = useState([]);
  const [artists, setArtists] = useState([]);
  const [genreTracks, setGenreTracks] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(initialGenre);
  const [artistInfo, setArtistInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialArtist) {
      fetchArtistInfo(initialArtist);
    }
  }, [initialArtist]);

  useEffect(() => {
    if (activeTab === 'trending' && !tracks.length) {
      setLoading(true);
      getTrending(20)
        .then((d) => setTracks(d.tracks || []))
        .finally(() => setLoading(false));
    }
    if (activeTab === 'artists' && !artists.length) {
      setLoading(true);
      getTopArtists(20)
        .then((d) => setArtists(d.artists || []))
        .finally(() => setLoading(false));
    }
  }, [activeTab]);

  useEffect(() => {
    if (initialGenre) {
      setActiveTab('genres');
      handleGenreSelect(initialGenre);
    }
  }, [initialGenre]);

  const handleGenreSelect = async (genre) => {
    setSelectedGenre(genre);
    setLoading(true);
    try {
      const data = await getByGenre(genre, 20);
      setGenreTracks(data.tracks || []);
    } finally {
      setLoading(false);
    }
  };

  const fetchArtistInfo = async (name) => {
    setLoading(true);
    try {
      const data = await getArtistInfo(name);
      setArtistInfo(data.artist);
      setActiveTab('trending');
      if (data.artist?.topTracks) {
        setTracks(data.artist.topTracks.map((t) => ({ ...t, artist: data.artist.name })));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
        <FiCompass className="text-accent" /> Browse
      </h1>

      {/* Artist Info Banner */}
      {artistInfo && (
        <div className="glass-card rounded-2xl p-6 mb-8 flex items-center gap-6">
          {artistInfo.image && (
            <img src={artistInfo.image} alt={artistInfo.name} className="w-20 h-20 rounded-full object-cover border-2 border-accent/30" />
          )}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white">{artistInfo.name}</h2>
            {artistInfo.listeners && (
              <p className="text-white/50 text-sm">{(artistInfo.listeners / 1000000).toFixed(1)}M listeners</p>
            )}
            {artistInfo.tags?.length > 0 && (
              <div className="flex gap-2 mt-2">
                {artistInfo.tags.slice(0, 4).map((tag) => (
                  <span key={tag} className="text-xs bg-primary/20 text-primary-light px-2 py-0.5 rounded-full">{tag}</span>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => { setArtistInfo(null); setTracks([]); setSearchParams({}); }}
            className="btn-ghost text-sm"
          >
            Clear
          </button>
        </div>
      )}

      {/* Tabs */}
      {!artistInfo && (
        <div className="flex gap-2 mb-8">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${activeTab === id ? 'bg-primary text-white' : 'glass-card text-white/60 hover:text-white'}`}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="glass-card rounded-xl p-4 animate-pulse">
              <div className="aspect-square rounded-lg shimmer mb-3" />
              <div className="h-3 shimmer rounded mb-2" />
              <div className="h-2 shimmer rounded w-3/4" />
            </div>
          ))}
        </div>
      )}

      {/* Trending / Artist top tracks */}
      {!loading && (activeTab === 'trending' || artistInfo) && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {tracks.map((song) => (
            <SongCard key={song.id} song={song} songList={tracks} />
          ))}
        </div>
      )}

      {/* Artists */}
      {!loading && activeTab === 'artists' && !artistInfo && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {artists.map((artist) => (
            <ArtistCard key={artist.id || artist.name} artist={artist} />
          ))}
        </div>
      )}

      {/* Genres */}
      {!loading && activeTab === 'genres' && !artistInfo && (
        <div>
          {/* Genre grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
            {GENRES.map(({ tag, label, gradient }) => (
              <button
                key={tag}
                onClick={() => handleGenreSelect(tag)}
                className={`bg-gradient-to-br ${gradient} p-4 rounded-xl text-white font-bold text-sm text-center
                  hover:opacity-90 active:scale-95 transition-all duration-200 shadow-lg
                  ${selectedGenre === tag ? 'ring-2 ring-white/50' : ''}`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Genre tracks */}
          {selectedGenre && (
            <>
              <h2 className="text-xl font-bold text-white mb-4 capitalize">
                {GENRES.find((g) => g.tag === selectedGenre)?.label || selectedGenre} Tracks
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {genreTracks.map((song) => (
                  <SongCard key={song.id} song={song} songList={genreTracks} />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <div className="h-24" />
    </div>
  );
};

export default Browse;
