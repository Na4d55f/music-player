import { FiMusic, FiMoreVertical, FiTrash2, FiEdit2, FiLock, FiUnlock } from 'react-icons/fi';
import { useState } from 'react';

const PlaylistCard = ({ playlist, onClick, onDelete, onEdit, showMenu = true }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setMenuOpen((o) => !o);
  };

  const handleAction = (e, action) => {
    e.stopPropagation();
    setMenuOpen(false);
    action();
  };

  const coverImage = playlist.coverImage || playlist.songs?.[0]?.image;

  return (
    <div
      className="glass-card-hover rounded-xl p-4 cursor-pointer group relative transition-all duration-300 hover:shadow-glow-purple"
      onClick={onClick}
    >
      {/* Cover */}
      <div className="aspect-square rounded-lg overflow-hidden mb-3 relative">
        {coverImage ? (
          <img
            src={coverImage}
            alt={playlist.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/40 to-accent/30 flex items-center justify-center">
            <FiMusic size={32} className="text-white/30" />
          </div>
        )}

        {/* Hover play overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-glow">
            <FiMusic size={20} className="text-white" />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-white text-sm truncate">{playlist.name}</h3>
          <p className="text-white/40 text-xs mt-0.5">
            {playlist.songs?.length || 0} songs
            {playlist.isPublic ? (
              <span className="ml-2 inline-flex items-center gap-1 text-accent">
                <FiUnlock size={10} /> Public
              </span>
            ) : (
              <span className="ml-2 inline-flex items-center gap-1 text-white/30">
                <FiLock size={10} /> Private
              </span>
            )}
          </p>
        </div>

        {showMenu && (onDelete || onEdit) && (
          <div className="relative ml-2">
            <button
              onClick={handleMenuClick}
              className="p-1 text-white/30 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
            >
              <FiMoreVertical size={16} />
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-1 w-40 glass-card border border-white/10 rounded-lg shadow-glass z-20 overflow-hidden">
                  {onEdit && (
                    <button
                      onClick={(e) => handleAction(e, onEdit)}
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all"
                    >
                      <FiEdit2 size={14} /> Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={(e) => handleAction(e, onDelete)}
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 transition-all"
                    >
                      <FiTrash2 size={14} /> Delete
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistCard;
