import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { musicAPI } from '../services/musicAPI.js';
import { userAPI } from '../services/userAPI.js';
import api from '../services/api.js';
import PlaylistCard from '../components/PlaylistCard.jsx';
import SongCard from '../components/SongCard.jsx';
import { useUI } from '../context/UIContext.jsx';

export default function Playlists() {
  const { isAuthenticated } = useAuth();
  const { showToast } = useUI();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [availableSongs, setAvailableSongs] = useState([]);
  const [showSongPicker, setShowSongPicker] = useState(false);

  // Local storage playlists for non-auth users
  const getLocalPlaylists = () => {
    try { return JSON.parse(localStorage.getItem('playlists') || '[]'); } catch { return []; }
  };
  const saveLocalPlaylists = (pls) => localStorage.setItem('playlists', JSON.stringify(pls));

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        if (isAuthenticated) {
          const { data } = await api.get('/playlists');
          setPlaylists(data.playlists || []);
        } else {
          setPlaylists(getLocalPlaylists());
        }
      } catch {
        setPlaylists(getLocalPlaylists());
      } finally {
        setLoading(false);
      }
    })();
  }, [isAuthenticated]);

  useEffect(() => {
    musicAPI.getSongs({ limit: 52 }).then(d => setAvailableSongs(d.songs || []));
  }, []);

  const createPlaylist = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const playlist = { id: Date.now().toString(), name: newName.trim(), description: newDesc.trim(), songs: [], songData: [], createdAt: new Date().toISOString() };
    const updated = [...playlists, playlist];
    setPlaylists(updated);
    saveLocalPlaylists(updated);
    setNewName('');
    setNewDesc('');
    setCreating(false);
    showToast(`Playlist "${playlist.name}" created!`);
  };

  const deletePlaylist = (id) => {
    const updated = playlists.filter(p => (p.id || p._id) !== id);
    setPlaylists(updated);
    saveLocalPlaylists(updated);
    if (selectedPlaylist?.id === id) setSelectedPlaylist(null);
    showToast('Playlist deleted', 'info');
  };

  const addSongToPlaylist = (song) => {
    if (!selectedPlaylist) return;
    const pl = playlists.find(p => (p.id || p._id) === (selectedPlaylist.id || selectedPlaylist._id));
    if (!pl) return;
    if ((pl.songs || []).includes(song.id)) { showToast('Song already in playlist', 'warning'); return; }
    const updated = playlists.map(p => {
      if ((p.id || p._id) === (selectedPlaylist.id || selectedPlaylist._id)) {
        return { ...p, songs: [...(p.songs || []), song.id], songData: [...(p.songData || []), song] };
      }
      return p;
    });
    setPlaylists(updated);
    saveLocalPlaylists(updated);
    setSelectedPlaylist(updated.find(p => (p.id || p._id) === (selectedPlaylist.id || selectedPlaylist._id)));
    showToast(`Added "${song.title}" to ${pl.name}`);
  };

  const removeSongFromPlaylist = (songId) => {
    if (!selectedPlaylist) return;
    const updated = playlists.map(p => {
      if ((p.id || p._id) === (selectedPlaylist.id || selectedPlaylist._id)) {
        return { ...p, songs: (p.songs || []).filter(s => s !== songId), songData: (p.songData || []).filter(s => s.id !== songId) };
      }
      return p;
    });
    setPlaylists(updated);
    saveLocalPlaylists(updated);
    setSelectedPlaylist(updated.find(p => (p.id || p._id) === (selectedPlaylist.id || selectedPlaylist._id)));
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">📋 Playlists</h1>
          <p className="text-slate-500 mt-1">{playlists.length} playlist{playlists.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setCreating(true)} className="btn-primary flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Playlist
        </button>
      </div>

      {/* Create playlist form */}
      {creating && (
        <form onSubmit={createPlaylist} className="glass rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Create New Playlist</h2>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="Playlist name *"
              className="input-field"
              autoFocus
              required
            />
            <input
              type="text"
              value={newDesc}
              onChange={e => setNewDesc(e.target.value)}
              placeholder="Description (optional)"
              className="input-field"
            />
            <div className="flex gap-3">
              <button type="submit" className="btn-primary">Create</button>
              <button type="button" onClick={() => setCreating(false)} className="btn-secondary">Cancel</button>
            </div>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full spinner" />
        </div>
      ) : playlists.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <svg className="w-16 h-16 mx-auto mb-4 text-slate-700" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
          </svg>
          <h3 className="text-lg font-semibold text-slate-400 mb-2">No playlists yet</h3>
          <p className="text-slate-600 text-sm">Create your first playlist to organize your music</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {playlists.map(playlist => (
            <div key={playlist.id || playlist._id} onClick={() => setSelectedPlaylist(playlist === selectedPlaylist ? null : playlist)}>
              <PlaylistCard
                playlist={playlist}
                onDelete={deletePlaylist}
              />
            </div>
          ))}
        </div>
      )}

      {/* Playlist detail */}
      {selectedPlaylist && (
        <div className="mt-6 glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">{selectedPlaylist.name}</h2>
            <div className="flex gap-2">
              <button onClick={() => setShowSongPicker(!showSongPicker)} className="btn-secondary text-sm flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                Add Songs
              </button>
              <button onClick={() => setSelectedPlaylist(null)} className="btn-ghost text-sm">Close</button>
            </div>
          </div>

          {showSongPicker && (
            <div className="mb-6 glass-dark rounded-xl p-4">
              <p className="text-sm text-slate-400 mb-3">Select songs to add:</p>
              <div className="max-h-60 overflow-y-auto divide-y divide-white/5">
                {availableSongs.map(song => (
                  <button
                    key={song.id}
                    onClick={() => addSongToPlaylist(song)}
                    className="flex items-center gap-3 w-full p-2 hover:bg-white/10 rounded-lg transition-colors text-left"
                  >
                    <img src={song.coverUrl} alt={song.title} className="w-8 h-8 rounded object-cover flex-shrink-0" onError={e => { e.target.src = 'https://picsum.photos/seed/default/32/32'; }} />
                    <div className="min-w-0">
                      <p className="text-sm text-white truncate">{song.title}</p>
                      <p className="text-xs text-slate-500">{song.artist}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {(selectedPlaylist.songData || []).length === 0 ? (
            <p className="text-slate-600 text-sm text-center py-8">No songs in this playlist yet. Click "Add Songs" to get started.</p>
          ) : (
            <div className="divide-y divide-white/5">
              {(selectedPlaylist.songData || []).map((song, idx) => (
                <div key={song.id} className="flex items-center gap-2">
                  <div className="flex-1">
                    <SongCard song={song} songs={selectedPlaylist.songData} compact showIndex={idx} />
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); removeSongFromPlaylist(song.id); }}
                    className="p-1.5 text-slate-600 hover:text-red-400 transition-colors flex-shrink-0"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
