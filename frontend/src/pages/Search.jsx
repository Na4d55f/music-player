import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import SearchBar from '../components/SearchBar';
import SongCard from '../components/SongCard';

const JAMENDO_CLIENT_ID = 'b6747d04';
const BASE_URL = 'https://api.jamendo.com/v3.0';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const debounceRef = useRef(null);

  const doSearch = async (q) => {
    if (!q.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    setSearched(true);
    try {
      const res = await axios.get(`${BASE_URL}/tracks/`, {
        params: {
          client_id: JAMENDO_CLIENT_ID,
          format: 'json',
          limit: 30,
          search: q,
          imagesize: 200,
          audioformat: 'mp32',
        },
      });
      setResults(res.data.results || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(value), 500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-4">Search</h1>
        <SearchBar onSearch={handleSearch} placeholder="Search songs, artists, albums..." />
      </div>

      {loading && (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse" />
          ))}
        </div>
      )}

      {!loading && searched && results.length === 0 && (
        <div className="text-center py-16 text-white/40">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-lg">No results for "{query}"</p>
          <p className="text-sm mt-1">Try a different keyword</p>
        </div>
      )}

      {!loading && !searched && (
        <div className="text-center py-16 text-white/30">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
          <p className="text-lg">Search for music</p>
          <p className="text-sm mt-1">Type above to find songs from independent artists</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div>
          <p className="text-sm text-white/40 mb-3">{results.length} results for "{query}"</p>
          <div className="space-y-1">
            {results.map((song, i) => (
              <SongCard key={song.id} song={song} queue={results} showIndex={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
