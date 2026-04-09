import React, { useState } from 'react';
import { Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import { useMusic } from '../context/MusicContext';
import PlaylistCard from '../components/PlaylistCard';
import SongCard from '../components/SongCard';

function PlaylistDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { playlists, playSong, removeSongFromPlaylist, deletePlaylist } = useMusic();
  const playlist = playlists.find((p) => p.id === id);

  if (!playlist) {
    return (
      <div className="text-center py-16 text-white/40">
        <p>Playlist not found.</p>
        <Link to="/playlists" className="text-purple-400 hover:underline mt-2 block">← Back to Playlists</Link>
      </div>
    );
  }

  const handleDelete = () => {
    deletePlaylist(id);
    navigate('/playlists');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/playlists" className="text-white/60 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{playlist.emoji} {playlist.name}</h1>
          <p className="text-white/40 text-sm">{playlist.songs.length} songs</p>
        </div>
        <div className="ml-auto flex gap-2">
          {playlist.songs.length > 0 && (
            <button
              onClick={() => playSong(playlist.songs[0], playlist.songs)}
              className="btn-primary flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Play All
            </button>
          )}
          <button
            onClick={handleDelete}
            className="btn-ghost text-red-400 hover:text-red-300"
          >
            Delete
          </button>
        </div>
      </div>

      {playlist.songs.length === 0 ? (
        <div className="text-center py-16 text-white/30">
          <p className="text-5xl mb-4">{playlist.emoji}</p>
          <p className="text-lg">This playlist is empty</p>
          <p className="text-sm mt-1">Add songs by clicking ··· on any song card</p>
        </div>
      ) : (
        <div className="space-y-1">
          {playlist.songs.map((song, i) => (
            <div key={song.id} className="relative group">
              <SongCard song={song} queue={playlist.songs} showIndex={i} />
              <button
                onClick={() => removeSongFromPlaylist(id, song.id)}
                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-white/40 hover:text-red-400 p-1"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PlaylistList() {
  const { playlists, createPlaylist, deletePlaylist } = useMusic();
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('🎵');

  const EMOJI_OPTIONS = ['🎵', '🎸', '🎷', '🎺', '🎻', '🥁', '🎤', '🎧', '🌊', '🔥', '⭐', '💜'];

  const handleCreate = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    createPlaylist(name.trim(), emoji);
    setName('');
    setEmoji('🎵');
    setShowCreate(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Playlists</h1>
        <button onClick={() => setShowCreate((v) => !v)} className="btn-primary flex items-center gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          New Playlist
        </button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="glass-card p-6 space-y-4">
          <h2 className="font-semibold">Create Playlist</h2>
          <div>
            <label className="block text-sm text-white/60 mb-1">Playlist name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Awesome Playlist"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple-500 transition-colors"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-2">Choose emoji</label>
            <div className="flex gap-2 flex-wrap">
              {EMOJI_OPTIONS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={`text-2xl p-1.5 rounded-lg transition-all ${emoji === e ? 'bg-purple-600/40 ring-1 ring-purple-500' : 'hover:bg-white/10'}`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="btn-primary">Create</button>
            <button type="button" onClick={() => setShowCreate(false)} className="btn-ghost">Cancel</button>
          </div>
        </form>
      )}

      {playlists.length === 0 && !showCreate ? (
        <div className="text-center py-16 text-white/30">
          <p className="text-5xl mb-4">🎵</p>
          <p className="text-lg">No playlists yet</p>
          <p className="text-sm mt-1">Create one to organize your music</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {playlists.map((pl) => (
            <PlaylistCard key={pl.id} playlist={pl} onDelete={deletePlaylist} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Playlists() {
  return (
    <Routes>
      <Route index element={<PlaylistList />} />
      <Route path=":id" element={<PlaylistDetail />} />
    </Routes>
  );
}
