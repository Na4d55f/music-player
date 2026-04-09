import React from 'react';
import { useMusic } from '../context/MusicContext';

function formatTime(secs) {
  if (!secs || isNaN(secs)) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function SongCard({ song, queue = [], showIndex = null }) {
  const { currentSong, isPlaying, playSong, pauseSong, resumeSong, toggleFavorite, isFavorite, playlists, addSongToPlaylist } = useMusic();
  const isActive = currentSong?.id === song.id;
  const isFav = isFavorite(song.id);
  const [showPlaylistMenu, setShowPlaylistMenu] = React.useState(false);

  const handlePlay = (e) => {
    e.stopPropagation();
    if (isActive && isPlaying) {
      pauseSong();
    } else if (isActive) {
      resumeSong();
    } else {
      playSong(song, queue.length > 0 ? queue : [song]);
    }
  };

  const handleFavorite = (e) => {
    e.stopPropagation();
    toggleFavorite(song);
  };

  return (
    <div
      className={`group relative flex items-center gap-3 p-3 rounded-xl transition-all duration-200 cursor-pointer hover:bg-white/5 ${
        isActive ? 'bg-purple-900/20 neon-border' : ''
      }`}
      onClick={handlePlay}
    >
      {/* Index or playing indicator */}
      <div className="w-8 shrink-0 text-center">
        {isActive && isPlaying ? (
          <div className="flex items-end justify-center gap-0.5 h-5">
            <div className="eq-bar w-1 bg-purple-400 rounded-sm" />
            <div className="eq-bar w-1 bg-purple-400 rounded-sm" />
            <div className="eq-bar w-1 bg-purple-400 rounded-sm" />
          </div>
        ) : showIndex !== null ? (
          <span className="text-sm text-white/40 group-hover:hidden">{showIndex + 1}</span>
        ) : null}
        <button
          onClick={handlePlay}
          className={`${showIndex !== null ? 'hidden group-hover:block' : 'block'} ${isActive && isPlaying ? 'hidden' : ''} text-white/70 hover:text-white`}
        >
          {isActive && !isPlaying ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>

      {/* Album art */}
      <img
        src={song.album_image || song.image || `https://picsum.photos/seed/${song.id}/48/48`}
        alt={song.name}
        className="w-12 h-12 rounded-lg object-cover shrink-0 shadow-lg"
        onError={(e) => { e.target.src = `https://picsum.photos/seed/${song.id}/48/48`; }}
      />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${isActive ? 'text-purple-300' : 'text-white'}`}>
          {song.name}
        </p>
        <p className="text-xs text-white/50 truncate">{song.artist_name}</p>
      </div>

      {/* Duration */}
      <span className="text-xs text-white/40 shrink-0 hidden sm:block">
        {formatTime(song.duration)}
      </span>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleFavorite}
          className={`p-1.5 rounded-lg transition-colors ${isFav ? 'text-red-400' : 'text-white/40 hover:text-red-400'}`}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
        </button>

        {playlists.length > 0 && (
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setShowPlaylistMenu((v) => !v); }}
              className="p-1.5 rounded-lg text-white/40 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
            {showPlaylistMenu && (
              <div
                className="absolute right-0 bottom-8 z-50 glass-card p-2 min-w-36 shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <p className="text-xs text-white/40 px-2 pb-1 font-medium">Add to playlist</p>
                {playlists.map((pl) => (
                  <button
                    key={pl.id}
                    onClick={() => { addSongToPlaylist(pl.id, song); setShowPlaylistMenu(false); }}
                    className="flex items-center gap-2 w-full text-left px-2 py-1.5 text-sm rounded hover:bg-white/10 transition-colors"
                  >
                    <span>{pl.emoji}</span>
                    <span className="truncate">{pl.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
