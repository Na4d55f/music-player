import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { musicAPI } from '../services/musicAPI.js';
import SongCard from '../components/SongCard.jsx';
import ArtistCard from '../components/ArtistCard.jsx';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState(query);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    setInputValue(query);
    if (!query) return;
    setLoading(true);
    musicAPI.search(query).then(data => {
      setSongs(data.songs || []);
      setArtists(data.artists || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) setSearchParams({ q: inputValue.trim() });
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-white mb-6">Search Music</h1>

      {/* Search form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="Search songs, artists, albums, genres..."
              className="input-field pl-12 text-base"
              autoFocus
            />
          </div>
          <button type="submit" className="btn-primary px-6">Search</button>
        </div>
      </form>

      {!query && (
        <div className="text-center py-20 text-slate-500">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <p className="text-lg font-medium">Search for your favorite music</p>
          <p className="text-sm mt-1">Try searching for an artist, song title, or genre</p>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full spinner" />
        </div>
      )}

      {!loading && query && (
        <>
          <div className="flex items-center gap-2 mb-6 text-sm">
            <span className="text-slate-500">
              {songs.length + artists.length} results for <span className="text-white font-medium">"{query}"</span>
            </span>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 glass p-1 rounded-xl w-fit">
            {[
              { key: 'all', label: 'All' },
              { key: 'songs', label: `Songs (${songs.length})` },
              { key: 'artists', label: `Artists (${artists.length})` },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === tab.key ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {songs.length === 0 && artists.length === 0 && (
            <div className="text-center py-16 text-slate-500">
              <p className="text-lg font-medium">No results found</p>
              <p className="text-sm mt-1">Try a different search term</p>
            </div>
          )}

          {(activeTab === 'all' || activeTab === 'songs') && songs.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-bold text-white mb-4">Songs</h2>
              <div className="glass rounded-2xl p-4 divide-y divide-white/5">
                {songs.map((song, idx) => (
                  <SongCard key={song.id} song={song} songs={songs} compact showIndex={idx} />
                ))}
              </div>
            </section>
          )}

          {(activeTab === 'all' || activeTab === 'artists') && artists.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-bold text-white mb-4">Artists</h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                {artists.map(artist => (
                  <ArtistCard key={artist.id} artist={artist} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
