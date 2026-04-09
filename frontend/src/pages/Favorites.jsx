import { useState, useEffect } from 'react';
import { FiHeart, FiMusic, FiTrash2 } from 'react-icons/fi';
import { getFavorites, removeFavorite } from '../services/userAPI';
import { useMusic } from '../context/MusicContext';
import { toast } from 'react-toastify';

const Favorites = () => {
  const { playSong } = useMusic();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFavorites()
      .then((data) => setFavorites(data.favorites || []))
      .catch(() => toast.error('Failed to load favorites'))
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (songId) => {
    try {
      await removeFavorite(songId);
      setFavorites((prev) => prev.filter((id) => id !== songId));
      toast.success('Removed from favorites');
    } catch {
      toast.error('Failed to remove from favorites');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
          <FiHeart className="text-red-400" /> Favorites
        </h1>
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="glass-card rounded-xl p-4 flex items-center gap-4 animate-pulse">
              <div className="w-12 h-12 rounded-lg shimmer" />
              <div className="flex-1">
                <div className="h-3 shimmer rounded mb-2 w-48" />
                <div className="h-2 shimmer rounded w-32" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
        <FiHeart className="text-red-400 fill-current" /> Favorites
      </h1>

      {favorites.length === 0 ? (
        <div className="text-center py-20">
          <FiHeart size={48} className="mx-auto text-white/20 mb-4" />
          <h2 className="text-lg font-semibold text-white/50 mb-2">No favorites yet</h2>
          <p className="text-white/30">Heart songs while listening to save them here</p>
        </div>
      ) : (
        <>
          <p className="text-white/40 text-sm mb-6">{favorites.length} saved songs</p>
          <div className="space-y-1">
            {favorites.map((songId, index) => (
              <div
                key={songId}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all group"
              >
                <span className="text-white/20 text-sm w-6 text-right flex-shrink-0">{index + 1}</span>

                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/40 to-accent/30 flex items-center justify-center flex-shrink-0">
                  <FiMusic size={16} className="text-white/40" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{songId}</p>
                  <p className="text-xs text-white/40">Saved song</p>
                </div>

                <button
                  onClick={() => handleRemove(songId)}
                  className="p-2 text-red-400/50 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
      <div className="h-24" />
    </div>
  );
};

export default Favorites;
