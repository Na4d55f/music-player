import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { musicAPI } from '../services/musicAPI.js';

export default function SearchBar({ className = '' }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const debounceRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(debounceRef.current);
    if (!val.trim()) { setResults(null); setOpen(false); return; }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await musicAPI.search(val.trim());
        setResults(data);
        setOpen(true);
      } catch { setResults(null); }
      finally { setLoading(false); }
    }, 350);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    setOpen(false);
  };

  const formatDuration = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={handleChange}
            onFocus={() => results && setOpen(true)}
            placeholder="Search songs, artists, genres..."
            className="input-field pl-10 pr-4 text-sm"
          />
          {loading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full spinner" />
            </div>
          )}
        </div>
      </form>

      {open && results && (
        <div className="absolute top-full mt-2 w-full glass rounded-xl border border-white/10 shadow-2xl z-50 max-h-80 overflow-y-auto">
          {results.songs?.length === 0 && results.artists?.length === 0 ? (
            <div className="p-4 text-center text-slate-500 text-sm">No results found</div>
          ) : (
            <>
              {results.songs?.slice(0, 5).map(song => (
                <button
                  key={song.id}
                  onClick={() => {
                    navigate(`/search?q=${encodeURIComponent(song.title)}`);
                    setOpen(false);
                    setQuery(song.title);
                  }}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 transition-colors w-full text-left"
                >
                  <img src={song.coverUrl} alt={song.title} className="w-9 h-9 rounded-lg object-cover flex-shrink-0" onError={e => { e.target.src = 'https://picsum.photos/seed/default/36/36'; }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{song.title}</p>
                    <p className="text-xs text-slate-500 truncate">{song.artist}</p>
                  </div>
                  <span className="text-xs text-slate-500 flex-shrink-0">{formatDuration(song.duration)}</span>
                </button>
              ))}
              {results.artists?.slice(0, 3).map(artist => (
                <button
                  key={artist.id}
                  onClick={() => {
                    navigate(`/search?q=${encodeURIComponent(artist.name)}`);
                    setOpen(false);
                    setQuery(artist.name);
                  }}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 transition-colors w-full text-left border-t border-white/5"
                >
                  <img src={artist.imageUrl} alt={artist.name} className="w-9 h-9 rounded-full object-cover flex-shrink-0" onError={e => { e.target.src = 'https://picsum.photos/seed/defaultArtist/36/36'; }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{artist.name}</p>
                    <p className="text-xs text-slate-500">Artist • {artist.genre}</p>
                  </div>
                </button>
              ))}
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-4 py-3 text-sm text-primary hover:bg-white/10 transition-colors w-full text-left border-t border-white/10"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                See all results for "{query}"
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
