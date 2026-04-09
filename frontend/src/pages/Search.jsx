import { useState, useMemo } from 'react';
import { useMusic } from '../context/MusicContext';
import SongCard from '../components/SongCard';

export default function Search() {
  const { songs } = useMusic();
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return songs;
    const q = query.toLowerCase();
    return songs.filter(s =>
      s.title.toLowerCase().includes(q) ||
      s.artist.toLowerCase().includes(q) ||
      s.album.toLowerCase().includes(q) ||
      s.genre.toLowerCase().includes(q)
    );
  }, [query, songs]);

  return (
    <div className="min-h-screen px-4 py-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">🔍 Search</h1>
      <div className="relative mb-8">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search songs, artists, albums, genres..."
          className="w-full bg-[#1A1A2E] text-white placeholder-gray-500 border border-purple-900/30 focus:border-purple-500 rounded-xl px-5 py-4 text-lg outline-none transition-colors"
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">✕</button>
        )}
      </div>
      <p className="text-gray-400 text-sm mb-5">
        {query ? `${results.length} results for "${query}"` : `${songs.length} songs available`}
      </p>
      {results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {results.map(song => <SongCard key={song.id} song={song} />)}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-6xl mb-4">🎵</p>
          <p className="text-gray-400 text-xl">No songs found for &quot;{query}&quot;</p>
          <p className="text-gray-600 mt-2">Try a different search term</p>
        </div>
      )}
    </div>
  );
}
