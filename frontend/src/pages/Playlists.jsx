import { useState, useEffect } from 'react';
import { FiPlus, FiList, FiTrash2, FiEdit2, FiX, FiCheck } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useMusic } from '../context/MusicContext';
import { getMyPlaylists, createPlaylist, deletePlaylist, updatePlaylist } from '../services/userAPI';
import PlaylistCard from '../components/PlaylistCard';
import SongCard from '../components/SongCard';
import { toast } from 'react-toastify';

const Playlists = () => {
  const { isAuthenticated } = useAuth();
  const { playSong } = useMusic();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', isPublic: false });

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    try {
      const data = await getMyPlaylists();
      setPlaylists(data.playlists || []);
    } catch {
      toast.error('Failed to load playlists');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    try {
      const data = await createPlaylist(formData);
      setPlaylists((prev) => [data.playlist, ...prev]);
      setFormData({ name: '', description: '', isPublic: false });
      setShowCreate(false);
      toast.success('Playlist created!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create playlist');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this playlist?')) return;
    try {
      await deletePlaylist(id);
      setPlaylists((prev) => prev.filter((p) => p._id !== id));
      if (selectedPlaylist?._id === id) setSelectedPlaylist(null);
      toast.success('Playlist deleted');
    } catch {
      toast.error('Failed to delete playlist');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const data = await updatePlaylist(selectedPlaylist._id, formData);
      setPlaylists((prev) => prev.map((p) => (p._id === selectedPlaylist._id ? data.playlist : p)));
      setSelectedPlaylist(data.playlist);
      setEditMode(false);
      toast.success('Playlist updated!');
    } catch {
      toast.error('Failed to update playlist');
    }
  };

  const handlePlayPlaylist = (playlist) => {
    if (!playlist.songs?.length) {
      toast.info('This playlist is empty');
      return;
    }
    playSong(playlist.songs[0], playlist.songs);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <FiList className="text-accent" /> My Playlists
        </h1>
        <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2">
          <FiPlus size={18} /> New Playlist
        </button>
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-card rounded-2xl p-6 w-full max-w-md animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Create Playlist</h2>
              <button onClick={() => setShowCreate(false)} className="text-white/40 hover:text-white">
                <FiX size={20} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <input
                type="text"
                placeholder="Playlist name *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
                required
                maxLength={100}
              />
              <textarea
                placeholder="Description (optional)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field resize-none h-24"
                maxLength={500}
              />
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  className={`w-10 h-5 rounded-full transition-colors ${formData.isPublic ? 'bg-accent' : 'bg-white/10'}`}
                  onClick={() => setFormData({ ...formData, isPublic: !formData.isPublic })}
                >
                  <div className={`w-4 h-4 bg-white rounded-full mt-0.5 transition-transform ${formData.isPublic ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </div>
                <span className="text-sm text-white/70">Make public</span>
              </label>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowCreate(false)} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Playlists Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="glass-card rounded-xl p-4 animate-pulse">
                  <div className="aspect-square rounded-lg shimmer mb-3" />
                  <div className="h-3 shimmer rounded mb-2" />
                  <div className="h-2 shimmer rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : playlists.length === 0 ? (
            <div className="text-center py-20">
              <FiList size={48} className="mx-auto text-white/20 mb-4" />
              <h2 className="text-lg font-semibold text-white/50 mb-2">No playlists yet</h2>
              <p className="text-white/30 mb-6">Create your first playlist to get started</p>
              <button onClick={() => setShowCreate(true)} className="btn-primary">
                <FiPlus size={16} className="inline mr-2" />
                Create Playlist
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {playlists.map((pl) => (
                <PlaylistCard
                  key={pl._id}
                  playlist={pl}
                  onClick={() => { setSelectedPlaylist(pl); setEditMode(false); }}
                  onDelete={() => handleDelete(pl._id)}
                  onEdit={() => {
                    setSelectedPlaylist(pl);
                    setFormData({ name: pl.name, description: pl.description || '', isPublic: pl.isPublic });
                    setEditMode(true);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Playlist Detail */}
        {selectedPlaylist && (
          <div className="lg:w-96 glass-card rounded-2xl p-6">
            {editMode ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white">Edit Playlist</h3>
                  <button onClick={() => setEditMode(false)} className="text-white/40 hover:text-white">
                    <FiX size={18} />
                  </button>
                </div>
                <form onSubmit={handleUpdate} className="space-y-4">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                    required
                    maxLength={100}
                  />
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-field resize-none h-20"
                    maxLength={500}
                    placeholder="Description"
                  />
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div
                      className={`w-10 h-5 rounded-full transition-colors ${formData.isPublic ? 'bg-accent' : 'bg-white/10'}`}
                      onClick={() => setFormData({ ...formData, isPublic: !formData.isPublic })}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full mt-0.5 transition-transform ${formData.isPublic ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </div>
                    <span className="text-sm text-white/70">Public</span>
                  </label>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setEditMode(false)} className="btn-secondary flex-1 text-sm">
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary flex-1 text-sm">
                      Save
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-white text-lg">{selectedPlaylist.name}</h3>
                    <p className="text-white/40 text-sm">{selectedPlaylist.songs?.length || 0} songs</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setFormData({ name: selectedPlaylist.name, description: selectedPlaylist.description || '', isPublic: selectedPlaylist.isPublic }); setEditMode(true); }}
                      className="p-2 text-white/40 hover:text-white transition-colors"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button onClick={() => setSelectedPlaylist(null)} className="p-2 text-white/40 hover:text-white">
                      <FiX size={16} />
                    </button>
                  </div>
                </div>

                {selectedPlaylist.description && (
                  <p className="text-white/50 text-sm mb-4">{selectedPlaylist.description}</p>
                )}

                {selectedPlaylist.songs?.length > 0 ? (
                  <div className="space-y-1 max-h-96 overflow-y-auto">
                    {selectedPlaylist.songs.map((song) => (
                      <SongCard
                        key={song.songId}
                        song={{ ...song, id: song.songId }}
                        songList={selectedPlaylist.songs.map((s) => ({ ...s, id: s.songId }))}
                        compact
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-white/30">
                    <FiList size={32} className="mx-auto mb-2" />
                    <p className="text-sm">No songs yet</p>
                  </div>
                )}

                {selectedPlaylist.songs?.length > 0 && (
                  <button
                    onClick={() => handlePlayPlaylist(selectedPlaylist)}
                    className="btn-primary w-full mt-4 text-sm"
                  >
                    Play All
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <div className="h-24" />
    </div>
  );
};

export default Playlists;
