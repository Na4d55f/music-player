import React from 'react';
import { Link } from 'react-router-dom';
import { useMusic } from '../context/MusicContext';

export default function PlaylistCard({ playlist, onDelete }) {
  const { playSong } = useMusic();

  const handlePlay = (e) => {
    e.preventDefault();
    if (playlist.songs.length > 0) {
      playSong(playlist.songs[0], playlist.songs);
    }
  };

  return (
    <div className="glass-card p-4 hover:bg-white/10 transition-all duration-200 group relative">
      {/* Thumbnail grid */}
      <Link to={`/playlists/${playlist.id}`}>
        <div className="w-full aspect-square rounded-lg overflow-hidden mb-3 bg-gradient-to-br from-purple-900/50 to-cyan-900/50 grid grid-cols-2 gap-0.5">
          {playlist.songs.length > 0 ? (
            playlist.songs.slice(0, 4).map((song, i) => (
              <img
                key={i}
                src={song.album_image || song.image || `https://picsum.photos/seed/${song.id}/100/100`}
                alt={song.name}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = `https://picsum.photos/seed/${song.id}/100/100`; }}
              />
            ))
          ) : (
            <div className="col-span-2 row-span-2 flex items-center justify-center">
              <span className="text-5xl">{playlist.emoji}</span>
            </div>
          )}
        </div>

        <h3 className="font-semibold text-sm truncate">
          {playlist.emoji} {playlist.name}
        </h3>
        <p className="text-xs text-white/50 mt-0.5">
          {playlist.songs.length} {playlist.songs.length === 1 ? 'song' : 'songs'}
        </p>
      </Link>

      {/* Actions overlay */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
        {playlist.songs.length > 0 && (
          <button
            onClick={handlePlay}
            className="bg-purple-600 hover:bg-purple-500 rounded-full p-2 shadow-lg"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          </button>
        )}
        {onDelete && (
          <button
            onClick={(e) => { e.preventDefault(); onDelete(playlist.id); }}
            className="bg-red-600/80 hover:bg-red-500 rounded-full p-2 shadow-lg"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
