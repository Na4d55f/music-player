import { useState } from 'react';
import { useMusic } from '../context/MusicContext';

export default function SongCard({ song, compact = false }) {
  const { playSong, currentSong, isPlaying, toggleFavorite, isFavorite, playlists, addToPlaylist, createPlaylist } = useMusic();
  const [showMenu, setShowMenu] = useState(false);
  const isActive = currentSong?.id === song.id;

  const handleAddToPlaylist = (playlistId) => {
    addToPlaylist(playlistId, song);
    setShowMenu(false);
  };

  const handleCreateAndAdd = () => {
    const name = prompt('Playlist name:');
    if (name) {
      const pl = createPlaylist(name);
      addToPlaylist(pl.id, song);
    }
    setShowMenu(false);
  };

  if (compact) {
    return (
      <div
        className={`flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 group cursor-pointer transition-colors ${isActive ? 'bg-purple-900/30' : ''}`}
        onClick={() => playSong(song)}
      >
        <div className="relative flex-shrink-0">
          <img src={song.coverUrl} alt={song.title} className="w-10 h-10 rounded object-cover" />
          {isActive && isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded">
              <span className="text-purple-400 text-xs">▶</span>
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className={`text-sm font-medium truncate ${isActive ? 'text-purple-400' : 'text-white'}`}>{song.title}</p>
          <p className="text-xs text-gray-400 truncate">{song.artist}</p>
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={e => { e.stopPropagation(); toggleFavorite(song); }}
            className={isFavorite(song.id) ? 'text-red-500 text-sm' : 'text-gray-500 hover:text-red-400 text-sm'}
          >❤️</button>
          <span className="text-xs text-gray-500">{song.duration}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative bg-[#1A1A2E] rounded-xl p-4 hover:bg-[#1E1E38] transition-all group cursor-pointer ${isActive ? 'ring-1 ring-purple-500/50' : ''}`}
      onClick={() => playSong(song)}
    >
      <div className="relative mb-3">
        <img src={song.coverUrl} alt={song.title} className="w-full aspect-square object-cover rounded-lg" />
        <div className={`absolute inset-0 flex items-center justify-center rounded-lg transition-opacity ${isActive && isPlaying ? 'opacity-100 bg-black/30' : 'opacity-0 group-hover:opacity-100 bg-black/30'}`}>
          <span className="text-4xl">{isActive && isPlaying ? '⏸' : '▶️'}</span>
        </div>
        {isActive && (
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
        )}
      </div>
      <p className={`font-medium text-sm truncate ${isActive ? 'text-purple-400' : 'text-white'}`}>{song.title}</p>
      <p className="text-xs text-gray-400 truncate mt-1">{song.artist}</p>
      <p className="text-xs text-gray-600 mt-0.5">{song.genre} • {song.year}</p>

      <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={e => { e.stopPropagation(); toggleFavorite(song); }}
          className={`p-1 rounded-full bg-black/50 text-sm ${isFavorite(song.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}
        >❤️</button>
        <div className="relative">
          <button
            onClick={e => { e.stopPropagation(); setShowMenu(!showMenu); }}
            className="p-1 rounded-full bg-black/50 text-gray-400 hover:text-white text-sm font-bold"
          >+</button>
          {showMenu && (
            <div
              className="absolute right-0 top-full mt-1 bg-[#1A1A2E] border border-purple-900/30 rounded-lg shadow-xl z-10 w-44"
              onClick={e => e.stopPropagation()}
            >
              <p className="text-xs text-gray-400 px-3 py-2 border-b border-purple-900/20">Add to playlist</p>
              {playlists.map(pl => (
                <button
                  key={pl.id}
                  onClick={() => handleAddToPlaylist(pl.id)}
                  className="w-full text-left text-sm text-gray-300 hover:text-white hover:bg-white/5 px-3 py-1.5 transition-colors"
                >
                  📋 {pl.name}
                </button>
              ))}
              <button
                onClick={handleCreateAndAdd}
                className="w-full text-left text-sm text-purple-400 hover:text-purple-300 hover:bg-white/5 px-3 py-1.5 transition-colors"
              >
                + New playlist
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
