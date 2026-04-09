import { useState } from 'react';
import { useMusic } from '../context/MusicContext';
import SongCard from '../components/SongCard';

export default function Playlists() {
  const { playlists, createPlaylist, deletePlaylist, removeFromPlaylist } = useMusic();
  const [newName, setNewName] = useState('');
  const [activePlaylist, setActivePlaylist] = useState(null);

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    createPlaylist(newName.trim());
    setNewName('');
  };

  const active = playlists.find(p => p.id === activePlaylist);

  return (
    <div className="min-h-screen px-4 py-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">📋 Playlists</h1>
      <form onSubmit={handleCreate} className="flex gap-3 mb-8">
        <input
          type="text"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          placeholder="New playlist name..."
          className="flex-1 bg-[#1A1A2E] text-white placeholder-gray-500 border border-purple-900/30 focus:border-purple-500 rounded-xl px-4 py-3 outline-none transition-colors"
        />
        <button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-xl font-medium transition-colors">
          + Create
        </button>
      </form>

      {playlists.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-6xl mb-4">📋</p>
          <p className="text-gray-400 text-xl">No playlists yet</p>
          <p className="text-gray-600 mt-2">Create your first playlist above!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-3">
            {playlists.map(pl => (
              <div
                key={pl.id}
                className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-colors ${activePlaylist === pl.id ? 'bg-purple-900/30 border border-purple-500/30' : 'bg-[#1A1A2E] hover:bg-[#1E1E38]'}`}
                onClick={() => setActivePlaylist(activePlaylist === pl.id ? null : pl.id)}
              >
                <div>
                  <p className="text-white font-medium">📋 {pl.name}</p>
                  <p className="text-gray-400 text-sm">{pl.songs.length} songs</p>
                </div>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    if (activePlaylist === pl.id) setActivePlaylist(null);
                    deletePlaylist(pl.id);
                  }}
                  className="text-gray-600 hover:text-red-400 transition-colors text-lg"
                >🗑️</button>
              </div>
            ))}
          </div>

          {active && (
            <div className="md:col-span-2">
              <h2 className="text-xl font-bold text-white mb-4">📋 {active.name}</h2>
              {active.songs.length === 0 ? (
                <div className="text-center py-10 bg-[#1A1A2E] rounded-xl">
                  <p className="text-gray-400">No songs in this playlist yet.</p>
                  <p className="text-gray-600 text-sm mt-1">Add songs from the home page or search!</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {active.songs.map(song => (
                    <div key={song.id} className="flex items-center gap-2">
                      <div className="flex-1">
                        <SongCard song={song} compact />
                      </div>
                      <button
                        onClick={() => removeFromPlaylist(active.id, song.id)}
                        className="text-gray-600 hover:text-red-400 transition-colors px-2 flex-shrink-0"
                      >✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
