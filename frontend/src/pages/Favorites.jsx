import React from 'react';
import { useMusic } from '../context/MusicContext';
import SongCard from '../components/SongCard';

export default function Favorites() {
  const { favorites, playSong, toggleFavorite } = useMusic();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">❤️ Favorites</h1>
          <p className="text-sm text-white/40 mt-1">{favorites.length} saved songs</p>
        </div>
        {favorites.length > 0 && (
          <button
            onClick={() => playSong(favorites[0], favorites)}
            className="btn-primary flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            Play All
          </button>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-20 text-white/30">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
          <p className="text-lg">No favorites yet</p>
          <p className="text-sm mt-1">Heart a song to save it here</p>
        </div>
      ) : (
        <div className="space-y-1">
          {favorites.map((song, i) => (
            <SongCard key={song.id} song={song} queue={favorites} showIndex={i} />
          ))}
        </div>
      )}
    </div>
  );
}
