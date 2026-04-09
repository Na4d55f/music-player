import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { musicAPI } from '../services/musicAPI.js';
import SongCard from '../components/SongCard.jsx';
import ArtistCard from '../components/ArtistCard.jsx';

const GENRES = ["Electronic", "Jazz", "Folk", "Hip-Hop", "Ambient", "Rock", "Reggae", "Classical", "Dance", "Soul", "Country", "Funk", "Blues", "Pop", "Metal", "Indie", "Latin", "R&B", "Gospel"];
const GENRE_COLORS = ['from-purple-600/60 to-pink-600/60', 'from-blue-600/60 to-cyan-600/60', 'from-emerald-600/60 to-green-600/60', 'from-orange-600/60 to-red-600/60', 'from-teal-600/60 to-cyan-600/60', 'from-gray-600/60 to-slate-700/60', 'from-green-600/60 to-lime-600/60', 'from-amber-600/60 to-yellow-600/60', 'from-cyan-600/60 to-blue-600/60', 'from-indigo-600/60 to-purple-600/60', 'from-amber-700/60 to-orange-600/60', 'from-yellow-600/60 to-amber-600/60', 'from-blue-800/60 to-indigo-600/60', 'from-pink-600/60 to-rose-600/60', 'from-slate-700/60 to-gray-800/60', 'from-lime-600/60 to-green-600/60', 'from-red-600/60 to-pink-600/60', 'from-violet-600/60 to-purple-600/60', 'from-sky-600/60 to-blue-600/60'];

export default function Browse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeGenre = searchParams.get('genre') || '';
  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('grid');

  useEffect(() => {
    setLoading(true);
    if (activeGenre) {
      Promise.all([
        musicAPI.getSongs({ genre: activeGenre, limit: 30 }),
        musicAPI.getArtists({ genre: activeGenre }),
      ]).then(([songsData, artistsData]) => {
        setSongs(songsData.songs || []);
        setArtists(artistsData.artists || []);
      }).catch(() => {}).finally(() => setLoading(false));
    } else {
      musicAPI.getSongs({ limit: 30 }).then(data => {
        setSongs(data.songs || []);
      }).catch(() => {}).finally(() => setLoading(false));
    }
  }, [activeGenre]);

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-white mb-2">Browse Music</h1>
      <p className="text-slate-500 mb-6">Explore by genre or discover all songs</p>

      {/* Genre grid */}
      <section className="mb-8">
        <h2 className="text-lg font-bold text-white mb-4">Genres</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2">
          <button
            onClick={() => setSearchParams({})}
            className={`rounded-xl p-3 text-sm font-semibold text-center transition-all hover:scale-105 ${!activeGenre ? 'bg-primary text-white' : 'glass text-slate-400 hover:text-white'}`}
          >
            All
          </button>
          {GENRES.map((genre, i) => (
            <button
              key={genre}
              onClick={() => setSearchParams({ genre })}
              className={`bg-gradient-to-br ${GENRE_COLORS[i % GENRE_COLORS.length]} rounded-xl p-3 text-sm font-semibold text-white text-center transition-all hover:scale-105 ${activeGenre === genre ? 'ring-2 ring-white/50' : ''}`}
            >
              {genre}
            </button>
          ))}
        </div>
      </section>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full spinner" />
        </div>
      ) : (
        <>
          {activeGenre && artists.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-bold text-white mb-4">{activeGenre} Artists</h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                {artists.map(artist => <ArtistCard key={artist.id} artist={artist} />)}
              </div>
            </section>
          )}

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">
                {activeGenre ? `${activeGenre} Songs` : 'All Songs'} ({songs.length})
              </h2>
              <div className="flex gap-1">
                <button onClick={() => setView('grid')} className={`p-2 rounded-lg transition-colors ${view === 'grid' ? 'bg-primary text-white' : 'text-slate-500 hover:text-white'}`}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M4 11h5V5H4v6zm0 7h5v-6H4v6zm6 0h5v-6h-5v6zm6 0h5v-6h-5v6zm-6-7h5V5h-5v6zm6-6v6h5V5h-5z"/></svg>
                </button>
                <button onClick={() => setView('list')} className={`p-2 rounded-lg transition-colors ${view === 'list' ? 'bg-primary text-white' : 'text-slate-500 hover:text-white'}`}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/></svg>
                </button>
              </div>
            </div>

            {songs.length === 0 ? (
              <div className="text-center py-16 text-slate-500">No songs found</div>
            ) : view === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {songs.map(song => <SongCard key={song.id} song={song} songs={songs} />)}
              </div>
            ) : (
              <div className="glass rounded-2xl p-4 divide-y divide-white/5">
                {songs.map((song, idx) => <SongCard key={song.id} song={song} songs={songs} compact showIndex={idx} />)}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
