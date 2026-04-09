import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiMusic, FiUser, FiDisc } from 'react-icons/fi';
import { searchMusic } from '../services/musicAPI';
import SongCard from '../components/SongCard';
import ArtistCard from '../components/ArtistCard';
import SearchBar from '../components/SearchBar';

const TYPES = [
  { value: 'track', label: 'Songs', icon: FiMusic },
  { value: 'artist', label: 'Artists', icon: FiUser },
  { value: 'album', label: 'Albums', icon: FiDisc },
];

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [type, setType] = useState('track');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const query = searchParams.get('q') || '';

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    setError(null);

    searchMusic(query, type, page)
      .then((data) => {
        setResults(data.results || []);
        setTotal(data.total || 0);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [query, type, page]);

  const handleSearch = (q) => {
    setSearchParams({ q });
    setPage(1);
  };

  const handleTypeChange = (t) => {
    setType(t);
    setPage(1);
    setResults([]);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">Search</h1>

      <SearchBar onSearch={handleSearch} fullWidth autoFocus />

      {/* Type tabs */}
      <div className="flex gap-2 mt-6 mb-8">
        {TYPES.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => handleTypeChange(value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${type === value ? 'bg-primary text-white shadow-glow-purple' : 'glass-card text-white/60 hover:text-white'}`}
          >
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {!query && (
        <div className="text-center py-20">
          <FiSearch size={56} className="mx-auto text-white/20 mb-4" />
          <h2 className="text-xl font-semibold text-white/40 mb-2">Start searching</h2>
          <p className="text-white/25">Find your favorite songs, artists, and albums</p>
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

      {/* Error */}
      {error && (
        <div className="glass-card rounded-xl p-6 text-center">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Results */}
      {!loading && results.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-white/50 text-sm">
              {total > 0 ? `${total.toLocaleString()} results for "${query}"` : `Results for "${query}"`}
            </p>
          </div>

          {type === 'track' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {results.map((song) => (
                <SongCard key={song.id} song={song} songList={results} />
              ))}
            </div>
          )}

          {type === 'artist' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {results.map((artist) => (
                <ArtistCard key={artist.id || artist.name} artist={artist} />
              ))}
            </div>
          )}

          {type === 'album' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {results.map((album) => (
                <div key={album.id} className="glass-card-hover rounded-xl p-4">
                  {album.image ? (
                    <img src={album.image} alt={album.name} className="w-full aspect-square object-cover rounded-lg mb-3" />
                  ) : (
                    <div className="w-full aspect-square bg-gradient-to-br from-primary/30 to-accent/20 rounded-lg mb-3 flex items-center justify-center">
                      <FiDisc size={32} className="text-white/20" />
                    </div>
                  )}
                  <h3 className="font-semibold text-white text-sm truncate">{album.name}</h3>
                  <p className="text-white/40 text-xs truncate">{album.artist}</p>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-center gap-3 mt-8">
            {page > 1 && (
              <button onClick={() => setPage((p) => p - 1)} className="btn-secondary text-sm px-5">
                Previous
              </button>
            )}
            {results.length >= 20 && (
              <button onClick={() => setPage((p) => p + 1)} className="btn-primary text-sm px-5">
                Next
              </button>
            )}
          </div>
        </>
      )}

      {/* No results */}
      {!loading && query && results.length === 0 && !error && (
        <div className="text-center py-20">
          <FiSearch size={48} className="mx-auto text-white/20 mb-4" />
          <h2 className="text-lg font-semibold text-white/50 mb-2">No results found</h2>
          <p className="text-white/30">Try a different search term</p>
        </div>
      )}

      <div className="h-24" />
    </div>
  );
};

export default Search;
